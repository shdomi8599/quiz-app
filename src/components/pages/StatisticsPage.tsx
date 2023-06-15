import { useCallback, useMemo } from "react";
import { styled } from "styled-components";

import { useGetUsersData } from "../../hooks/user/useGetUsersData";
import { ResultTableItem } from "../../types";

import StatisticsChart from "../chart/StatisticsChart";

const StatisticsPage = () => {
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

  const calculateAccuracy = useCallback((correct: number, total: number) => {
    return (correct / total) * 100;
  }, []);

  const accuracyData = useMemo(
    () =>
      formatStatisticsData?.map((data) => {
        if (data) {
          return calculateAccuracy(
            data.correctAnswersCount,
            data.allAnswersCount
          );
        }
      }),
    [formatStatisticsData]
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
      <StatisticsChart distributionData={distributionData} />
    </Box>
  );
};

export default StatisticsPage;

const Box = styled.main``;
