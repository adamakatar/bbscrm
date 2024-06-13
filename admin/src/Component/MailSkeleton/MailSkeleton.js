import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import React from "react";

const MailSkeleton = () => {
  return (
    <div>
      <Stack spacing={1}>
        <div style={{ marginBottom: "10px", marginTop: "10px" }}>
          <Skeleton variant="rounded" width={150} height={25} />
        </div>
        <Skeleton variant="rounded" width={"100%"} height={17} />
        <Skeleton variant="rounded" width={"100%"} height={17} />
        <Skeleton variant="rounded" width={"100%"} height={17} />
        <Skeleton variant="rounded" width={"100%"} height={17} />
      </Stack>
    </div>
  );
};

export default MailSkeleton;
