import React from "react";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { Stack, Typography } from "@mui/material";
import dayjs from "dayjs";

function DateTimeBody({ value, color, hideIcon }) {
  return (
    <>
      <Stack
        direction={"row"}
        justifyContent={"flex-start"}
        alignItems={"center"}
        spacing={1}
        sx={{ height: "100%", color: color ? color : "#000" }}
      >
        {!hideIcon && <EventAvailableIcon fontSize="small" />}
        <Typography variant="subtitle2">
          {dayjs(value).format("lll")}
        </Typography>
      </Stack>
    </>
  );
}

export default DateTimeBody;
