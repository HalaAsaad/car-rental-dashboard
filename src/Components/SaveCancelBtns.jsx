import React from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

function SaveCancelBtns({
  cancelLabel,
  handleCancel,
  handleSave,
  loading,
  disabledSave,
  hideCancel,
  hideSave,
}) {
  const navigate = useNavigate();
  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      mb={2}
      mt={2}
    >
      {!hideCancel && (
        <Button
          variant="outlined"
          onClick={() => {
            if (typeof handleCancel === "function") {
              handleCancel();
            } else {
              navigate(-1);
            }
          }}
          color="secondary"
          size="small"
          sx={{ width: "140px", padding: "7px", textTransform: "none" }}
        >
          {cancelLabel ? cancelLabel : "Cancel"}
        </Button>
      )}
      {!hideSave && (
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading || disabledSave}
          color="secondary"
          size="small"
          sx={{
            width: "140px",
            padding: "7px",
            marginLeft: "10px",
            textTransform: "none",
          }}
        >
          {loading && (
            <CircularProgress
              sx={{
                width: "20px !important",
                height: "20px !important",
                marginRight: "20px",
              }}
            />
          )}
          Save
        </Button>
      )}
    </Box>
  );
}

export default SaveCancelBtns;
