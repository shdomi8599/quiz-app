import { Pagination, Table, Form } from "antd";
import styled from "styled-components";
import { TableColumn } from "../../types";

type Props<T> = {
  dataSource: T[];
  columns: TableColumn[];
  page: number;
  size: number;
  handlePageChange: (page: number, size: number) => void;
  totalElements: number;
};

const TableContent = <T extends object>({
  page,
  size,
  handlePageChange,
  dataSource,
  columns,
  totalElements,
}: Props<T>) => {
  return (
    <Box>
      <Table
        className="table"
        style={{ width: "100%" }}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
      />
      <Pagination
        className="pagination"
        current={page}
        pageSize={size}
        onChange={handlePageChange}
        total={totalElements}
      />
    </Box>
  );
};
export default TableContent;

const Box = styled.div`
  padding: 40px 0px;
  width: 90%;
  position: relative;
  .bottom {
    display: flex;
    justify-content: space-between;
    @media (max-width: 640px) {
      flex-direction: column;
      gap: 16px;
    }
    .search-box {
      display: flex;
      gap: 8px;
      @media (max-width: 480px) {
        flex-direction: column;
        align-items: center;
        .ant-form-item {
          margin-bottom: 4px;
        }
      }
      .select {
        min-width: 100px;
      }
      .input {
        min-width: 184px;
      }
      .ant-form-item-explain-error {
        min-width: 184px;
      }
    }
  }

  .btn-box {
    position: absolute;
    top: -4px;
    right: 0px;
  }

  .table {
    margin-bottom: 40px;
    min-height: 605px;
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
  }
  thead {
    th:first-child {
      text-align: center;
    }
  }
  td:first-child {
    text-align: center;
  }
`;
