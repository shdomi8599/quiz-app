import { memo, useMemo } from "react";
import styled from "styled-components";

import Skeleton from "./Skeleton";

const TableSkeleton = ({ size }: { size: number }) => {
  const skeletonLength = useMemo(() => Array(size + 1).fill(1), [size]);

  return (
    <Box>
      <div className="main">
        {skeletonLength.map((_: 1, idx) => (
          <Skeleton width={"100%"} height={"50px"} key={idx} />
        ))}
      </div>
      <div className="sub">
        <Skeleton width={"60%"} height={"32px"} />
      </div>
    </Box>
  );
};

export default memo(TableSkeleton);

const Box = styled.div`
  width: 80%;
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
