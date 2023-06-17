import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Result, Input, Form, Radio, RadioChangeEvent } from "antd";
import { styled } from "styled-components";

import { getDbDataByDocName } from "../../util/firebase";
import { generateRandomCode } from "../../util/random";
import { getQuizDatas } from "../../util/api";
import { useLoadingAndError } from "../../hooks/useLoadingAndError";
import {
  FORM_CODE_RULES,
  FORM_NICKNAME_RULES,
  QUIZ_LEVEL_ITEMS,
  QUIZ_UESR_OPTIONS,
} from "../../constants";
import { HomeFormItem, UserData, UserOption } from "../../types";
import { useSetQuizAppState } from "../../hooks/useSetQuizAppState";

const HomePage = () => {
  const { handleLoading, handleError } = useLoadingAndError();

  const navigate = useNavigate();

  const [userOption, setUserOption] = useState<UserOption>("new");

  const { setCurrentNavItem, setUserId, setQuizDatas, setQuizLevel } =
    useSetQuizAppState();

  const isExistingUser = userOption === "existing";

  const initialValues = {
    level: 10,
    userOption: "new",
  };

  const onChange = useCallback((e: RadioChangeEvent) => {
    setUserOption(e.target.value);
  }, []);

  const onFinish = useCallback(async (values: HomeFormItem) => {
    handleLoading();

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

    setCurrentNavItem("퀴즈"); //네비 디폴트가 홈이다보니 퀴즈 중 다른 페이지로 이동했을 때, 홈으로 고정되어버리는 문제를 막기 위함

    handleLoading();

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
            <Form.Item name="nickname" rules={FORM_NICKNAME_RULES}>
              <Input maxLength={10} placeholder="닉네임을 입력해주세요." />
            </Form.Item>
            {isExistingUser && (
              <Form.Item name="code" rules={FORM_CODE_RULES}>
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
