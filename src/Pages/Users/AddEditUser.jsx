import React, { useState, useEffect, useContext } from "react";
import {
  Typography,
  TextField,
  Card,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import API from "../../api";
import { AppContext } from "../../Context/AppContext";
import SaveCancelBtns from "../../Components/SaveCancelBtns";
import { useTheme } from "@mui/material/styles";

function AddEdit() {
  const navigate = useNavigate();
  const params = useParams();
  const theme = useTheme();
  // console.log("params ", params.name);
  const { setShowBackButton } = useContext(AppContext);
  let pathName = window.location.pathname;
  const [Info, setInfo] = useState({
    id: undefined,
    name: undefined,
    email: undefined,
    phone: undefined,
    role: undefined,
    state: undefined,
    password: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [LoadingInfo, setLoadingInfo] = useState(false);
  const [Roles, setRoles] = useState([]);
  const [Error, setError] = useState({
    isError: false,
    errorMessage: "",
    errors: "",
  });

  useEffect(() => {
    setShowBackButton(false);
  }, []);
  useEffect(() => {
    if (pathName?.includes("edit")) {
      // get car info by name
      setLoadingInfo(true);
      axiosInstance.get(API.users + `/${params.name}`).then((res) => {
        // console.log(res?.data?.data);
        if (res?.data?.success) {
          setInfo({
            id: res?.data?.data?._id,
            name: res?.data?.data?.name,
            email: res?.data?.data?.email,
            phone: res?.data?.data?.mobile,
            role: res?.data?.data?.role?._id,
            state: res?.data?.data?.state,
            password: undefined, //res?.data?.data?.password,
          });
        }
        setLoadingInfo(false);
      });
    }
  }, [pathName, params.name]);
  useEffect(() => {
    axiosInstance
      .get(API.roles_getall)
      .then((res) => {
        let data = res?.data?.data;
        setRoles([...data]);
      })
      .catch((err) => {
        setRoles([]);
      });
  }, []);

  function handleResponse(res) {
    // console.log("res ", res);
    if (res?.data?.success === true) {
      setLoading(false);
      navigate("/management/users");
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
      name: Info.name,
      email: Info.email,
      password: Info.password,
      mobile: Info.phone,
      state: Info.state,
      role: Info.role,
    };
    setLoading(true);
    setError({
      isError: false,
      errorMessage: "",
      errors: "",
    });

    if (pathName?.includes("edit")) {
      axiosInstance.put(API.users + `/${Info.id}`, requestBody).then((res) => {
        handleResponse(res);
      });
    } else {
      axiosInstance.post(API.create_user, requestBody).then((res) => {
        handleResponse(res);
      });
    }
  };
  return (
    <>
      {LoadingInfo && <CircularProgress />}
      {!LoadingInfo && (
        <Card sx={{ padding: "15px" }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <Typography
                sx={{ ...theme.card_title }}
                variant="h6"
                textAlign={"left"}
              >
                User Info
              </Typography>
              <Typography
                sx={{ ...theme.card_sub_title }}
                variant="subtitle1"
                textAlign={"left"}
              >
                Please enter user info
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography
                sx={{ ...theme.field_label }}
                variant="subtitle2"
                textAlign={"left"}
              >
                Name
              </Typography>
              <TextField
                placeholder="Enter user name"
                // size="small"
                fullWidth
                value={Info?.name || ""}
                onChange={(event) => {
                  setInfo((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }));
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography
                sx={{ ...theme.field_label }}
                variant="subtitle2"
                textAlign={"left"}
              >
                Email address
              </Typography>
              <TextField
                placeholder="Enter email address"
                // size="small"
                fullWidth
                value={Info?.email || ""}
                onChange={(event) => {
                  setInfo((prev) => ({
                    ...prev,
                    email: event.target.value,
                  }));
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography
                sx={{ ...theme.field_label }}
                variant="subtitle2"
                textAlign={"left"}
              >
                Phone number
              </Typography>
              <TextField
                placeholder="Enter user phone number"
                // size="small"
                fullWidth
                value={Info?.phone || ""}
                onChange={(event) => {
                  setInfo((prev) => ({
                    ...prev,
                    phone: event.target.value,
                  }));
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography
                sx={{ ...theme.field_label }}
                variant="subtitle2"
                textAlign={"left"}
              >
                Role
              </Typography>
              <Select
                value={Info?.role || ""}
                onChange={(event) => {
                  console.log("event.target.value ", event.target.value);
                  setInfo((prev) => ({
                    ...prev,
                    role: event.target.value,
                  }));
                }}
                name={"role"}
                fullWidth
                // size="small"
                placeholder="Select user role"
              >
                {Roles?.map((ele, i) => (
                  <MenuItem key={i} value={ele?._id}>
                    {ele?.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography
                sx={{ ...theme.field_label }}
                variant="subtitle2"
                textAlign={"left"}
              >
                State
              </Typography>
              <Select
                // multiple
                value={Info?.state || ""}
                onChange={(event) => {
                  setInfo((prev) => ({
                    ...prev,
                    state: event.target.value,
                  }));
                }}
                name={"state"}
                fullWidth
                // size="small"
                placeholder="Select car state"
              >
                {["active", "inactive"]?.map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography
                sx={{ ...theme.field_label }}
                variant="subtitle2"
                textAlign={"left"}
              >
                Password
              </Typography>
              <TextField
                placeholder="Enter user password"
                // size="small"
                fullWidth
                value={Info?.password || ""}
                onChange={(event) => {
                  setInfo((prev) => ({
                    ...prev,
                    password: event.target.value,
                  }));
                }}
              />
            </Grid>
          </Grid>
        </Card>
      )}
      {!LoadingInfo && (
        <SaveCancelBtns handleSave={handleSave} loading={loading} />
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

export default AddEdit;
