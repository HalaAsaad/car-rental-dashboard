import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Stack,
  Typography,
  Card,
  CircularProgress,
  Pagination,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import { AppContext } from "../../Context/AppContext";
import { addCommas } from "../../lib";
import dayjs from "dayjs";
import { useTheme } from "@mui/material/styles";
// import { DatePicker } from "@mui/x-date-pickers";
import DatePicker from "react-multi-date-picker";
import ReactECharts from "echarts-for-react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ReportCalender from "./ReportCalender";

const recentTransactions = [
  {
    id: "676d79db4ecfd30beae23922",
    vehicle: "TEST TEST",
    media: "/images/car_1.png",
    rentalPeriod: "26/12/2024 - 27/12/2024",
    totalPrice: 600,
    customer: "Doe",
  },
  {
    id: "676d79db4ecfd30beae23922",
    vehicle: "TEST TEST",
    media: "/images/car_2.png",
    rentalPeriod: "26/12/2024 - 27/12/2024",
    totalPrice: 400,
    customer: "Antoine",
  },
  {
    id: "676d79db4ecfd30beae23922",
    vehicle: "TEST TEST",
    media: "/images/car_3.png",
    rentalPeriod: "26/12/2024 - 27/12/2024",
    totalPrice: 500,
    customer: "Hla",
  },
];
function Report() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { setShowBackButton } = useContext(AppContext);
  //#region S1 Revenue state
  const [DateFilterRevenue, setDateFilterRevenue] = useState({
    from: dayjs().startOf("month"),
    to: dayjs().endOf("month"),
    helperFrom: dayjs().startOf("month"),
    helperTo: dayjs().endOf("month"),
  });
  const [RevenueData, setRevenueData] = useState({
    currentPeriod: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 10, 17, 20, 16, 20, 20, 12,
      10, 15, 30, 30, 27, 28, 29, 30,
    ], // []
    previousPeriod: [
      10, 2, 13, 24, 15, 26, 17, 18, 20, 10, 11, 12, 13, 14, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ], // []
    xAxis: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24, 25, 26, 27, 28, 29, 30,
    ], // []
  });
  const [LoadingRevenue, setLoadingRevenue] = useState(false);
  const [anchorEl_S1, setAnchorEl_S1] = React.useState(null);
  //#endregion S1 TotalBookings state
  //#region S2 BookingTime state
  const [DateFilterBooking, setDateFilterBooking] = useState({
    from: dayjs().startOf("month"),
    to: dayjs().endOf("month"),
  });
  const [BookingTimeData, setBookingTimeData] = useState([
    // []
    {
      value: 10,
      name: "week 1",
      percentage: "30",
    },
    {
      value: 5,
      name: "week 2",
      percentage: "20",
    },
    {
      value: 10,
      name: "week 3",
      percentage: "30",
    },
    {
      value: 5,
      name: "week 4",
      percentage: "20",
    },
  ]);
  const [LoadingBookingTime, setLoadingBookingTime] = useState(false);
  //#endregion S2 BookingTime state

  //#region S3 RecentTransactions
  const [DateFilterRecentTransactions, setDateFilterRecentTransactions] =
    useState({
      from: dayjs().startOf("month"),
      to: dayjs().endOf("month"),
      helperFrom: dayjs().startOf("month"),
      helperTo: dayjs().endOf("month"),
    });
  const [RecentTransactionsData, setRecentTransactionsData] =
    useState(recentTransactions);
  const [LoadingRecentTransactions, setLoadingRecentTransactions] =
    useState(false);
  const rowPerPage = 4;
  const [page, setPage] = React.useState(1);
  const handleChange = (event, value) => {
    setPage(value);
  };
  const [anchorEl_S3, setAnchorEl_S3] = React.useState(null);
  //#endregion S3 RecentTransactions

  //#region S4 TotalBookings state
  const [DateFilterTotalBookings, setDateFilterTotalBookings] = useState({
    from: dayjs().startOf("month"),
    to: dayjs().endOf("month"),
    helperFrom: dayjs().startOf("month"),
    helperTo: dayjs().endOf("month"),
  });
  const [TotalBookingsData, setTotalBookingsData] = useState({
    currentPeriod: [10, 5, 2, 40], // []
    previousPeriod: [15, 10, 30, 5], // []
    xAxis: [1, 2, 3, 4], // []
  });
  const [LoadingTotalBookings, setLoadingTotalBookings] = useState(false);
  const [anchorEl_S4, setAnchorEl_S4] = React.useState(null);
  //#endregion S4 TotalBookings state

  useEffect(() => {
    setShowBackButton(false);
  }, []);
  // // get Revenue S1
  // useEffect(() => {
  //   setLoadingRevenue(true);
  //   axiosInstance
  //     .get("/reports/revenue", {
  //       params: {
  //         startDate: dayjs(DateFilterRevenue.from).format("YYYY-MM-DD"),
  //         endDate: dayjs(DateFilterRevenue.to).format("YYYY-MM-DD"),
  //       },
  //     })
  //     .then((res) => {
  //       let data = res?.data?.data;
  //       let xAxis = [
  //         ...new Set(
  //           [...(data?.last || []), ...(data?.current || [])].map((ele) =>
  //             dayjs(ele?.date).format("D MMM")
  //           )
  //         ),
  //       ];
  //       // let last
  //       let currentPeriod = [
  //         ...Array(data?.last?.length).fill(0),
  //         ...(data?.current || []).map((ele) => ele?.totalRevenue),
  //       ];
  //       let previousPeriod = [
  //         ...(data?.last || []).map((ele) => ele?.totalRevenue),
  //         ...Array(data?.current?.length).fill(0),
  //       ];
  //       setRevenueData({
  //         currentPeriod: currentPeriod,
  //         previousPeriod: previousPeriod,
  //         xAxis: xAxis,
  //       });
  //       setLoadingRevenue(false);
  //     });
  // }, [DateFilterRevenue.from, DateFilterRevenue.to]);
  // // get BookingTime S2
  // useEffect(() => {
  //   setLoadingBookingTime(true);
  //   axiosInstance
  //     .get("/reports/weekly-booking-data", {
  //       params: {
  //         year: new Date(DateFilterBooking.from).getFullYear(),
  //         month: new Date(DateFilterBooking.from).getMonth() + 1,
  //       },
  //     })
  //     .then((res) => {
  //       let data = res?.data?.data?.map((val) => ({
  //         value: val?.totalOrders,
  //         name: val?.week,
  //         percentage: val?.percentage,
  //       }));
  //       setBookingTimeData(data);
  //       setLoadingBookingTime(false);
  //     });
  // }, [DateFilterBooking]);
  // // get recentTransactions S3
  // useEffect(() => {
  //   setLoadingRecentTransactions(true);
  //   axiosInstance
  //     .get("/reports/recentTransactions", {
  //       params: {
  //         from: dayjs(DateFilterRecentTransactions.from).format("YYYY-MM-DD"),
  //         to: dayjs(DateFilterRecentTransactions.to).format("YYYY-MM-DD"),
  //       },
  //     })
  //     .then((res) => {
  //       let data = [];
  //       res?.data?.data?.forEach((ele) => {
  //         ele?.cars?.forEach((car, i) => {
  //           data = [...data, { ...car, customer: ele?.customer, n: i + 1 }];
  //         });
  //       });
  //       setRecentTransactionsData(data);
  //       setLoadingRecentTransactions(false);
  //     });
  // }, [DateFilterRecentTransactions.from, DateFilterRecentTransactions.to]);
  // get Total bookings S4
  // useEffect(() => {
  //   setLoadingTotalBookings(true);
  //   axiosInstance
  //     .get("/reports/revenue", {
  //       params: {
  //         startDate: dayjs(DateFilterTotalBookings.from).format("YYYY-MM-DD"),
  //         endDate: dayjs(DateFilterTotalBookings.to).format("YYYY-MM-DD"),
  //       },
  //     })
  //     .then((res) => {
  //       let data = res?.data?.data;

  //       let last = data?.last || [];
  //       // last.pop();
  //       let xAxis = [
  //         ...new Set(
  //           [...(last || []), ...(data?.current || [])].map((ele) =>
  //             dayjs(ele?.date).format("D MMM")
  //           )
  //         ),
  //       ];
  //       let currentPeriod = [
  //         ...Array(last?.length).fill(0),
  //         ...(data?.current || []).map((ele) => ele?.totalOrders),
  //       ];
  //       let previousPeriod = [
  //         ...(last || []).map((ele) => ele?.totalOrders),
  //         ...Array(data?.current?.length).fill(0),
  //       ];
  //       setTotalBookingsData({
  //         currentPeriod: currentPeriod,
  //         previousPeriod: previousPeriod,
  //         xAxis: xAxis,
  //       });
  //       setLoadingTotalBookings(false);
  //     });
  // }, [DateFilterTotalBookings.from, DateFilterTotalBookings.to]);
  // console.log("TotalBookingsData ", TotalBookingsData);
  function formateDateValue(period) {
    let selectedFrom;
    let selectedTo;
    switch (period) {
      case "Today":
        selectedFrom = dayjs().startOf("day");
        selectedTo = dayjs().endOf("day");
        break;
      case "Yesterday":
        selectedFrom = dayjs().subtract(1, "day").startOf("day");
        selectedTo = dayjs().subtract(1, "day").endOf("day");
        break;
      case "This Week":
        selectedFrom = dayjs().startOf("week");
        selectedTo = dayjs().endOf("week");
        break;
      case "Previous Week":
        selectedFrom = dayjs().subtract(1, "week").startOf("week");
        selectedTo = dayjs().subtract(1, "week").endOf("week");
        break;
      case "This Month":
        selectedFrom = dayjs().startOf("month");
        selectedTo = dayjs().endOf("month");
        break;
      case "Previous Month":
        selectedFrom = dayjs().subtract(1, "month").startOf("month");
        selectedTo = dayjs().subtract(1, "month").endOf("month");
        break;
    }
    return { selectedFrom, selectedTo };
  }
  const renderTitle = (title, subTitle, flexDirection) => (
    <Stack
      direction={"column"}
      spacing={1}
      flexDirection={flexDirection ? flexDirection : "column"}
    >
      <Typography
        sx={{
          fontFamily: "Montserrat",
          fontSize: "16px",
          fontWeight: 500,
          lineHeight: "22px",
          letterSpacing: "0.5px",
          textAlign: "left",
          color: "#032E2E",
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          fontFamily: "Montserrat",
          fontSize: "13px",
          fontWeight: 400,
          lineHeight: "21px",
          letterSpacing: "0.5px",
          textAlign: "left",
          color: "#032E2E",
        }}
      >
        {subTitle}
      </Typography>
    </Stack>
  );
  const bookingTimeColors = ["#1A75BB", "#191919", "#FF9407", "#FEE6C9"];

  const RevenueSection = (
    <>
      <Card sx={{ padding: "25px 25px", height: "100%" }} spacing={1}>
        <Grid container spacing={1}>
          <Grid size={{ xs: 12, sm: 6, md: 8 }}>
            {/* {renderTitle(
              "Revenue",
              `${dayjs(DateFilterRevenue.from).format("D MMM YYYY")} - ${dayjs(
                DateFilterRevenue.to
              ).format("D MMM YYYY")}`,
              "column-reverse"
            )} */}
            {renderTitle(
              `USD ${addCommas(
                RevenueData?.currentPeriod?.reduce((acc, val) => {
                  return (acc += val?.totalRevenue);
                }, 0)
              )}`,
              "Revenue",
              "column-reverse"
            )}
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <ReportCalender
              anchorEl={anchorEl_S1}
              setAnchorEl={setAnchorEl_S1}
              from={DateFilterRevenue.from}
              to={DateFilterRevenue.to}
              helperFrom={DateFilterRevenue.helperFrom}
              helperTo={DateFilterRevenue.helperTo}
              buttonId="filter-RecentTransactions-button"
              menuId="filter-RecentTransactions-menu"
              onOk={() => {
                setDateFilterRevenue((prev) => ({
                  ...prev,
                  from: new Date(prev.helperFrom),
                  to: new Date(prev.helperTo),
                }));
                setAnchorEl_S4(null);
                //handleClose();
              }}
              onChange={(ranges) => {
                // console.log("ranges ", ranges);
                setDateFilterRevenue((prev) => ({
                  ...prev,
                  helperFrom: new Date(ranges[0]),
                  helperTo: new Date(ranges[1]),
                }));
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            <Typography
              sx={{
                fontFamily: "Montserrat",
                fontSize: "13px",
                fontWeight: 400,
                lineHeight: "21px",
                letterSpacing: "0.5px",
                textAlign: "left",
                color: "#032E2E",
              }}
            >
              Sales from {dayjs(DateFilterRevenue.from).format("D MMM YYYY")} -{" "}
              {dayjs(DateFilterRevenue.to).format("D MMM YYYY")}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            {LoadingRevenue ? (
              <CircularProgress />
            ) : (
              <ReactECharts
                option={{
                  color: bookingTimeColors,
                  title: { text: "", show: false },
                  tooltip: { trigger: "axis" },
                  legend: {
                    show: false,
                    data: ["Current Period", "Previous Period"],
                  },
                  grid: {
                    left: "-2%",
                    right: "3%",
                    // bottom: "3%",
                    containLabel: true,
                  },
                  dataZoom: [
                    {
                      type: "inside",
                    },
                    {
                      type: "slider",
                    },
                  ],
                  toolbox: {
                    show: false,
                    feature: {
                      saveAsImage: {},
                    },
                  },
                  xAxis: {
                    type: "category",
                    boundaryGap: false,
                    data: RevenueData?.xAxis, //["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                  },
                  yAxis: { show: false, type: "value" },
                  series: [
                    {
                      name: "Current Period",
                      type: "bar",
                      stack: "Total",
                      showSymbol: false,
                      data: RevenueData?.currentPeriod, //[120, 132, 101, 134, 90, 230, 210],
                    },
                    {
                      name: "Previous Period",
                      type: "bar",
                      stack: "Total",
                      showSymbol: false,
                      data: RevenueData?.previousPeriod, //[220, 182, 191, 234, 290, 330, 310],
                    },
                  ],
                }}
              />
            )}
          </Grid>
          {!LoadingRevenue && (
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <Box display={"flex"} alignItems={"center"}>
                {[
                  { label: "Previous Period", color: bookingTimeColors[1] },
                  { label: "Current Period", color: bookingTimeColors[0] },
                ]?.map((ele, i) => (
                  <Box
                    key={i}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    ml={2}
                  >
                    <Box
                      sx={{
                        height: 10,
                        width: 10,
                        borderRadius: "50%",
                        backgroundColor: ele.color,
                        marginRight: 1,
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: "Poppins",
                        fontSize: "16px",
                        fontWeight: 400,
                        lineHeight: "26px",
                        textAlign: "left",
                        color: "#A5A5A5",
                      }}
                    >
                      {ele?.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          )}
        </Grid>
      </Card>
    </>
  );
  const BookingTimeSection = (
    <>
      <Card sx={{ padding: "25px 25px", height: "100%" }} spacing={1}>
        <Grid container spacing={1}>
          <Grid size={{ xs: 12, sm: 6, md: 6 }}>
            {renderTitle(
              "Booking Time",
              dayjs(DateFilterBooking.from).format("MMM, YYYY")
            )}
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 6 }}>
            <DatePicker
              className="red report-calendar"
              onChange={(event) => {
                setDateFilterBooking({
                  from: new Date(event),
                  to: dayjs(event).endOf("month"),
                });
              }}
              onlyMonthPicker
              render={
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  sx={{
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
                    {dayjs(DateFilterBooking.from).format("D MMM YYYY")} -{" "}
                    {dayjs(DateFilterBooking.to).format("D MMM YYYY")}
                  </Typography>
                  <IconButton>
                    <KeyboardArrowDownIcon sx={{ color: "#6565756B" }} />
                  </IconButton>
                </Box>
              }
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            {LoadingBookingTime ? (
              <CircularProgress />
            ) : (
              <ReactECharts
                option={{
                  color: bookingTimeColors,
                  tooltip: {
                    trigger: "item",
                  },
                  legend: {
                    top: "5%",
                    left: "center",
                    show: false,
                  },
                  series: [
                    {
                      name: "Access From",
                      type: "pie",
                      radius: ["40%", "70%"],
                      // avoidLabelOverlap: false,
                      label: {
                        show: false,
                        // position: 'center',
                        // edgeDistance: '25%',
                        // overflow: 'truncate',
                        textStyle: {
                          fontFamily: "Poppins",
                          fontSize: "18px",
                          color: "#333333",
                          fontWeight: 500,
                        },
                      },
                      emphasis: {
                        label: {
                          show: false,
                          fontSize: 40,
                          fontWeight: "bold",
                        },
                      },
                      labelLine: {
                        show: false,
                        // minTurnAngle: 90,
                        // maxSurfaceAngle: 90,
                      },
                      data: BookingTimeData,
                    },
                  ],
                }}
              />
            )}
          </Grid>
          {!LoadingBookingTime && (
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-around"}
              >
                {BookingTimeData?.map((ele, i) => (
                  <Box
                    key={i}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"space-around"}
                    flexDirection={"column"}
                  >
                    <Box display={"flex"} alignItems={"center"}>
                      <Box
                        sx={{
                          height: 10,
                          width: 10,
                          borderRadius: "50%",
                          backgroundColor: bookingTimeColors[i],
                          marginRight: 1,
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: "Poppins",
                          fontSize: "16px",
                          fontWeight: 400,
                          lineHeight: "26px",
                          textAlign: "left",
                          color: "#A5A5A5",
                        }}
                      >
                        {ele?.name}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: "Poppins",
                          fontSize: "16px",
                          fontWeight: 500,
                          lineHeight: "26px",
                          textAlign: "left",
                          color: "#202020",
                        }}
                      >
                        {ele?.percentage} %
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Grid>
          )}
        </Grid>
      </Card>
    </>
  );
  const p1_Style = {
    fontFamily: "Montserrat",
    fontSize: "16px",
    fontWeight: 600,
    lineHeight: "24px",
    letterSpacing: " -0.02em",
    textAlign: "left",
    color: "#191919",
  };
  const p2_Style = {
    fontFamily: "Montserrat",
    fontSize: "12px",
    fontWeight: 500,
    lineHeight: "14.63px",
    letterSpacing: "-2%",
    textAlign: "left",
    color: "#9A9EA5",
  };
  const RecentTransactionsSection = (
    <>
      <Card sx={{ padding: "25px 25px", height: "100%" }} spacing={1}>
        <Grid container spacing={1}>
          <Grid size={{ xs: 12, sm: 6, md: 8 }}>
            {renderTitle(
              "Recent transactions",
              `${dayjs(DateFilterRecentTransactions.from).format(
                "D MMM YYYY"
              )} - ${dayjs(DateFilterRecentTransactions.to).format(
                "D MMM YYYY"
              )}`
            )}
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <ReportCalender
              anchorEl={anchorEl_S3}
              setAnchorEl={setAnchorEl_S3}
              from={DateFilterRecentTransactions.from}
              to={DateFilterRecentTransactions.to}
              helperFrom={DateFilterRecentTransactions.helperFrom}
              helperTo={DateFilterRecentTransactions.helperTo}
              buttonId="filter-RecentTransactions-button"
              menuId="filter-RecentTransactions-menu"
              onOk={() => {
                setDateFilterRecentTransactions((prev) => ({
                  ...prev,
                  from: new Date(prev.helperFrom),
                  to: new Date(prev.helperTo),
                }));
                //  handleClose();
                setAnchorEl_S3(null);
              }}
              onChange={(ranges) => {
                // console.log("ranges ", ranges);
                setDateFilterRecentTransactions((prev) => ({
                  ...prev,
                  helperFrom: new Date(ranges[0]),
                  helperTo: new Date(ranges[1]),
                }));
              }}
            />
          </Grid>
          {LoadingRecentTransactions ? (
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <CircularProgress />
            </Grid>
          ) : (
            RecentTransactionsData?.slice(
              (page - 1) * rowPerPage,
              (page - 1) * rowPerPage + rowPerPage
            )?.map((ele, i) => (
              <Grid
                key={i}
                size={{ xs: 12, sm: 12, md: 12 }}
                sx={{
                  borderBottom: "1px solid #C3D4E966",
                  padding: "10px 5px",
                }}
              >
                <Grid container>
                  <Grid size={{ xs: 12, sm: 12, md: 3 }}>
                    <Box display={"flex"} alignItems={"center"}>
                      <img
                        // src={params?.row?.media[0]?.url}
                        src={ele?.media}
                        width="100px"
                        height={"50px"}
                        style={{
                          borderRadius: 2,
                          cursor: "pointer",
                          objectFit: "contain",
                          marginRight: "auto",
                        }}
                        onLoad={() => {}}
                        onError={(e) => {
                          e.currentTarget.onerror = null; // prevents looping
                          e.currentTarget.src = "/images/car.jpeg";
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 12, md: 3 }}>
                    <Stack direction={"column"} spacing={1}>
                      <Typography sx={p1_Style}>{ele?.customer}</Typography>
                      <Typography sx={p2_Style}>Customer</Typography>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 12, md: 3 }}>
                    <Stack direction={"column"} spacing={1}>
                      <Typography sx={p1_Style}>{ele?.vehicle}</Typography>
                      <Typography sx={p2_Style}>Vehicle</Typography>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 12, md: 3 }}>
                    <Stack direction={"column"} spacing={1}>
                      <Typography sx={{ ...p2_Style, textAlign: "right" }}>
                        {/* 20 July - 22 July */}
                        {ele?.rentalPeriod}
                      </Typography>
                      <Typography sx={{ ...p1_Style, textAlign: "right" }}>
                        ${ele?.totalPrice}
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
            ))
          )}
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"flex-end"}
              sx={{ width: "100%" }}
            >
              <Pagination
                count={Math.ceil(RecentTransactionsData.length / rowPerPage)}
                page={page}
                onChange={handleChange}
              />
            </Box>
          </Grid>
        </Grid>
      </Card>
    </>
  );
  const TotalBookingsSection = (
    <>
      <Card sx={{ padding: "25px 25px", height: "100%" }} spacing={1}>
        <Grid container spacing={1}>
          <Grid size={{ xs: 12, sm: 6, md: 6 }}>
            {renderTitle(
              "Total bookings",
              `${dayjs(DateFilterTotalBookings.from).format(
                "D MMM YYYY"
              )} - ${dayjs(DateFilterTotalBookings.to).format("D MMM YYYY")}`
            )}
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 6 }}>
            <ReportCalender
              anchorEl={anchorEl_S4}
              setAnchorEl={setAnchorEl_S4}
              from={DateFilterTotalBookings.from}
              to={DateFilterTotalBookings.to}
              helperFrom={DateFilterTotalBookings.helperFrom}
              helperTo={DateFilterTotalBookings.helperTo}
              buttonId="filter-RecentTransactions-button"
              menuId="filter-RecentTransactions-menu"
              onOk={() => {
                setDateFilterTotalBookings((prev) => ({
                  ...prev,
                  from: new Date(prev.helperFrom),
                  to: new Date(prev.helperTo),
                }));
                setAnchorEl_S4(null);
                //handleClose();
              }}
              onChange={(ranges) => {
                // console.log("ranges ", ranges);
                setDateFilterTotalBookings((prev) => ({
                  ...prev,
                  helperFrom: new Date(ranges[0]),
                  helperTo: new Date(ranges[1]),
                }));
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            {LoadingTotalBookings ? (
              <CircularProgress />
            ) : (
              <ReactECharts
                option={{
                  color: bookingTimeColors,
                  title: {
                    text: "",
                    show: false,
                  },
                  tooltip: {
                    trigger: "axis",
                  },
                  legend: {
                    show: false,
                    data: ["Current Period", "Previous Period"],
                  },
                  grid: {
                    left: "-2%",
                    right: "3%",
                    //  bottom: "3%",
                    containLabel: true,
                  },
                  dataZoom: [
                    {
                      type: "inside",
                    },
                    {
                      type: "slider",
                    },
                  ],
                  toolbox: {
                    show: false,
                    feature: {
                      saveAsImage: {},
                    },
                  },
                  xAxis: {
                    type: "category",
                    boundaryGap: false,
                    data: TotalBookingsData?.xAxis, //["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                  },
                  yAxis: {
                    show: false,
                    type: "value",
                  },
                  series: [
                    {
                      name: "Current Period",
                      type: "line",
                      stack: "Total",
                      showSymbol: false,
                      data: TotalBookingsData?.currentPeriod, //[120, 132, 101, 134, 90, 230, 210],
                    },
                    {
                      name: "Previous Period",
                      type: "line",
                      stack: "Total",
                      showSymbol: false,
                      data: TotalBookingsData?.previousPeriod, //[220, 182, 191, 234, 290, 330, 310],
                    },
                  ],
                }}
              />
            )}
          </Grid>
          {!LoadingTotalBookings && (
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-around"}
              >
                {[
                  { label: "Current Period" },
                  { label: "Previous Period" },
                ]?.map((ele, i) => (
                  <Box
                    key={i}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    <Box
                      sx={{
                        height: 10,
                        width: 10,
                        borderRadius: "50%",
                        backgroundColor: bookingTimeColors[i],
                        marginRight: 1,
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: "Poppins",
                        fontSize: "16px",
                        fontWeight: 400,
                        lineHeight: "26px",
                        textAlign: "left",
                        color: "#A5A5A5",
                      }}
                    >
                      {ele?.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          )}
        </Grid>
      </Card>
    </>
  );
  return (
    <>
      <Grid container spacing={3} sx={{ paddingBottom: "25px" }}>
        <Grid size={{ xs: 12, sm: 12, md: 8 }}>{RevenueSection}</Grid>
        <Grid size={{ xs: 12, sm: 12, md: 4 }}>{BookingTimeSection}</Grid>
        <Grid size={{ xs: 12, sm: 12, md: 8 }}>
          {RecentTransactionsSection}
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 4 }}>{TotalBookingsSection}</Grid>
      </Grid>
    </>
  );
}

export default Report;
