import styled from "styled-components";

import Skeleton from "./Skeleton";

const TableSkeleton = ({ size }: { size: number }) => {
  const skeletonLength = Array(size + 1).fill(1);

  return (
    <Box>
      <div className="main">
        {skeletonLength.map((_: 1, idx) => (
          <Skeleton width={"100%"} height={"50px"} key={idx} />
        ))}
      </div>
      <div className="sub">
        <Skeleton width={"60%"} height={"56px"} />
      </div>
    </Box>
  );
};

export default TableSkeleton;

const Box = styled.div`
  width: 90%;
  padding: 40px 0px;
  .main {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 5.5px;
    margin-bottom: 40px;
  }
  .sub {
    display: flex;
    justify-content: flex-end;
  }
`;
