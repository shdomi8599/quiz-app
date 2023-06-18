import { Pagination, Table } from "antd";
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
        dataSource={dataSource}
        columns={columns}
        pagination={false}
      />
      <Pagination
        className="pagination"
        current={page}
        pageSize={size}
        showSizeChanger
        onChange={handlePageChange}
        total={totalElements}
      />
    </Box>
  );
};
export default TableContent;

const Box = styled.div`
  width: 80%;
  position: relative;

  .table {
    margin-bottom: 40px;
    min-height: 605px;
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
  }

  .ant-table-thead {
    tr {
      th {
        text-align: center;
      }
    }
  }

  .ant-table-cell {
    text-align: center;
  }
`;
