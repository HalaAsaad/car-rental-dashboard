import React from "react";
import Button from "@mui/material/Button";
import { Snackbar } from "@mui/material";
import axiosInstance from "../../axiosInstance";

const RemoveDialog = ({
  open,
  setOpen,
  endpoint,
  itemId,
  setRefresh,
  Refresh,
  message,
  applyLabel,
  handleSave,
}) => {
  const handleRemove = () => {
    axiosInstance.delete(`${endpoint}/${itemId}`).then((res) => {
      //   console.log("delete res ", res);
      if (res?.statusText === "OK") {
        setOpen(false);
        setRefresh(!Refresh);
      }
    });
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      open={open}
      onClose={() => setOpen(false)}
      message={message ? message : "Are you sure to delete item?"}
      action={
        <Button
          color="error"
          variant="contained"
          size="small"
          onClick={handleSave ? handleSave : handleRemove}
          style={{ textTransform: "capitalize" }}
        >
          {applyLabel ? applyLabel : "Delete"}
        </Button>
      }
    />
  );
};

export default RemoveDialog;
