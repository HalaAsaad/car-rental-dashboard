import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  Card,
  // InputLabel,
  // OutlinedInput,
  // FormControl,
  // Select,
  // MenuItem,
  TextField,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Grid from "@mui/material/Grid2";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import API from "../../api";
import { AppContext } from "../../Context/AppContext";
import {
  BorderColorOutlined as BorderColorOutlinedIcon,
  DeleteOutlined as DeleteOutlinedIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import { styled, useTheme } from "@mui/material/styles";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import RemoveDialog from "../../Components/RemoveDialog";
import { DatePicker } from "@mui/x-date-pickers";

const data = [
  {
    title: "sss",
    nextReminderDate: "2024-11-20T22:00:00.000Z",
    status: "pending",
    _id: "673ef1f51b6a656a75714996",
  },
  {
    title: "Tire Rotation2",
    nextReminderDate: "2024-11-22T00:00:00.000Z",
    nextMileage: 1000,
    description: "Rotate tires to extend their life and improve performance.",
    status: "completed",
    _id: "6740e62ada43d362e80994ed",
  },
  {
    title: "test",
    nextReminderDate: "2024-11-23T00:00:00.000Z",
    description: "test 2",
    status: "pending",
    _id: "6741b1c7b51769207262232f",
  },
  {
    title: "Tire Rotation2",
    nextReminderDate: "2024-12-02T00:00:00.000Z",
    nextMileage: 1000,
    description: "Rotate tires to extend their life and improve performance.",
    status: "pending",
    _id: "674db2e5c25e9aed93e22c6a",
  },
  {
    title: "Tire Rotation2",
    nextReminderDate: "2024-12-03T00:00:00.000Z",
    nextMileage: 1000,
    description: "Rotate tires to extend their life and improve performance.",
    status: "pending",
    _id: "674ef577660cd858aa185f51",
  },
];
function Maintenance() {
  const navigate = useNavigate();
  const params = useParams();
  const theme = useTheme();
  const { setShowBackButton, setNavigationBackURL } = useContext(AppContext);
  const [filterValues, setFilterValues] = useState({
    Mileage: "",
    from: undefined,
    to: undefined,
  });
  const [Tasks, setTasks] = useState([]);
  const [AllData, setAllData] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [OpenRemove, setOpenRemove] = useState(false);
  const [RowData, setRowData] = useState({});
  const [Refresh, setRefresh] = useState(false);

  useEffect(() => {
    setShowBackButton(true);
    setNavigationBackURL({
      to: "/vehicles",
      state: {},
    });
  }, []);
  useEffect(() => {
    if (params.name) {
      // get info by name
      axiosInstance
        .get(API.vehicles + `/${params.name}/maintenance`)
        .then((res) => {
          // console.log(res?.data?.data);
          if (res?.data?.success) {
            setAllData(res?.data?.maintenanceTasks || []);
          }
        });
    }
  }, [params.name, Refresh]);
  useEffect(() => {
    if (params.name) {
      // get info by name
      setLoading(true);
      axiosInstance
        .get(API.vehicles + `/${params.name}/maintenance`, {
          params: {
            mileage: filterValues?.Mileage,
            dateFrom: filterValues?.from,
            dateTo: filterValues?.to,
          },
        })
        .then((res) => {
          // console.log(res?.data?.data);
          if (res?.data?.success) {
            setTasks(res?.data?.maintenanceTasks || []);
          }
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    }
  }, [params.name, Refresh, filterValues]);

  return (
    <>
      <Grid container spacing={2} mb={2}>
        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
          <Card sx={{ padding: "15px" }}>
            <Grid container spacing={1}>
              <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                <Typography
                  sx={{ ...theme.card_title }}
                  variant="h6"
                  textAlign={"left"}
                >
                  Maintenance
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                <Stack
                  direction={{ xs: "column", md: "column", lg: "row" }}
                  spacing={2}
                >
                  <Autocomplete
                    sx={{ m: 1, width: "25ch" }}
                    size="small"
                    freeSolo
                    disableClearable
                    options={AllData?.map((option) => option.nextMileage)}
                    value={filterValues?.Mileage}
                    onInputChange={(event, newInputValue) => {
                      setFilterValues((prev) => ({
                        ...prev,
                        Mileage: newInputValue,
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Search Mileage..."
                        slotProps={{
                          input: {
                            ...params.InputProps,
                            type: "search",
                            endAdornment: (
                              <InputAdornment position="end">
                                <SearchIcon />
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    )}
                  />

                  <Box display={"flex"}>
                    {[
                      { label: "Date from", name: "from" },
                      { label: "Date to", name: "to" },
                    ].map((ele, i) => (
                      <LocalizationProvider key={i} dateAdapter={AdapterDayjs}>
                        <DatePicker
                          size="small"
                          sx={{
                            "& .MuiInputBase-root": {
                              flexFlow: "row-reverse",
                            },
                            "& .MuiInputBase-input": {
                              padding: "9px",
                            },
                            "& .MuiFormLabel-root": {
                              top: "-7px",
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
                      navigate(
                        `/vehicles/maintenance/${params?.name}/add-task`
                      );
                    }}
                    // loading={loading}
                    color="secondary"
                    size="small"
                    sx={{
                      marginLeft: "auto !important",
                      textTransform: "none",
                      width: "200px",
                    }}
                  >
                    Add maintenance task
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
          {Loading ? (
            <CircularProgress />
          ) : (
            <>
              {Tasks?.length === 0 && (
                <Typography variant="subtitle2">There is no tasks.</Typography>
              )}
              {Tasks?.map((ele, i) => (
                <Accordion key={i} sx={{ marginBottom: "10px" }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon color="secondary" />}
                    aria-controls="panel3-content"
                    id="panel3-header"
                    sx={{ padding: "10px 15px" }}
                  >
                    <Stack direction={"row"} alignItems={"center"}>
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{ textTransform: "capitalize" }}
                      >
                        {ele?.title}
                      </Typography>
                      <BorderColorOutlinedIcon
                        sx={{ fontSize: "18px", marginLeft: "20px" }}
                      />
                      <DeleteOutlinedIcon
                        sx={{ fontSize: "18px", marginLeft: "10px" }}
                        color="secondary"
                      />
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails sx={{ padding: "5 15px" }}>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                        <Stack direction={"column"} spacing={1}>
                          <Typography
                            sx={{ ...theme.field_label }}
                            variant="subtitle2"
                            textAlign={"left"}
                          >
                            Title
                          </Typography>
                          <Typography
                            sx={{
                              backgroundColor: "#F6F7F9",
                              textAlign: "left",
                              padding: "10px 10px",
                              borderRadius: "8px",
                            }}
                            variant="body2"
                          >
                            {ele?.title}
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                        <Stack direction={"column"} spacing={1}>
                          <Typography
                            sx={{ ...theme.field_label }}
                            variant="subtitle2"
                            textAlign={"left"}
                          >
                            Next reminder date
                          </Typography>
                          <Typography
                            sx={{
                              backgroundColor: "#F6F7F9",
                              textAlign: "left",
                              padding: "10px 10px",
                              borderRadius: "8px",
                            }}
                            variant="body2"
                          >
                            {new Date(
                              ele?.nextReminderDate
                            ).toLocaleDateString()}
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                        <Stack direction={"column"} spacing={1}>
                          <Typography
                            sx={{ ...theme.field_label }}
                            variant="subtitle2"
                            textAlign={"left"}
                          >
                            Next mileage
                          </Typography>
                          <Typography
                            sx={{
                              backgroundColor: "#F6F7F9",
                              textAlign: "left",
                              padding: "10px 10px",
                              borderRadius: "8px",
                            }}
                            variant="body2"
                          >
                            {ele?.nextMileage}
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                        {/* <Stack direction={"column"} spacing={1}>
                          <Typography
                            sx={{ ...theme.field_label }}
                            variant="subtitle2"
                            textAlign={"left"}
                          >
                            Status
                          </Typography>
                          <Typography
                            sx={{
                              backgroundColor: "#F6F7F9",
                              textAlign: "left",
                              padding: "10px 10px",
                              borderRadius: "8px",
                            }}
                            variant="body2"
                          >
                            {ele?.status}
                          </Typography>
                        </Stack> */}
                      </Grid>
                      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                        <Stack direction={"column"} spacing={1}>
                          <Typography
                            sx={{ ...theme.field_label }}
                            variant="subtitle2"
                            textAlign={"left"}
                          >
                            Description
                          </Typography>
                          <Typography
                            sx={{
                              backgroundColor: "#F6F7F9",
                              textAlign: "left",
                              padding: "10px 10px",
                              borderRadius: "8px",
                              height: "200px",
                            }}
                            variant="body2"
                          >
                            {ele?.description}
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 12, md: 6 }} />
                    </Grid>
                  </AccordionDetails>
                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    mb={2}
                  >
                    <Button
                      variant="contained"
                      onClick={() => {
                        setRowData(ele);
                        setOpenRemove(true);
                      }}
                      color="secondary"
                      size="small"
                      sx={{
                        width: "140px",
                        padding: "7px",
                        textTransform: "none",
                      }}
                    >
                      <DeleteOutlinedIcon
                        sx={{ fontSize: "20px", marginRight: "5px" }}
                      />
                      Delete
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => {
                        navigate(
                          `/vehicles/maintenance/${params?.name}/edit-task/${ele?._id}`
                        );
                      }}
                      size="small"
                      sx={{
                        width: "140px",
                        padding: "7px",
                        marginLeft: "10px",
                        textTransform: "none",
                      }}
                    >
                      <BorderColorOutlinedIcon
                        sx={{ fontSize: "20px", marginRight: "5px" }}
                      />
                      Edit Task
                    </Button>
                  </Box>
                </Accordion>
              ))}
            </>
          )}
        </Grid>
      </Grid>
      <RemoveDialog
        open={OpenRemove}
        setOpen={setOpenRemove}
        endpoint={API.vehicles + `/${params.name}/maintenance`}
        itemId={RowData?._id}
        setRefresh={setRefresh}
        Refresh={Refresh}
      />
    </>
  );
}

export default Maintenance;
