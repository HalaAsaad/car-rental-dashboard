import React, { useState, useEffect, useContext } from "react";
import {
  Stack,
  Typography,
  TextField,
  Card,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import axiosInstance from "../../axiosInstance";
import API from "../../api";
import { AppContext } from "../../Context/AppContext";
import SaveCancelBtns from "../../Components/SaveCancelBtns";
import { styled, useTheme } from "@mui/material/styles";

function AddEditTask() {
  const navigate = useNavigate();
  const params = useParams();
  const theme = useTheme();
  // console.log("params ", params.name, params?.taskId);
  const { setShowBackButton, setNavigationBackURL } = useContext(AppContext);
  let pathName = window.location.pathname;
  const [Info, setInfo] = useState({
    id: undefined,
    title: undefined,
    next_mileage: undefined,
    date: undefined,
    description: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [Error, setError] = useState({
    isError: false,
    errorMessage: "",
    errors: "",
  });
  const [LoadingGetInfo, setLoadingGetInfo] = useState(false);

  useEffect(() => {
    setShowBackButton(true);
    setNavigationBackURL({
      to: "",
      state: {},
    });
  }, []);
  useEffect(() => {
    if (pathName?.includes("edit")) {
      // get car info by name
      setLoadingGetInfo(true);
      axiosInstance
        .get(API.vehicles + `/${params.name}/maintenance/${params.taskId}`)
        .then((res) => {
          // console.log(res?.data?.data);
          if (res?.data?.success) {
            setInfo({
              id: res?.data?.data?._id,
              title: res?.data?.data?.title,
              next_mileage: res?.data?.data?.nextMileage,
              date: dayjs(res?.data?.data?.nextReminderDate),
              description: res?.data?.data?.description,
            });
          }
          setLoadingGetInfo(false);
        });
    }
  }, [pathName, params.name]);

  function handleResponse(res) {
    // console.log("res ", res);
    if (res?.data?._id || res?.data?.success === true) {
      setLoading(false);
      navigate(`/vehicles/maintenance/${params.name}`);
    } else {
      setLoading(false);
      setError({
        isError: true,
        errorMessage: res?.data?.error || "Some thing went wrong.",
        errors: res?.data?.errors?.join(", "),
      });
    }
  }

  const handleSave = () => {
    const requestBody = {
      title: Info.title,
      nextReminderDate: new Date(Info.date).toLocaleDateString(),
      nextMileage: Info.next_mileage,
      description: Info.description,
    };
    setLoading(true);
    setError({
      isError: false,
      errorMessage: "",
      errors: "",
    });

    if (pathName?.includes("edit")) {
      axiosInstance
        .put(
          API.vehicles + `/${params.name}/maintenance/${params.taskId}`,
          requestBody
        )
        .then((res) => {
          handleResponse(res);
        });
    } else {
      axiosInstance
        .post(API.vehicles + `/${params.name}/maintenance`, requestBody)
        .then((res) => {
          handleResponse(res);
        });
    }
  };
  return (
    <>
      <Card sx={{ padding: "15px", marginBottom: "10px" }}>
        {LoadingGetInfo && (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <CircularProgress />
            </Grid>
          </Grid>
        )}
        {!LoadingGetInfo && (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <Typography
                sx={{ ...theme.card_title }}
                variant="h6"
                textAlign={"left"}
              >
                Car Info
              </Typography>
              <Typography
                sx={{ ...theme.card_sub_title }}
                variant="subtitle1"
                textAlign={"left"}
              >
                Please enter car info
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <Stack direction={"column"} spacing={1}>
                <Typography
                  sx={{ ...theme.field_label }}
                  variant="subtitle2"
                  textAlign={"left"}
                >
                  Title
                </Typography>
                <TextField
                  placeholder="Enter maintenance title"
                  //size="small"
                  sx={{ ...theme.field_label }}
                  fullWidth
                  value={Info?.title}
                  onChange={(event) => {
                    setInfo((prev) => ({
                      ...prev,
                      title: event.target.value,
                    }));
                  }}
                />
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
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    sx={
                      {
                        // "& input": {
                        //   padding: "8.5px 14px",
                        // },
                      }
                    }
                    //size="small"
                    value={Info.date}
                    onChange={(newValue) =>
                      setInfo((prev) => ({
                        ...prev,
                        date: newValue,
                      }))
                    }
                  />
                </LocalizationProvider>
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
                <TextField
                  placeholder="Enter next mileage"
                  //size="small"
                  fullWidth
                  type="number"
                  value={Info?.next_mileage}
                  onChange={(event) => {
                    setInfo((prev) => ({
                      ...prev,
                      next_mileage: event.target.value,
                    }));
                  }}
                />
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6 }} />
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <Stack direction={"column"} spacing={1}>
                <Typography
                  sx={{ ...theme.field_label }}
                  variant="subtitle2"
                  textAlign={"left"}
                >
                  Description
                </Typography>
                <TextField
                  placeholder="Enter maintenance description"
                  fullWidth
                  multiline
                  rows={4}
                  value={Info?.description}
                  onChange={(event) => {
                    setInfo((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }));
                  }}
                />
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6 }} />
          </Grid>
        )}
      </Card>
      {!LoadingGetInfo && (
        <SaveCancelBtns
          handleSave={handleSave}
          loading={loading}
          disabledSave={!Info?.title || (!Info?.next_mileage && !Info?.date)}
        />
      )}

      <Snackbar
        open={Error.isError}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() =>
            setError({
              isError: false,
              errorMessage: "",
              errors: "",
            })
          }
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {Error.errorMessage}
          {Error?.errors && <br />}
          {Error?.errors || ""}
        </Alert>
      </Snackbar>
    </>
  );
}

export default AddEditTask;
