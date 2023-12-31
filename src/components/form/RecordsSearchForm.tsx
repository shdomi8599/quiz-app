import { Form, Input, Result, Select } from "antd";
import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { styled } from "styled-components";

import { FORM_CODE_RULES, FORM_NICKNAME_RULES } from "../../constants";
import { RecordsSearchFormItem, ResultItem } from "../../types";
import { formatSelectItems } from "../../util/format";

import CommonBtn from "../btn/CommonBtn";
import ResultSelectBox from "./ResultSelectBox";

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

  const mainResultTitle = useMemo(
    () =>
      isRetryPage ? "다시 도전을 시도해보세요!" : "오답노트를 작성해주세요!",
    [isRetryPage]
  );

  const selectResultTitle = useMemo(
    () =>
      isRetryPage
        ? "날짜를 선택하면 바로 재도전이 시작됩니다."
        : "날짜를 선택하면 오답노트를 작성할 수 있습니다.",
    [isRetryPage]
  );

  const selectWord = useMemo(
    () => (isRetryPage ? "도전" : "조회"),
    [isRetryPage]
  );

  const selectItemsOptions = useMemo(
    () => resultsData && formatSelectItems(resultsData),
    [resultsData]
  );

  const SelectBox = useMemo(
    () => (
      <Select
        onChange={handleResultChange}
        className="select"
        placeholder={`${selectWord}를 원하는 날짜를 선택해주세요.`}
        options={selectItemsOptions}
      />
    ),
    [selectItemsOptions, selectWord, handleResultChange]
  );

  return (
    <Box>
      {selectItemsOptions ? (
        <ResultSelectBox title={selectResultTitle} extra={SelectBox} />
      ) : (
        <Result
          style={{
            minWidth: 350,
          }}
          title={mainResultTitle}
          extra={
            <Form autoComplete="off" onFinish={onFinish}>
              <Form.Item name="nickname" rules={FORM_NICKNAME_RULES}>
                <Input maxLength={10} placeholder="닉네임을 입력해주세요." />
              </Form.Item>
              <Form.Item name="code" rules={FORM_CODE_RULES}>
                <Input
                  maxLength={5}
                  placeholder="#을 포함한 숫자 4자리를 입력해주세요."
                />
              </Form.Item>
              <CommonBtn type="primary" htmlType="submit">
                {btnName}
              </CommonBtn>
            </Form>
          }
        />
      )}
    </Box>
  );
};
export default RecordsSearchForm;

const Box = styled.main`
  form {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .select {
    width: 100%;
  }
`;
