import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Result, Input, Form, Radio, RadioChangeEvent } from "antd";
import { styled } from "styled-components";
import { useSetRecoilState } from "recoil";

import {
  currentNavItemState,
  quizDatasState,
  quizLevelState,
  userIdState,
} from "../../recoil";
import { getDbDataByDocName, setDbData } from "../../util/firebase";
import { generateRandomCode } from "../../util/random";
import { getQuizDatas } from "../../util/api";
import { errorAlert } from "../common/Alert";
import { useCommonLoading } from "../../hooks/useCommonLoading";
import { QUIZ_LEVEL_ITEMS, QUIZ_UESR_OPTIONS } from "../../constants";
import { HomeFormItem, UserData, UserOption } from "../../types";

const HomePage = () => {
  const { handleCommonLoading } = useCommonLoading();

  const navigate = useNavigate();

  const [userOption, setUserOption] = useState<UserOption>("new");

  const setCurrentNavItem = useSetRecoilState(currentNavItemState);

  const setUserId = useSetRecoilState(userIdState);

  const setQuizDatas = useSetRecoilState(quizDatasState);

  const setQuizLevel = useSetRecoilState(quizLevelState);

  const isExistingUser = userOption === "existing";

  const initialValues = {
    level: 10,
    userOption: "new",
  };

  const onChange = useCallback((e: RadioChangeEvent) => {
    setUserOption(e.target.value);
  }, []);

  const handleError = useCallback((mode: "퀴즈" | "유저") => {
    handleCommonLoading();
    if (mode === "퀴즈") {
      errorAlert("잠시 후에 다시 시도해주세요.", "퀴즈");
    }
    if (mode === "유저") {
      errorAlert("닉네임이 존재하지 않습니다.", "기존 유저");
    }
  }, []);

  const onFinish = useCallback(async (values: HomeFormItem) => {
    handleCommonLoading();

    const { userOption, nickname, level, code } = values;

    setQuizLevel(level);

    if (userOption === "new") {
      const newCode = generateRandomCode(4);

      const userId = nickname + newCode;

      setUserId(userId);
    }

    if (userOption === "existing") {
      const userId = nickname + code;

      const userData = await getDbDataByDocName<UserData>("users", userId);

      if (userData) {
        setUserId(userId);
      } else {
        return handleError("유저");
      }
    }

    const quizDatas = await getQuizDatas(level);

    if (quizDatas) {
      setQuizDatas(quizDatas);
    } else {
      return handleError("퀴즈");
    }

    setCurrentNavItem("퀴즈"); //네비 디폴트가 홈이다보니 퀴즈 중 다른 페이지로 이동했을 때, 한 번씩 밀리는 현상을 막기 위함

    handleCommonLoading();

    navigate("/quiz/1");
  }, []);

  return (
    <Box>
      <Result
        status="warning"
        title={"정말 퀴즈에 참가하시겠습니까?"}
        extra={
          <Form
            initialValues={initialValues}
            className="form-box"
            autoComplete="off"
            onFinish={onFinish}
          >
            <Form.Item name="userOption">
              <Radio.Group onChange={onChange}>
                {QUIZ_UESR_OPTIONS.map(({ label, value }) => (
                  <Radio key={label} value={value}>
                    {label}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name="nickname"
              rules={[
                {
                  required: true,
                  message: "닉네임을 입력해야 참가할 수 있습니다.",
                },
              ]}
            >
              <Input maxLength={10} placeholder="닉네임을 입력해주세요." />
            </Form.Item>
            {isExistingUser && (
              <Form.Item
                name="code"
                rules={[
                  {
                    required: true,
                    message: "#을 포함한 숫자를 입력해야 참가할 수 있습니다.",
                  },
                ]}
              >
                <Input
                  maxLength={5}
                  placeholder="#을 포함한 숫자 4자리를 입력해주세요."
                />
              </Form.Item>
            )}
            <Form.Item label="난이도" name="level">
              <Radio.Group>
                {QUIZ_LEVEL_ITEMS.map(({ label, value }) => (
                  <Radio key={label} value={value}>
                    {label}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
            <Button type="primary" htmlType="submit">
              퀴즈 풀기
            </Button>
          </Form>
        }
      />
    </Box>
  );
};

export default HomePage;

const Box = styled.main`
  .form-box {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`;
