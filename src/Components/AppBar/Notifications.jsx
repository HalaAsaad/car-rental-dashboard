import React, { useState, useEffect } from "react";
import { Divider, Box, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useNavigate } from "react-router-dom";

const notificationss = [
  {
    _id: "676dee004ecfd30beae23f69",
    type: "returnReminder",
    message: "AB123 return date is today 2024-12-27",
    targetVehicle: "676d79664ecfd30beae2388c",
    targetOrder: "676d79db4ecfd30beae23921",
    isRead: true,
    link: "/orders/676d79db4ecfd30beae23921",
    createdAt: "2024-12-27T00:00:00.931Z",
    updatedAt: "2024-12-27T14:09:20.108Z",
    __v: 0,
  },
  {
    _id: "6768a801c5e4eaad6e2b0974",
    type: "maintenanceReminder",
    message: "DCWA-583 scheduled maintenance is today: 2024-12-23",
    targetVehicle: "673bc39c0f16e58a118f2012",
    isRead: true,
    link: "/vehicle/673bc39c0f16e58a118f2012/maintenance",
    createdAt: "2024-12-23T00:00:01.107Z",
    updatedAt: "2024-12-23T19:01:35.338Z",
    __v: 0,
  },
  {
    _id: "6768a800c5e4eaad6e2b0972",
    type: "maintenanceReminder",
    message: "DCWA-763 scheduled maintenance is today: 2024-12-23",
    targetVehicle: "673bc30c0f16e58a118f1ffd",
    isRead: true,
    link: "/vehicle/673bc30c0f16e58a118f1ffd/maintenance",
    createdAt: "2024-12-23T00:00:00.945Z",
    updatedAt: "2024-12-23T19:01:35.347Z",
    __v: 0,
  },
  {
    _id: "67675680c5e4eaad6e2b0888",
    type: "paymentReminder",
    message:
      "Reminder: Your rental for Order ORD-0001 (Car Model: CIVIC TOURING) starts today!",
    targetVehicle: "673bc30c0f16e58a118f1ffd",
    targetOrder: "6766be4ac5e4eaad6e2b06a1",
    isRead: true,
    link: "/orders/6766be4ac5e4eaad6e2b06a1",
    createdAt: "2024-12-22T00:00:00.747Z",
    updatedAt: "2024-12-23T19:01:35.341Z",
    __v: 0,
  },
  {
    _id: "67675680c5e4eaad6e2b0886",
    type: "paymentReminder",
    message:
      "Reminder: Your rental for Order ORD-0001 (Car Model: ELENTRA) starts today!",
    targetVehicle: "673bc2310f16e58a118f1fb3",
    targetOrder: "6766be4ac5e4eaad6e2b06a1",
    isRead: true,
    link: "/orders/6766be4ac5e4eaad6e2b06a1",
    createdAt: "2024-12-22T00:00:00.585Z",
    updatedAt: "2024-12-23T19:01:35.346Z",
    __v: 0,
  },
];
function Notifications({ notifications, NotReaddCountInside }) {
  const navigate = useNavigate();

  // const [ViewAll, setViewAll] = useState(false);
  const [page, setPage] = useState(1);
  const [LoadedData, setLoadedData] = useState([]);
  const rowPerPage = 6;
  const renderMessage = (text) => (
    <Typography
      sx={{
        color: "#191919",
        fontWeight: 400,
        fontSize: "13px",
        lineHeight: "14px",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </Typography>
  );
  const renderMessageSpan = (text) => (
    <Typography
      sx={{
        color: "#EF0A0A",
        fontWeight: 500,
        fontSize: "13px",
        lineHeight: "14px",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </Typography>
  );
  useEffect(() => {
    //  if(LoadedData?.length < notificationss?.length) {

    //  }
    let slicedData = notifications?.slice(
      (page - 1) * rowPerPage,
      (page - 1) * rowPerPage + rowPerPage
    );
    setLoadedData((prev) => [...prev, ...(slicedData || [])]);
  }, [page, notifications]);

  function navigateToVehicle(id) {
    navigate(`/vehicles/details/${id}`);
  }
  function navigateToMaintenance(id) {
    navigate(`/vehicles/maintenance/${id}`);
  }
  function navigateToOrderDetails(id) {
    navigate(`/orders/view/${id}`);
  }
  return (
    <Stack
      sx={{ height: "100%" }}
      direction={"column"}
      justifyContent={"space-between"}
    >
      <Grid container spacing={2} p={2}>
        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography
              sx={{ color: "#1A1919", fontWeight: 500, fontSize: "16px" }}
            >
              Notifications
            </Typography>
            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
              justifyContent={"center"}
              sx={{
                width: "30px",
                height: "30px",
                background: "#FFECEC",
                borderRadius: "50%",
                padding: "7px",
                color: "#EF0A0A",
                fontWeight: 400,
                fontSize: "14px",
              }}
            >
              {NotReaddCountInside}
            </Box>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
          <Divider />
        </Grid>
        {
          // notificationss
          //   ?.slice((page - 1) * rowPerPage, (page - 1) * rowPerPage + rowPerPage)

          // ?.slice(0, ViewAll ? notifications?.length : 6)
          LoadedData?.map((n, i) => {
            let array = n?.message?.split(" ");
            let messageArray = n?.message?.split(" ");
            messageArray.pop();
            messageArray.shift();
            let carNum = array[0];
            let date = array[array.length - 1];

            //           for notifications we'll have:
            // * vehicle return date reminder: {Vehicle number} return date is today {Today's date}
            // * Maintenance reminder: {Vehicle number} scheduled maintenance  is today {Today's date}
            // * Payment reminder: {Order number} {weekly/biweekly/monthly} payment is due today {today's date}

            return (
              <Grid key={i} size={{ xs: 12, sm: 12, md: 12 }}>
                <Stack spacing={1} direction={"column"}>
                  <Stack spacing={1} direction={"row"} alignItems={"center"}>
                    <img src="/images/alert.png" />
                    {n.type === "maintenanceReminder" && (
                      <Stack
                        sx={{ cursor: "pointer" }}
                        onClick={() => navigateToMaintenance(n.targetVehicle)}
                        spacing={1}
                        direction={"column"}
                      >
                        <Stack
                          spacing={1}
                          direction={"row"}
                          alignItems={"center"}
                        >
                          {renderMessage("Maintenance reminder: ")}
                          {renderMessageSpan(carNum)}
                        </Stack>
                        <Stack
                          spacing={1}
                          direction={"row"}
                          alignItems={"center"}
                        >
                          {renderMessage(" scheduled maintenance is today ")}
                          {renderMessageSpan(date)}
                        </Stack>
                      </Stack>
                    )}
                    {n.type === "returnReminder" && (
                      <Stack
                        sx={{ cursor: "pointer" }}
                        onClick={() => navigateToVehicle(n.targetVehicle)}
                        spacing={1}
                        direction={"column"}
                      >
                        <Stack
                          spacing={1}
                          direction={"row"}
                          alignItems={"center"}
                        >
                          {renderMessage("vehicle return date reminder: ")}
                          {renderMessageSpan(carNum)}
                        </Stack>
                        <Stack
                          spacing={1}
                          direction={"row"}
                          alignItems={"center"}
                        >
                          {renderMessage(" return date is today ")}
                          {renderMessageSpan(date)}
                        </Stack>
                      </Stack>
                    )}
                    {n.type === "paymentReminder" && (
                      <Typography
                        sx={{
                          color: "#191919",
                          fontWeight: 400,
                          fontSize: "13px",
                          lineHeight: "14px",
                          cursor: "pointer",
                        }}
                        onClick={() => navigateToOrderDetails(n.targetOrder)}
                      >
                        {n.message}
                      </Typography>
                    )}
                  </Stack>
                  <Divider />
                </Stack>
              </Grid>
            );
          })
        }
      </Grid>
      {LoadedData?.length < notifications?.length && (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          sx={{
            backgroundColor: "#FFEFEF",
            height: "40px",
            borderBottomLeftRadius: "15px",
            borderBottomRightRadius: "15px",
            cursor: "pointer",
            marginTop: "auto",
          }}
          onClick={() => {
            // setViewAll(!ViewAll);
            setPage((prev) => prev + 1);
          }}
        >
          <Typography
            fontWeight={400}
            sx={{ color: "#EF0A0A", fontSize: "12px", lineHeight: "24px" }}
          >
            View all
            {/* {ViewAll ? "View less" : "View all"} */}
          </Typography>
        </Box>
      )}
    </Stack>
  );
}

export default Notifications;
