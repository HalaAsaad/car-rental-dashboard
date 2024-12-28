import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  Card,
  CircularProgress,
  Pagination,
  Checkbox,
  TextField,
  Autocomplete,
  Menu,
  MenuItem,
  Chip,
  Avatar,
  Slider,
  FormGroup,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import API from "../../api";
import { AppContext } from "../../Context/AppContext";
import { addCommas } from "../../lib";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useTheme } from "@mui/material/styles";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DatePicker } from "@mui/x-date-pickers";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import TuneIcon from "@mui/icons-material/Tune";
import CircleIcon from "@mui/icons-material/Circle";
import { DataGrid } from "@mui/x-data-grid/DataGrid/DataGrid";
import ReactECharts from "echarts-for-react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Calendar } from "react-multi-date-picker";
import LiveCarStatusData from "./data.json";

function Dashboard({ permissions }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const { setShowBackButton } = useContext(AppContext);
  const [CarIDsOptions, setCarIDsOptions] = useState([]);
  const [pageSize] = useState(3);
  const [page, setPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [Loading, setLoading] = useState(false);
  const [DataTable, setDataTable] = useState(LiveCarStatusData); // []
  const [filterValues, setFilterValues] = useState({
    carIds: "", //[],
    from: undefined,
    to: undefined,
    price: [0, 1000],
    priceHelper: [],
    status: "", //  enum: ["pending", "confirmed", "canceled"],
  });
  const [AvailabilityFilterValues, setAvailabilityFilterValues] = useState({
    carIds: "", //[],
    from: undefined,
    to: undefined,
  });
  const [MinMaxPrices, setMinMaxPrices] = useState([0, 1000]);
  const [LoadingEarningData, setLoadingEarningData] = useState(false);
  const [EarningData, setEarningData] = useState({
    xAxisData: [],
    currentPeriod: [],
    previousPeriod: [],
    lastYear: [],
    // seriesDataCurrentPeriod: [0, 0, 0, 0, 0, 0],
    // seriesDataLastYear: [0, 0, 0, 0, 0, 0],
    seriesData: [0, 0, 0, 0, 0, 0],
    period: "last6months", // "last6months", "lastYear", "custom"
    fromDate: dayjs().startOf("month"), // dayjs().subtract(6, "month").startOf("month"),
    toDate: dayjs().endOf("month"), //dayjs().subtract(1, "month").endOf("month"),
    customFromDate: dayjs(),
    customFromToDate: dayjs(),
  });
  //#region table filter
  const [anchorElTableFilter, setAnchorElTableFilter] = React.useState(null);
  const openTableFilter = Boolean(anchorElTableFilter);
  const handleClickTableFilter = (event) => {
    setAnchorElTableFilter(event.currentTarget);
  };
  const handleCloseTableFilter = () => {
    setAnchorElTableFilter(null);
  };
  //#endregion table filter
  //#region Earning filter
  const [anchorElEarningFilter, setAnchorElEarningFilter] =
    React.useState(null);
  const openEarningFilter = Boolean(anchorElEarningFilter);
  const handleClickEarningFilter = (event) => {
    setAnchorElEarningFilter(event.currentTarget);
  };
  const handleCloseEarningFilter = () => {
    setAnchorElEarningFilter(null);
  };
  //#endregion Earning filter

  //#region useEffect

  useEffect(() => {
    setShowBackButton(false);
  }, []);

  // useEffect(() => {
  //   // get all without filter
  //   axiosInstance.get(API.vehicles).then((res) => {
  //     let allCars = [];
  //     let prices = [];
  //     // let isRentedExist = res?.data?.data?.find((ele) => ele?.isRented);
  //     // let isIsMaintenaceExist = res?.data?.data?.find(
  //     //   (ele) => ele?.IsMaintenance
  //     // );

  //     res?.data?.data?.forEach((ele) => {
  //       prices = [...prices, ele?.rentalPrice];
  //       allCars = [...allCars, ele?.carId];
  //     });
  //     setCarIDsOptions(
  //       [...new Set(allCars)]?.filter(
  //         (ele) => ele !== undefined && ele !== null
  //       )
  //     );
  //     let min = Math.min.apply(Math, prices);
  //     let max = Math.max.apply(Math, prices);
  //     setMinMaxPrices([min, max]);
  //     setFilterValues((prev) => ({
  //       ...prev,
  //       priceHelper: [min, max],
  //       price: [min, max],
  //     }));
  //   });
  // }, []);
  // useEffect(() => {
  //   setLoading(true);
  //   axiosInstance
  //     .get(API.vehicles, {
  //       params: {
  //         search: AvailabilityFilterValues?.carIds,
  //         // carIds: AvailabilityFilterValues?.carIds?.join(","),
  //         // pickupDate: AvailabilityFilterValues?.from
  //         //   ? new Date(AvailabilityFilterValues?.from)
  //         //       .toISOString()
  //         //       .split("T")[0]
  //         //   : undefined,
  //         // pickupTime: AvailabilityFilterValues?.from
  //         //   ? new Date(AvailabilityFilterValues?.from)
  //         //       .toISOString()
  //         //       .split("T")[1]
  //         //       .split(".")[0]
  //         //   : undefined,
  //         // returnDate: AvailabilityFilterValues?.to
  //         //   ? new Date(AvailabilityFilterValues?.to).toISOString().split("T")[0]
  //         //   : undefined,
  //         // returnTime: AvailabilityFilterValues?.to
  //         //   ? new Date(AvailabilityFilterValues?.to)
  //         //       .toISOString()
  //         //       .split("T")[1]
  //         //       .split(".")[0]
  //         //   : undefined,

  //         from: AvailabilityFilterValues?.from
  //           ? new Date(AvailabilityFilterValues?.from).toISOString()
  //           : undefined,
  //         to: AvailabilityFilterValues?.to
  //           ? new Date(AvailabilityFilterValues?.to).toISOString()
  //           : undefined,
  //         priceMin:
  //           filterValues?.price?.length > 0
  //             ? filterValues?.price[0]
  //             : undefined,
  //         priceMax:
  //           filterValues?.price?.length > 1
  //             ? filterValues?.price[1]
  //             : undefined,
  //         isRented: filterValues?.status?.includes("rented")
  //           ? true
  //           : filterValues?.status?.includes("available")
  //           ? false
  //           : undefined,
  //         isMaintenance: filterValues?.status?.includes("in maintenance")
  //           ? true
  //           : filterValues?.status?.includes("available")
  //           ? false
  //           : undefined,
  //         status:
  //           filterValues?.status !== "rented" &&
  //           filterValues?.status !== "in maintenance"
  //             ? filterValues?.status
  //             : undefined,
  //       },
  //     })
  //     .then((res) => {
  //       setTotalRecords(res?.data?.count);
  //       let data = res?.data?.data?.map((val, i) => ({
  //         ...val,
  //         // orderNumber: i + 1,
  //         id: val?._id,

  //         customer_name: val?.currentCustomer?.customerName
  //           ? val?.currentCustomer?.customerName
  //           : "",
  //         // totalPrice: val?.rentalSummary?.totalPrice || 0,
  //       }));
  //       // ?.map((ele) => ({ ...ele, currentCustomer: "" }));
  //       setPage(0);
  //       setDataTable([...data]);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       setTotalRecords(0);
  //       setDataTable([]);
  //       setLoading(false);
  //     });
  // }, [AvailabilityFilterValues, filterValues.price, filterValues.status]);
  useEffect(() => {
    // Earning Summary
    setLoadingEarningData(true);
    const today = new Date();
    let lastSixMonths = [];
    let lastSixMonthsNumbers = [];

    for (let i = 6; i > 0; i -= 1) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      lastSixMonths.push({
        label: dayjs(date).format("MMM"),
        month: today.getMonth() - i + 1,
      });
      lastSixMonthsNumbers.push(today.getMonth() - i + 1);
    }
    // console.log("lastSixMonthsNumbers ", lastSixMonthsNumbers);
    setEarningData((prev) => ({
      ...prev,
      xAxisData: lastSixMonths,
    }));
    axiosInstance
      .get("/dashboard/earning-summary", {
        params: {
          fromDate: dayjs(EarningData.fromDate).format("DD-MM-YYYY"),
          toDate: dayjs(EarningData.toDate).format("DD-MM-YYYY"),
        },
      })
      .then((res) => {
        // let current = [0, 0, 0, 0, 0, 0];
        // let lastYear = [0, 0, 0, 0, 0, 0];
        // res?.data?.data?.currentPeriod?.forEach((val) => {
        //   let monthIndex = lastSixMonthsNumbers?.includes(val?.month)
        //     ? (lastSixMonthsNumbers || [])?.findIndex(
        //         (ele) => ele === val?.month
        //       )
        //     : -1;
        //   if (monthIndex > -1) current[monthIndex] = val?.totalEarnings;
        // });
        // res?.data?.data?.lastYear?.forEach((val) => {
        //   let monthIndex = lastSixMonthsNumbers?.includes(val?.month)
        //     ? (lastSixMonthsNumbers || [])?.findIndex(
        //         (ele) => ele === val?.month
        //       )
        //     : -1;
        //   if (monthIndex > -1) lastYear[monthIndex] = val?.totalEarnings;
        // });
        // setEarningData((prev) => ({
        //   ...prev,
        //   seriesData: current,
        //   // seriesDataCurrentPeriod: current,
        //   // seriesDataLastYear: lastYear,
        // }));

        setEarningData((prev) => ({
          ...prev,
          currentPeriod: res?.data?.data?.currentPeriod,
          previousPeriod: res?.data?.data?.previousPeriod,
          // lastYear: res?.data?.data?.lastYear,
        }));
        setLoadingEarningData(false);
      });
  }, [EarningData.fromDate, EarningData.toDate]);
  //#endregion useEffect
  //console.log(EarningData);
  const renderCardTitles = (title, icon) => {
    return (
      <Grid
        size={{ xs: 12, sm: 12, md: 12 }}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Typography
          sx={{
            fontFamily: "Montserrat",
            fontSize: "16px",
            fontWeight: 600,
            lineHeight: "24px",
            color: "#1A1919",
          }}
          textAlign={"left"}
        >
          {title}
        </Typography>
        {icon && icon}
      </Grid>
    );
  };
  const CarAvailabilitySection = (
    <>
      <Card sx={{ padding: "25px 25px" }}>
        <Grid container spacing={2}>
          {renderCardTitles("Car Availability")}
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            <Stack
              direction={{ xs: "column", md: "column", lg: "row" }}
              spacing={2}
            >
              <Autocomplete
                // multiple
                sx={{ flexGrow: 1 }}
                options={CarIDsOptions}
                value={filterValues?.carIds}
                onChange={(event, newValue) => {
                  setFilterValues((prev) => ({
                    ...prev,
                    carIds: newValue,
                  }));
                }}
                // onInputChange={(event, newInputValue) => {
                //   setFilterValues((prev) => ({
                //     ...prev,
                //     carIds: newInputValue,
                //   }));
                // }}
                renderInput={(params) => {
                  return (
                    <Stack
                      direction={"row"}
                      position={"relative"}
                      sx={{
                        "& .MuiInputBase-root": {
                          paddingLeft: "40px",
                        },
                        "& .MuiAutocomplete-input": {
                          paddingLeft: "20px",
                        },
                      }}
                    >
                      <DirectionsCarIcon
                        sx={{
                          position: "absolute",
                          left: "10px",
                          top: "15px",
                          color: "#656575",
                        }}
                      />
                      <TextField
                        variant="outlined"
                        placeholder="Car number"
                        {...params}
                      />
                    </Stack>
                  );
                }}
              />

              <Box display={"flex"} sx={{ marginRight: "16px !important" }}>
                {[
                  { label: "Date &time from...", name: "from" },
                  { label: "Date & time to...", name: "to" },
                ].map((ele, i) => (
                  <LocalizationProvider
                    //size="small"
                    key={i}
                    dateAdapter={AdapterDayjs}
                  >
                    <DateTimePicker
                      //size="small"
                      sx={{
                        "& .MuiInputBase-root": {
                          flexFlow: "row-reverse",
                        },
                        // "& .MuiInputBase-input": {
                        //   padding: "9px",
                        // },
                        "& .MuiFormLabel-root": {
                          top: 0, //"-7px",
                          left: "30px",
                        },
                        "& .MuiInputLabel-shrink": {
                          top: "0",
                          left: "0",
                        },
                      }}
                      label={ele.label}
                      value={filterValues[ele.name]}
                      onChange={(newValue) =>
                        setFilterValues((prev) => ({
                          ...prev,
                          [ele.name]: newValue,
                        }))
                      }
                    />
                  </LocalizationProvider>
                ))}
              </Box>

              <Button
                variant="contained"
                onClick={() => {
                  setAvailabilityFilterValues({
                    carIds: filterValues?.carIds,
                    from: filterValues?.from,
                    to: filterValues?.to,
                  });
                }}
                // loading={loading}
                color="secondary"
                //size="small"
                sx={{
                  textTransform: "none",
                  marginLeft: "auto !important",
                  width: "170px",
                }}
              >
                Check
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Card>
    </>
  );
  const colors = {
    available: "#0F930F",
    unavailable: "#EF0A0A",
    rented: "#EF0A0A",
    in_maintenance: "#FF9407",
  };
  const TableFilter = (
    <>
      <Button
        id="filter-table-button"
        aria-controls={openTableFilter ? "filter-table-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={openTableFilter ? "true" : undefined}
        onClick={handleClickTableFilter}
        sx={{
          textTransform: "capitalize",
          color: "#525256",
          fontWeight: 500,
          fontSize: "16px",
          lineHeight: "24pxx",
        }}
        startIcon={<TuneIcon />}
      >
        Filter
      </Button>
      <Menu
        id="filter-table-menu"
        aria-labelledby="filter-table-button"
        anchorEl={anchorElTableFilter}
        open={openTableFilter}
        onClose={handleCloseTableFilter}
        // anchorOrigin={{
        //   vertical: "top",
        //   horizontal: "left",
        // }}
        // transformOrigin={{
        //   vertical: "top",
        //   horizontal: "left",
        // }}
        sx={{
          "& .MuiPaper-root": {
            width: "300px",
            left: 1500,
            padding: "20px",
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
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
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
          <Typography
            sx={{
              color: "#1A1919",
              fontSize: "16px",
              fontWeight: 600,
              lineHeight: "24px",
              textAlign: "left",
            }}
          >
            Price (USD)
          </Typography>
          <Slider
            getAriaLabel={() => "Temperature range"}
            value={filterValues.priceHelper}
            onChange={(event, newValue) => {
              //console.log("newValue ", newValue);
              setFilterValues((prev) => ({
                ...prev,
                priceHelper: newValue,
              }));
            }}
            onChangeCommitted={(event, newValue) => {
              console.log("onChangeCommitted ", newValue);
              setFilterValues((prev) => ({
                ...prev,
                price: newValue,
              }));
            }}
            color="secondary"
            valueLabelDisplay="auto"
            size="medium"
            min={0}
            max={MinMaxPrices?.length > 1 ? MinMaxPrices[1] : 0}
          />
        </Stack>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Typography
            sx={{
              color: "#656575",
              fontSize: "12px",
              fontWeight: 400,
              lineHeight: "16px",
              textAlign: "left",
            }}
          >
            $ {MinMaxPrices?.length > 0 ? MinMaxPrices[0] : 0}
          </Typography>
          <Typography
            sx={{
              color: "#656575",
              fontSize: "12px",
              fontWeight: 400,
              lineHeight: "16px",
              textAlign: "right",
            }}
          >
            $ {MinMaxPrices?.length > 1 ? MinMaxPrices[1] : ""}
          </Typography>
        </Box>
        <Typography
          sx={{
            color: "#1A1919",
            fontSize: "16px",
            fontWeight: 600,
            lineHeight: "24px",
            textAlign: "left",
          }}
        >
          Status
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                color="secondary"
                checked={filterValues.status === "available"}
                onChange={(event) => {
                  if (filterValues.status === "available") {
                    setFilterValues((prev) => ({
                      ...prev,
                      status: "",
                    }));
                  } else {
                    setFilterValues((prev) => ({
                      ...prev,
                      status: "available",
                    }));
                  }
                }}
                name="available"
              />
            }
            label={
              <Typography
                sx={{ color: "#656575" }}
                fontSize={"14px"}
                fontWeight={400}
                lineHeight={"18px"}
              >
                Available
              </Typography>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                color="secondary"
                checked={filterValues.status === "rented"}
                onChange={(event) => {
                  if (filterValues.status === "rented") {
                    setFilterValues((prev) => ({
                      ...prev,
                      status: "",
                    }));
                  } else {
                    setFilterValues((prev) => ({
                      ...prev,
                      status: "rented",
                    }));
                  }
                }}
                name="rented"
              />
            }
            label={
              <Typography
                sx={{ color: "#656575" }}
                fontSize={"14px"}
                fontWeight={400}
                lineHeight={"18px"}
              >
                Rented
              </Typography>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                color="secondary"
                checked={filterValues.status === "in maintenance"}
                onChange={(event) => {
                  if (filterValues.status === "in maintenance") {
                    setFilterValues((prev) => ({
                      ...prev,
                      status: "",
                    }));
                  } else {
                    setFilterValues((prev) => ({
                      ...prev,
                      status: "in maintenance",
                    }));
                  }
                }}
                name="in maintenance"
              />
            }
            label={
              <Typography
                sx={{ color: "#656575" }}
                fontSize={"14px"}
                fontWeight={400}
                lineHeight={"18px"}
              >
                In maintenance
              </Typography>
            }
          />
        </FormGroup>
      </Menu>
    </>
  );
  // const colors = {
  //   in_route: "#D80027",
  //   pending: "#FF9407",
  //   completed: "#0F930F",
  // };

  const columns = [
    {
      field: "carId",
      headerName: "Car number",
      align: "left",
      headerAlign: "left",
      flex: 1,
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      editable: true,
      renderCell: (params) => (
        <Stack
          direction="row"
          alignItems={"center"}
          spacing={1}
          sx={{ height: "100%" }}
        >
          <Chip
            sx={{ color: "#1A1919", borderRadius: "4px" }}
            label={params?.row?.carId || "__"}
          />
          {/* {params?.row?.cars
            // ?.filter((car) => car?.carId?.carId)
            .map((car, i) => (
              <Chip
                sx={{ color: "#1A1919", borderRadius: "4px" }}
                key={i}
                label={car?.carId?.carId || "__"}
              />
            ))} */}
        </Stack>
      ),
    },
    {
      field: "customer_name",
      headerName: "Customer",
      align: "left",
      headerAlign: "left",
      flex: 1,
      hideSortIcons: false,
      disableColumnMenu: true,
      sortable: true,
      editable: true,
      renderCell: (params) => (
        <Stack
          direction={"row"}
          sx={{ height: "100%" }}
          alignItems={"center"}
          spacing={1}
        >
          <Avatar
            alt={params?.row?.customer_name}
            src="/user.png"
            sx={{ width: 24, height: 24 }}
          />
          <Typography
            fontWeight={400}
            fontSize={"16px"}
            sx={{ lineHeight: "19px", color: "#1A1919" }}
          >
            {params?.row?.customer_name || "____"}
          </Typography>
          {/* <LinkBody
            value={params?.row?.customer_name}
            to={`/customers/details/${params?.row?.customer?._id}`}
          /> */}
        </Stack>
      ),
    },
    {
      field: "state",
      headerName: "State",
      align: "center",
      headerAlign: "left",
      flex: 1,
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => {
        let state;
        if (params?.row?.state === "out_of_service") {
          state = "out_of_service";
        } else if (
          !params?.row?.isRented &&
          !params?.row?.IsMaintenance &&
          params?.row?.state !== "out_of_service"
        ) {
          state = "available";
        } else if (
          params?.row?.isRented &&
          params?.row?.IsMaintenance &&
          params?.row?.state !== "out_of_service"
        ) {
          return (
            <Stack direction={"column"} spacing={1}>
              <Stack
                direction={"row"}
                justifyContent={"flex-start"}
                alignItems={"center"}
                spacing={2}
                sx={{ height: "100%" }}
              >
                <CircleIcon sx={{ color: colors["rented"] }} fontSize="small" />
                <Typography
                  fontWeight={300}
                  fontSize={"16px"}
                  sx={{
                    lineHeight: "19px",
                    color: "#656575",
                    textTransform: "capitalize",
                  }}
                >
                  rented
                </Typography>
              </Stack>
              <Stack
                direction={"row"}
                justifyContent={"flex-start"}
                alignItems={"center"}
                spacing={2}
                sx={{ height: "100%" }}
              >
                <CircleIcon
                  sx={{ color: colors["in_maintenance"] }}
                  fontSize="small"
                />
                <Typography
                  fontWeight={300}
                  fontSize={"16px"}
                  sx={{
                    lineHeight: "19px",
                    color: "#656575",
                    textTransform: "capitalize",
                  }}
                >
                  in maintenance
                </Typography>
              </Stack>
              {/* <StateBody color={colors["rented"]} value={"rented"} />
              <StateBody
                color={colors["in_maintenance"]}
                value={"in maintenance"}
              /> */}
            </Stack>
          );
        } else if (
          params?.row?.isRented &&
          !params?.row?.IsMaintenance &&
          params?.row?.state !== "out_of_service"
        ) {
          state = "rented";
        } else if (
          !params?.row?.isRented &&
          params?.row?.IsMaintenance &&
          params?.row?.state !== "out_of_service"
        ) {
          state = "in_maintenance";
        }
        return (
          <>
            <Stack
              direction={"row"}
              justifyContent={"flex-start"}
              alignItems={"center"}
              spacing={2}
              sx={{ height: "100%" }}
            >
              <CircleIcon sx={{ color: colors[state] }} fontSize="small" />
              <Typography
                fontWeight={300}
                fontSize={"16px"}
                sx={{
                  lineHeight: "19px",
                  color: "#656575",
                  textTransform: "capitalize",
                }}
              >
                {state?.replace("_", " ")}
              </Typography>
            </Stack>
          </>
        );
      },
    },
    {
      field: "rentalPrice",
      headerName: "Price",
      align: "left",
      headerAlign: "left",
      flex: 1,
      hideSortIcons: false,
      disableColumnMenu: true,
      sortable: true,
      renderCell: (params) => (
        <Stack
          direction={"row"}
          justifyContent={"flex-start"}
          alignItems={"center"}
          spacing={1}
          sx={{ height: "100%", color: "#000" }}
        >
          <Typography
            fontWeight={300}
            fontSize={"16px"}
            sx={{
              lineHeight: "19px",
              color: "#656575",
              textTransform: "capitalize",
            }}
          >
            $ {addCommas(params?.row?.rentalPrice)}
          </Typography>
        </Stack>
      ),
    },
    {
      field: "",
      headerName: "Actions",
      align: "left",
      headerAlign: "left",
      flex: 1,
      hideSortIcons: true,
      disableColumnMenu: true,
      disableExport: true,
      sortable: false,
      renderCell: (params) => (
        <>
          {!permissions?.orders?.view ? (
            <small>Not authorized</small>
          ) : (
            <Button
              variant="contained"
              size="small"
              sx={{ textTransform: "none" }}
              onClick={() => navigate(`/vehicles/details/${params?.row?._id}`)}
            >
              Details
            </Button>
          )}
        </>
      ),
    },
  ];
  const LiveCarStatusSection = (
    <>
      <Card sx={{ padding: "25px 25px" }}>
        <Grid container spacing={2}>
          {renderCardTitles(
            filterValues?.carIds?.length > 0
              ? "Car Availability"
              : "Live Car Status",
            TableFilter
          )}
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            {Loading ? (
              <CircularProgress />
            ) : (
              <DataGrid
                rows={DataTable || []}
                columns={columns}
                style={{ overflow: "auto" }}
                pagination
                pageSize={pageSize}
                rowLength={totalRecords}
                pageSizeOptions={[3, 5, 10, 25]}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: pageSize, page: page },
                  },
                }}
                sx={{
                  borderColor: "#fff",
                  color: "#201D23CC",
                  lineHeight: "19.6px",
                  fontSize: "14px",
                  fontFamily: "Montserrat",
                  // "& .even": {
                  //   backgroundColor: "#FAFAFA !important",
                  // },
                  // "& .odd": {
                  //   backgroundColor: "#FFF !important",
                  // },
                  "& .MuiDataGrid-row": {
                    maxHeight: "unset !important",
                  },
                  "& .MuiDataGrid-cell": {
                    //  border: "unset",
                    fontFamily: "Montserrat",
                    height: "unset !important",
                  },
                  "& .MuiDataGrid-columnHeader": {
                    // backgroundColor: "#FAFAFA !important",
                    // borderBottom: "unset !important",
                    fontSize: "14px",
                    fontWeight: 300,
                    lineHeight: "18px",
                    textAlign: "left",
                    color: "#656575",
                  },
                  "& .MuiTablePagination-spacer": {
                    flex: "0 !important",
                  },
                  "& .MuiInputBase-root": {
                    marginRight: "auto !important",
                  },
                }}
                //   disableRowSelectionOnClick
              />
            )}
          </Grid>
        </Grid>
      </Card>
    </>
  );
  const EarningSummarySection = (
    <>
      <Card sx={{ padding: "25px 25px" }}>
        <Grid container spacing={2}>
          <Grid
            size={{ xs: 12, sm: 4, md: 4 }}
            display={"flex"}
            alignItems={"center"}
          >
            <Typography
              sx={{
                fontFamily: "Montserrat",
                fontSize: "16px",
                fontWeight: 600,
                lineHeight: "24px",
                color: "#1A1919",
                marginRight: "20px",
              }}
              textAlign={"left"}
            >
              Earning Summary
            </Typography>

            <Typography
              sx={{
                fontFamily: "Montserrat",
                fontSize: "12px",
                fontWeight: 400,
                lineHeight: "16px",
                color: "#656575",
              }}
              textAlign={"left"}
            >
              {dayjs(EarningData.fromDate).format("DD MMM YYYY")} -{" "}
              {dayjs(EarningData.toDate).format("DD MMM YYYY")}
            </Typography>
            <IconButton
              id="filter-earning-button"
              aria-controls={
                openEarningFilter ? "filter-earning-menu" : undefined
              }
              aria-haspopup="true"
              aria-expanded={openEarningFilter ? "true" : undefined}
              onClick={handleClickEarningFilter}
            >
              <KeyboardArrowDownIcon sx={{ color: "#656575" }} />
            </IconButton>

            <Menu
              id="filter-earning-menu"
              aria-labelledby="filter-earning-button"
              anchorEl={anchorElEarningFilter}
              open={openEarningFilter}
              onClose={handleCloseEarningFilter}
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
                  className="red"
                  value={[
                    new Date(EarningData.customFromDate),
                    new Date(EarningData.customFromToDate),
                  ]}
                  onChange={(ranges) => {
                    setEarningData((prev) => ({
                      ...prev,
                      period: "custom",
                      customFromDate: new Date(ranges[0]),
                      customFromToDate: new Date(ranges[1]),
                    }));
                  }}
                  range
                  rangeHover
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
                    onClick={handleCloseEarningFilter}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{ width: "40px" }}
                    onClick={() => {
                      setEarningData((prev) => ({
                        ...prev,
                        period: "custom",
                        fromDate: dayjs(prev.customFromDate),
                        toDate: dayjs(prev.customFromToDate),
                      }));
                      handleCloseEarningFilter();
                    }}
                  >
                    Ok
                  </Button>
                </Box>
              </Stack>
            </Menu>
          </Grid>
          <Grid
            size={{ xs: 12, sm: 3, md: 4 }}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-around"}
          >
            <Stack
              direction={"row"}
              justifyContent={"flex-start"}
              alignItems={"center"}
              spacing={2}
              sx={{ height: "100%" }}
            >
              <CircleIcon
                // onClick={() => {
                //   setEarningData((prev) => ({
                //     ...prev,
                //     period: "last6months",
                //     fromDate: dayjs().subtract(6, "month").startOf("month"),
                //     toDate: dayjs().subtract(1, "month").endOf("month"),
                //   }));
                // }}
                // sx={{
                //   color:
                //     EarningData?.period === "last6months"
                //       ? "#006AFF"
                //       : "#656575",
                //   cursor: "pointer",
                // }}
                fontSize="small"
                sx={{ color: "#006AFF" }}
              />
              <Typography
                fontWeight={400}
                fontSize={"12px"}
                sx={{ lineHeight: "16px", color: "#656575" }}
              >
                {/* Last 6 months */}
                Current Period
              </Typography>
            </Stack>
            <Stack
              direction={"row"}
              justifyContent={"flex-start"}
              alignItems={"center"}
              spacing={2}
              sx={{ height: "100%" }}
            >
              <CircleIcon
                // onClick={() => {
                //   setEarningData((prev) => ({
                //     ...prev,
                //     period: "lastYear",
                //     fromDate: dayjs()
                //       .subtract(6, "month")
                //       .subtract(1, "year")
                //       .startOf("month"),
                //     toDate: dayjs()
                //       .subtract(1, "month")
                //       .endOf("month")
                //       .subtract(1, "year"),
                //   }));
                // }}
                // sx={{
                //   color:
                //     EarningData?.period === "lastYear" ? "#006AFF" : "#656575",
                //   cursor: "pointer",
                // }}

                sx={{ color: "#656575" }}
                fontSize="small"
              />
              <Typography
                fontWeight={400}
                fontSize={"12px"}
                sx={{ lineHeight: "16px", color: "#656575" }}
              >
                {/* Same period last year */}
                Previous Period
              </Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            {LoadingEarningData ? (
              <CircularProgress />
            ) : (
              <ReactECharts
                option={{
                  // title: {
                  //   text: "Sales Graph:",
                  //   show: width <= 767,
                  // },
                  textStyle: {
                    color: "#525256",
                    fontFamily: "Montserrat",
                    // fontSize: "14px",
                    fontWeight: 400,
                    lineHeight: "16px",
                  },
                  tooltip: {
                    trigger: "axis",
                    axisPointer: {
                      type: "cross",
                      label: { backgroundColor: "#6a7985" },
                    },
                  },
                  dataZoom: [
                    {
                      type: "inside",
                    },
                    {
                      type: "slider",
                    },
                  ],
                  xAxis: {
                    type: "category",
                    boundaryGap: false,
                    // data: EarningData.currentPeriod?.map((val) => val?.day),
                    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                  },
                  yAxis: {
                    type: "value",
                    alignTicks: true,
                    axisLabel: {
                      formatter: "${value}",
                      // paddingLeft: 10,
                      // marginLeft: "10px",
                      width: "100px",
                    },
                    splitArea: {
                      //  width: "100px",
                    },
                  },
                  grid: {
                    left: 4,
                    right: 30,
                    containLabel: true,
                  },
                  axisLine: { show: true, onZero: true },
                  series: [
                    {
                      // data: EarningData.currentPeriod?.map(
                      //   (val) => val?.totalEarnings
                      // ), //EarningData?.seriesData,
                      data: [1220, 1300, 711, 634, 520, 840, 910],
                      type: "line",
                      color: "#006AFF",
                      areaStyle: {
                        color: "#006AFFaa",
                      },
                      smooth: true,
                    },
                    {
                      // data: EarningData?.previousPeriod?.map(
                      //   (val) => val?.totalEarnings
                      // ),
                      data: [820, 932, 901, 934, 1290, 1330, 1320],
                      type: "line",
                      color: "#656575",
                      lineStyle: {
                        color: "#656575",
                        //width: 4,
                        type: "dashed",
                      },
                      smooth: true,
                    },
                  ],
                }}
                notMerge={true}
                lazyUpdate={true}
                // theme={"theme_name"}
                // onChartReady={this.onChartReadyCallback}
                // onEvents={EventsDict}
                opts={{}}
                style={{ width: "100%" }}
              />
            )}
          </Grid>
        </Grid>
      </Card>
    </>
  );
  return (
    <Grid container spacing={3} mb={2}>
      <Grid size={{ xs: 12, sm: 12, md: 12 }}>{CarAvailabilitySection}</Grid>
      <Grid size={{ xs: 12, sm: 12, md: 12 }}>{LiveCarStatusSection}</Grid>
      <Grid size={{ xs: 12, sm: 12, md: 12 }}>{EarningSummarySection}</Grid>
    </Grid>
  );
}

export default Dashboard;
