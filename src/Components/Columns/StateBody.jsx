import React from "react";
import CircleIcon from "@mui/icons-material/Circle";
import { Stack, Typography } from "@mui/material";

function StateBody({ color, value }) {
  return (
    <>
      <Stack
        direction={"row"}
        justifyContent={"flex-start"}
        alignItems={"center"}
        spacing={2}
        sx={{ height: "100%" }}
      >
        <CircleIcon sx={{ color: color }} fontSize="small" />
        <Typography
          variant="subtitle2"
          sx={{ color: color, textTransform: "capitalize" }}
        >
          {value?.replace("_", " ")}
        </Typography>
      </Stack>
    </>
  );
}

export default StateBody;
