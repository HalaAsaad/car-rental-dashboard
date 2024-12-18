import React from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Stack, Typography } from "@mui/material";
import dayjs from "dayjs";

function TimeBody({ value }) {
  return (
    <>
      <Stack
        direction={"row"}
        justifyContent={"flex-start"}
        alignItems={"center"}
        spacing={1}
        sx={{ height: "100%", color: "#000" }}
      >
        <AccessTimeIcon fontSize="small" />
        <Typography variant="subtitle2">{dayjs(value).format("LT")}</Typography>
      </Stack>
    </>
  );
}

export default TimeBody;
