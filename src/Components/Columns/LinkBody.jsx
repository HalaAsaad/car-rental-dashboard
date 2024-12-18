import React from "react";
import { Stack } from "@mui/material";
import { Link } from "react-router-dom";

function LinkBody({ value, to }) {
  return (
    <>
      <Stack
        direction={"column"}
        justifyContent={"center"}
        sx={{ height: "100%" }}
      >
        <Link
          style={{
            fontFamily: "Montserrat",
            fontSize: "0.875rem",
            fontWeight: 400,
            lineHeight: "19.6px",
            textAlign: "left",
            color: "#201D23CC",
          }}
          to={to}
        >
          {value}
        </Link>
      </Stack>
    </>
  );
}

export default LinkBody;
