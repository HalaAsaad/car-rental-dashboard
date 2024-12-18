import React from "react";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { Stack, Typography } from "@mui/material";

function DateBody({ value }) {
  return (
    <>
      <Stack
        direction={"row"}
        justifyContent={"flex-start"}
        alignItems={"center"}
        spacing={1}
        sx={{ height: "100%", color: "#000" }}
      >
        <EventAvailableIcon fontSize="small" />
        <Typography variant="subtitle2">
          {new Date(value).toDateString()}
        </Typography>
      </Stack>
    </>
  );
}

export default DateBody;
