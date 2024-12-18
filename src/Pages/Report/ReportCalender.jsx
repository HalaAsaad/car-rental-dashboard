import React from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  Menu,
  IconButton,
} from "@mui/material";
import dayjs from "dayjs";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Calendar } from "react-multi-date-picker";

function ReportCalender({
  anchorEl,
  setAnchorEl,
  from,
  to,
  helperFrom,
  helperTo,
  buttonId,
  menuId,
  // open,
  // handleClick,
  // handleClose,
  onChange,
  onOk,
}) {
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
        sx={{
          //  width: "300px",
          padding: "5px",
          border: "1px solid #DEDEDE",
          borderRadius: "10px",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Montserrat",
            fontSize: "12px",
            fontWeight: 400,
            lineHeight: "24px",
            color: "#6565756B",
            whiteSpace: "nowrap",
          }}
          textAlign={"left"}
        >
          {dayjs(from).format("D MMM YYYY")} - {dayjs(to).format("D MMM YYYY")}
        </Typography>
        <IconButton
          id={buttonId}
          aria-controls={open ? menuId : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <KeyboardArrowDownIcon sx={{ color: "#6565756B" }} />
        </IconButton>
      </Box>
      <Menu
        id={menuId}
        aria-labelledby={buttonId}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            width: "300px",
            left: 1500,
            padding: "10px",
            boxShadow: "0px 4px 12px 0px #0000001F",
          },
        }}
        slotProps={{
          paper: {
            width: "300px",
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1,
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Stack direction={"column"} spacing={1}>
          <Calendar
            className="red report-calendar"
            value={[new Date(helperFrom), new Date(helperTo)]}
            onChange={(ranges) => onChange(ranges)}
            range
            // rangeHover
          />
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"flex-end"}
            sx={{ width: "100%" }}
          >
            <Button
              variant="outlined"
              color="secondary"
              sx={{
                width: "40px",
                textTransform: "capitalize",
                marginRight: "10px",
              }}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="secondary"
              sx={{ width: "40px" }}
              onClick={onOk}
            >
              Ok
            </Button>
          </Box>
        </Stack>
      </Menu>
    </>
  );
}

export default ReportCalender;
