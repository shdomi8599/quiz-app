import { Button, Form, Input, Result, Select } from "antd";
import { useMemo } from "react";
import { styled } from "styled-components";

import { formatDate } from "../../util/format";
import { RecordsSearchFormItem, ResultItem } from "../../types";
import { useLocation } from "react-router-dom";

type Props = {
  resultsData?: ResultItem[];
  handleResultChange: (value: number) => void;
  btnName: string;
  onFinish: (values: RecordsSearchFormItem) => Promise<void>;
};

const RecordsSearchForm = ({
  resultsData,
  handleResultChange,
  onFinish,
  btnName,
}: Props) => {
  const location = useLocation();

  const { pathname } = location;

  const isRetryPage = pathname.includes("retry");

  const selectWord = isRetryPage ? "도전" : "조회";

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

  const SelectBox = useMemo(
    () => (
      <Select
        onChange={handleResultChange}
        className="select"
        placeholder={`${selectWord}를 원하는 날짜를 선택해주세요.`}
        options={formatSelectItems}
      />
    ),
    [formatSelectItems, selectWord]
  );

  return (
    <Box>
      {formatSelectItems ? (
        <>
          {isRetryPage ? (
            <Result
              status="warning"
              title={"날짜를 선택하면 바로 재도전이 시작됩니다."}
              extra={SelectBox}
            />
          ) : (
            SelectBox
          )}
        </>
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
            {btnName}
          </Button>
        </Form>
      )}
    </Box>
  );
};
export default RecordsSearchForm;

const Box = styled.main`
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin: 20px 0px;

  .select {
    width: 90%;
    max-width: 500px;
  }

  form {
    max-width: 350px;
    width: 90%;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`;
