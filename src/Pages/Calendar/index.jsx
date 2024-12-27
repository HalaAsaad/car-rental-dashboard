import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Stack,
  Typography,
  Card,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import axiosInstance from "../../axiosInstance";
import { AppContext } from "../../Context/AppContext";
import Filter from "./Filter";
import { Calendar } from "react-multi-date-picker";
import dayjs from "dayjs";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import "./index.css";
import data from "./data.json";

function CalendarComponent() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { setShowBackButton, VehiclesData } = useContext(AppContext);
  const [filterValues, setFilterValues] = useState({
    carId: undefined,
    year: 2025, //new Date().getFullYear(),
    month: 1, //new Date().getMonth() + 1,
  });
  const [OpenShowMoreDialog, setOpenShowMoreDialog] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [SelectedDate, setSelectedDate] = useState("");
  const [Events, setEvents] = useState(data); // {}
  const [CarIDsOptions, setCarIDsOptions] = useState([]);
  // const [CarsId, setCarsId] = useState({})
  console.log("filterValues ", filterValues);
  useEffect(() => {
    setShowBackButton(false);
  }, []);
  useEffect(() => {
    // get all without filter

    // axiosInstance.get(API.vehicles).then((res) => {
    //   let allCars = [];
    //   res?.data?.data?.forEach((ele) => {
    //     allCars = [...allCars, ele?.carId];
    //   });
    //   setCarIDsOptions([...new Set(allCars)]);
    // });

    let allCars = [];
    VehiclesData?.forEach((ele) => {
      allCars = [...allCars, ele?.carId];
    });
    setCarIDsOptions(
      [...new Set(allCars)]?.filter(
        (id) => id !== undefined && id !== "" && id !== null
      )
    );
  }, [VehiclesData]);
  // useEffect(() => {
  //   setLoading(true);
  //   setEvents({});
  //   axiosInstance
  //     .get("/calender/events", {
  //       params: {
  //         year: filterValues?.year,
  //         month: filterValues?.month,
  //         carId: filterValues?.carId,
  //       },
  //     })
  //     .then((res) => {
  //       // console.log("res?.data", res?.data);
  //       if (res?.data) {
  //         setEvents(res?.data);
  //       }
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       setLoading(false);
  //     });
  // }, [filterValues]);

  const colors = {
    "Maintenance Reminder": "#FEE6C9",
    "Pickup Date": "#DFFDEE",
    "Return Date": "#FFD9D9",
  };
  const handleClickOpen = (strDate) => {
    setSelectedDate(strDate);
    setOpenShowMoreDialog(true);
  };

  const handleClose = () => {
    setSelectedDate("");
    setOpenShowMoreDialog(false);
  };
  function navigateToVehicle(id) {
    navigate(`/vehicles/details/${id}`);
  }
  function navigateToMaintenance(id) {
    navigate(`/vehicles/maintenance/${id}`);
  }
  return (
    <>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
          <Filter
            setFilterValues={setFilterValues}
            filterValues={filterValues}
            CarIDsOptions={CarIDsOptions}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
          <Typography
            sx={{
              color: "#032E2E",
              fontFamily: "Montserrat",
              fontSize: "28px",
              lineHeight: "42px",
              marginBottom: "10px",
            }}
            variant="h6"
            fontWeight={"700"}
            textAlign={"left"}
          >
            Vehicles calendar
          </Typography>
          <Typography
            sx={{ ...theme.card_sub_title, fontSize: "16px" }}
            fontWeight={500}
            variant="subtitle1"
            textAlign={"left"}
          >
            View your vehicles status on calendar
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 12 }} mb={10}>
          {Loading ? (
            <CircularProgress />
          ) : (
            <Card sx={{ padding: "15px" }}>
              <Calendar
                headerOrder={["MONTH_YEAR", "LEFT_BUTTON", "RIGHT_BUTTON"]}
                value={
                  new Date(`${filterValues.year}-${filterValues.month}-01`)
                }
                //onChange={setSelectedDates}
                //multiple
                //range
                // disabled
                className="red custom-calender"
                containerStyle={{ width: "100%" }}
                style={{ width: "100%" }}
                onChange={(ranges) => {
                  // let _isUnAvailableDates = isUnAvailableDates(
                  //   ranges,
                  //   AllVehiclesBookedDates[CustomSelectedVehicle?._id]
                  // );
                  // if (_isUnAvailableDates) return false;
                  // setSelectedDates(ranges);
                }}
                onYearChange={(event) => {
                  // console.log("onYearChange ", event);
                  setFilterValues((prev) => ({
                    ...prev,
                    year: new Date(event).getFullYear(),
                    month: new Date(event).getMonth() + 1,
                  }));
                }}
                onMonthChange={(event) => {
                  setFilterValues((prev) => ({
                    ...prev,
                    year: new Date(event).getFullYear(),
                    month: new Date(event).getMonth() + 1,
                  }));
                }}
                mapDays={({
                  date,
                  today,
                  selectedDate,
                  currentMonth,
                  isSameDate,
                }) => {
                  // console.log("currentMonth ", currentMonth.number);
                  let isToday =
                    dayjs(date).format("l") === dayjs(today).format("l");
                  let strDate = new Date(date).toISOString().split("T")[0];
                  let eventsDayLength = Events?.hasOwnProperty(strDate)
                    ? Events[strDate].length
                    : 0;
                  return {
                    disabled: true,
                    children: (
                      <Stack
                        direction={"column"}
                        //className={`rmdp-day-${eventsDayLength}`}
                        className={`rmdp-day-4`}
                      >
                        <Typography
                          sx={{
                            color: isToday ? "#fff" : "#252525",
                            backgroundColor: isToday ? " #ef0a0a" : "#fff",
                            fontWeight: isToday ? 700 : 500,
                          }}
                          variant="subtitle2"
                          className="day_number_paragraph"
                        >
                          {date.format("D")}
                        </Typography>
                        {eventsDayLength > 0 &&
                          Events[strDate]?.slice(0, 4).map((ele, i) => (
                            <Box
                              sx={{
                                padding: "5px",
                                gap: "0px",
                                borderRadius: "2px 0px 0px 0px",
                                backgroundColor: colors[ele?.eventType],
                                marginBottom: "5px",
                              }}
                              display={"flex"}
                              alignItems={"center"}
                              className={`rmdp-day-4`}
                              //className={`rmdp-day-${eventsDayLength}`}
                              key={i}
                            >
                              <Typography
                                className="event-label"
                                sx={{ cursor: "pointer" }}
                                onClick={() =>
                                  ele?.eventType?.includes("Maintenance")
                                    ? navigateToMaintenance(ele?.carIdObject)
                                    : navigateToVehicle(ele?.carIdObject)
                                }
                              >
                                {ele?.brand} {ele?.carId} -{" "}
                                <b>{ele?.eventType}</b>
                              </Typography>
                            </Box>
                          ))}
                        {eventsDayLength > 4 && (
                          <Typography
                            className="view_more_p"
                            onClick={() => handleClickOpen(strDate)}
                          >
                            View more
                          </Typography>
                        )}
                      </Stack>
                    ),
                  };
                }}
              />
            </Card>
          )}
        </Grid>
      </Grid>
      {/**  Show Events Dialog */}
      <Dialog
        open={OpenShowMoreDialog}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            textTransform: "capitalize",
            ...theme.card_title,
            marginBottom: "0px",
            padding: "10px 24px 0px",
          }}
        >
          {/* 26 March 2024 */}
          {dayjs(SelectedDate).format("LL")}
        </DialogTitle>
        <DialogContent sx={{ marginTop: "10px" }}>
          <Stack direction={"column"} spacing={2}>
            {Events.hasOwnProperty(SelectedDate) &&
              Events[SelectedDate]?.map((event, i) => (
                <Alert
                  icon={false}
                  key={i}
                  sx={{
                    backgroundColor: colors[event?.eventType],
                    padding: "10px 10px",
                    display: "flex",
                    alignItems: "center",
                    boxShadow: "unset !important",
                  }}
                >
                  <Typography
                    color="primary"
                    sx={{
                      fontFamily: "Montserrat",
                      fontSize: "14px",
                      fontWeight: 400,
                      lineHeight: "15px",
                      textAlign: "left",
                      display: "inline-block",
                      // cursor: "pointer",
                    }}
                    // onClick={() =>
                    //   event?.eventType?.includes("Maintenance")
                    //     ? navigateToMaintenance(event?.carIdObject)
                    //     : navigateToVehicle(event?.carIdObject)
                    // }
                  >
                    {event?.brand} {event?.carId} - &nbsp;
                  </Typography>
                  <Typography
                    color="primary"
                    sx={{
                      fontFamily: "Montserrat",
                      fontSize: "14px",
                      fontWeight: 500,
                      lineHeight: "15px",
                      textAlign: "left",
                      display: "inline-block",
                      color: "#000",
                    }}
                  >
                    {event?.eventType}
                  </Typography>
                </Alert>
              ))}
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CalendarComponent;
