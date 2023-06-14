import { useNavigate } from "react-router-dom";
import { Button, Result, Input, Form } from "antd";
import { styled } from "styled-components";
import { useSetRecoilState } from "recoil";

import { currentNavItemState, quizDatasState, userIdState } from "../../recoil";
import { setDbData } from "../../util/firebase";
import { generateRandomCode } from "../../util/random";
import { getQuizDatas } from "../../util/api";
import { errorAlert } from "../common/Alert";

const HomePage = () => {
  const navigate = useNavigate();

  const setCurrentNavItem = useSetRecoilState(currentNavItemState);

  const setUserId = useSetRecoilState(userIdState);

  const setQuizDatas = useSetRecoilState(quizDatasState);

  const onFinish = async (values: { nickname: string }) => {
    const { nickname } = values;
    const code = generateRandomCode(4);
    const userId = nickname + code;

    const userData = {
      userId,
    };

    await setDbData("users", userId, userData)
      .then(() => {
        setUserId(userId);
        setCurrentNavItem("quiz");
      })
      .catch(() => errorAlert("잠시 후에 다시 시도해주세요.", "퀴즈"));

    await getQuizDatas(10).then((datas) => {
      setQuizDatas(datas);
    });

    navigate("/quiz/1");
  };

  return (
    <Box>
      <Result
        status="warning"
        title={"정말 퀴즈에 참가하시겠습니까?"}
        extra={
          <Form className="form-box" autoComplete="off" onFinish={onFinish}>
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
