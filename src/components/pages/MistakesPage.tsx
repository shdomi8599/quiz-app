import { Button, Carousel, Form, Input, Select } from "antd";
import { useRecoilState, useRecoilValue } from "recoil";
import { useCallback, useEffect, useMemo, useState } from "react";
import { styled } from "styled-components";

import { userDataState } from "../../recoil/atom";
import { resultsDataState } from "../../recoil/selector";
import { getDbDataByDocName } from "../../util/firebase";
import { formatDate } from "../../util/format";
import { MistakeFormItem, ResultItem, UserData } from "../../types";
import { useLoadingAndError } from "../../hooks/useLoadingAndError";

import QuizCard from "../common/QuizCard";

const MistakesPage = () => {
  const { handleLoading, handleError } = useLoadingAndError();

  const [, setUserData] = useRecoilState(userDataState);

  const resultsData = useRecoilValue(resultsDataState);

  const [viewData, setViewData] = useState<ResultItem>();

  const [selectedResult, setSelectedResult] = useState<number>();

  const [quizPage, setQuizPage] = useState(1);

  const formatSelectItems = useMemo(
    () =>
      resultsData?.map(({ createdAt }, idx) => {
        const date = formatDate(new Date(createdAt.seconds * 1000));
        return {
          value: idx,
          label: date,
        };
      }),
    [resultsData]
  );

  const handleChange = useCallback((value: number) => {
    setSelectedResult(value);
  }, []);

  const onChange = useCallback((currentSlide: number) => {
    setQuizPage(currentSlide);
  }, []);

  const onFinish = useCallback(async (values: MistakeFormItem) => {
    handleLoading();
    const { nickname, code } = values;

    const userId = nickname + code;

    const dbUserData = await getDbDataByDocName<UserData>("users", userId);

    if (dbUserData) {
      setUserData(dbUserData);
    } else {
      return handleError("유저");
    }

    handleLoading();
  }, []);

  useEffect(() => {
    if (resultsData) {
      setViewData(resultsData[selectedResult as number]);
    }
  }, [selectedResult]);

  return (
    <>
      {viewData && (
        <CarouselBox afterChange={onChange}>
          {viewData.wrongAnswerQuestions.map((question) => (
            <div className="card-box">
              <QuizCard quizData={question} isViewAnswer={true} />
            </div>
          ))}
        </CarouselBox>
      )}
      <Box>
        {formatSelectItems ? (
          <Select
            onChange={handleChange}
            className="select"
            placeholder="조회를 원하는 날짜를 선택해주세요."
            options={formatSelectItems}
          />
        ) : (
          <Form autoComplete="off" onFinish={onFinish}>
            <Form.Item
              name="nickname"
              rules={[
                {
                  required: true,
                  message: "닉네임을 입력해야 조회할 수 있습니다.",
                },
              ]}
            >
              <Input maxLength={10} placeholder="닉네임을 입력해주세요." />
            </Form.Item>
            <Form.Item
              name="code"
              rules={[
                {
                  required: true,
                  message: "#을 포함한 숫자를 입력해야 조회할 수 있습니다.",
                },
              ]}
            >
              <Input
                maxLength={5}
                placeholder="#을 포함한 숫자 4자리를 입력해주세요."
              />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              오답 조회
            </Button>
          </Form>
        )}
      </Box>
    </>
  );
};

export default MistakesPage;

const CarouselBox = styled(Carousel)`
  padding: 80px calc((100% - 960px) / 2);
  padding-top: 200px;

  .card-box {
    padding: 0px 60px;
    .ant-card {
      height: 400px;
      width: 100%;
      .ant-ribbon-wrapper {
        padding: 20px;
      }
    }
  }

  .slick-dots {
    li {
      width: 100px;
      background-color: ${({ theme }) => theme.colors.sub};
    }
    .slick-active {
      width: 100px !important;
      > button {
        background-color: ${({ theme }) => theme.colors.main} !important;
      }
    }
  }
`;

const Box = styled.main`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 40px;

  .select {
    width: 40%;
  }

  form {
    width: 40%;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`;
