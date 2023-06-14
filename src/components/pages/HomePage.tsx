import { useNavigate } from "react-router-dom";
import { Button, Result, Input, Form, Radio } from "antd";
import { styled } from "styled-components";
import { useRecoilState, useSetRecoilState } from "recoil";

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
import { HomeFormItem, UserData } from "../../types";

const HomePage = () => {
  const { handleCommonLoading } = useCommonLoading();

  const navigate = useNavigate();

  const setCurrentNavItem = useSetRecoilState(currentNavItemState);

  const [userId, setUserId] = useRecoilState(userIdState);

  const setQuizDatas = useSetRecoilState(quizDatasState);

  const setQuizLevel = useSetRecoilState(quizLevelState);

  const initialValues = {
    level: 10,
    userOption: "new",
  };

  const onFinish = async (values: HomeFormItem) => {
    handleCommonLoading();

    const { userOption, nickname, level } = values;

    setQuizLevel(level);

    if (userOption === "new") {
      const code = generateRandomCode(4);
      const userId = nickname + code;

      const userData = {
        userId,
      };

      await setDbData("users", userId, userData)
        .then(() => {
          setUserId(userId);
        })
        .catch(() => {
          return errorAlert("잠시 후에 다시 시도해주세요.", "퀴즈");
        });
    }

    if (userOption === "existing") {
      const res = await getDbDataByDocName<UserData>("users", nickname);

      if (res) {
        setUserId(nickname);
      } else {
        handleCommonLoading();

        return errorAlert("닉네임이 존재하지 않습니다.", "기존 유저");
      }
    }

    await getQuizDatas(level).then((datas) => {
      setQuizDatas(datas);
    });

    setCurrentNavItem("퀴즈"); //네비 디폴트가 홈이다보니 퀴즈 중 다른 페이지로 이동했을 때, 한 번씩 밀리는 현상을 막기 위함

    handleCommonLoading();

    navigate("/quiz/1");
  };
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
              <Radio.Group>
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
    gap: 20px;
  }
`;
