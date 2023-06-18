import { useCallback, useMemo, useState } from "react";
import { Switch } from "antd";
import { styled } from "styled-components";

import { useGetUsersData } from "../../hooks/user/useGetUsersData";
import { ResultTableItem } from "../../types";

import StatisticsChart from "../chart/StatisticsChart";

const StatisticsPage = () => {
  const [onFailRate, setOnFailRate] = useState(false);

  const handleFailRate = () => {
    setOnFailRate((prev) => !prev);
  };

  const { usersData } = useGetUsersData();

  const findAnswerCount = useCallback(
    (resultTableItems: ResultTableItem[], label: string) => {
      return resultTableItems.find((item) => item.label === label)?.content;
    },
    []
  );

  const formatResultsData = useMemo(
    () => usersData?.map((data) => data.results),
    [usersData]
  );

  const flatResultsData = useMemo(
    () => formatResultsData?.flat(),
    [formatResultsData]
  );

  const formatStatisticsData = useMemo(
    () =>
      flatResultsData?.map((result) => {
        if (result) {
          const { resultTableItems } = result;

          const correctAnswersCount = findAnswerCount(
            resultTableItems,
            "정답 수"
          ) as number;

          const incorrectAnswersCount = findAnswerCount(
            resultTableItems,
            "오답 수"
          ) as number;

          const allAnswersCount = correctAnswersCount + incorrectAnswersCount;

          return {
            correctAnswersCount,
            incorrectAnswersCount,
            allAnswersCount,
          };
        }
      }),
    [flatResultsData]
  );

  const calculateAccuracy = useCallback((target: number, total: number) => {
    return (target / total) * 100;
  }, []);

  const accuracyData = useMemo(
    () =>
      formatStatisticsData?.map((data) => {
        if (data) {
          const correntCount = data.correctAnswersCount;
          const incorrectCount = data.incorrectAnswersCount;
          const allCount = data.allAnswersCount;
          if (onFailRate) {
            return calculateAccuracy(incorrectCount, allCount);
          }
          return calculateAccuracy(correntCount, allCount);
        }
      }),
    [formatStatisticsData, onFailRate]
  );

  const distributionData = useMemo(
    () =>
      accuracyData
        .reduce((acc: { x: number; y: number }[], value) => {
          const existingData = acc.find((item) => item.x === value);
          if (existingData) {
            existingData.y++;
          } else {
            acc.push({ x: value as number, y: 1 });
          }
          return acc;
        }, [])
        .sort((a, b) => {
          return a.x - b.x;
        }),
    [accuracyData]
  );

  return (
    <Box>
      <div className="switch-box">
        <Switch
          onClick={handleFailRate}
          checkedChildren="정답률"
          unCheckedChildren="실패율"
          defaultChecked
        />
      </div>
      <StatisticsChart
        distributionData={distributionData}
        onFailRate={onFailRate}
      />
    </Box>
  );
};

export default StatisticsPage;

const Box = styled.main`
  display: flex;
  flex-direction: column;

  .switch-box {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
`;
