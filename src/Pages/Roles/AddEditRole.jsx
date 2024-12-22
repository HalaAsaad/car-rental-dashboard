import React, { useState, useEffect, useContext } from "react";
import {
  Typography,
  TextField,
  Card,
  Checkbox,
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
  const { setShowBackButton, RolesData, setRolesData } = useContext(AppContext);
  let pathName = window.location.pathname;
  const [Info, setInfo] = useState({
    id: undefined,
    name: undefined,
    permissions: {
      vehicles: {
        view: true,
        create: true,
        delete: true,
        edit: true,
      },
      orders: {
        view: true,
        create: true,
        delete: true,
        edit: true,
      },
      users: {
        view: true,
        create: true,
        delete: true,
        edit: true,
      },
      roles: {
        view: true,
        create: true,
        delete: true,
        edit: true,
      },
      customers: {
        view: true,
        create: true,
        delete: true,
        edit: true,
      },
      dashboard: {
        view: true,
      },
      reports: {
        view: true,
      },
      calendar: {
        view: true,
      },
    },
  });
  const [loading, setLoading] = useState(false);
  const [LoadingInfo, setLoadingInfo] = useState(true);
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
      setLoading(true);
      let findItem = RolesData?.find((ele) => `${ele?.id}` === params.name);
      if (findItem) {
        setInfo({
          id: findItem?.id,
          name: findItem?.name,
          permissions: findItem?.permissions,
        });
      }
      setLoadingInfo(false);
      setLoading(false);
    } else {
      setLoadingInfo(false);
      setLoading(false);
    }
  }, [params.name, RolesData]);
  // useEffect(() => {
  //   if (pathName?.includes("edit")) {
  //     // get car info by name
  //     setLoadingInfo(true);
  //     axiosInstance.get(API.roles + `/${params.name}`).then((res) => {
  //       // console.log(res?.data?.data);
  //       if (res?.data?.success) {
  //         setInfo({
  //           id: res?.data?.data?._id,
  //           name: res?.data?.data?.name,
  //           permissions: res?.data?.data?.permissions,
  //         });
  //       }
  //       setLoadingInfo(false);
  //     });
  //   } else {
  //     setLoadingInfo(false);
  //   }
  // }, [pathName, params.name]);

  // function handleResponse(res) {
  //   // console.log("res ", res);
  //   if (res?.data?._id || res?.data?.success) {
  //     setLoading(false);
  //     navigate("/management/roles");
  //   } else {
  //     setLoading(false);
  //     setError({
  //       isError: true,
  //       errorMessage: res?.data?.error || "Some thing went wrong.",
  //       errors: res?.data?.errors?.join(", "),
  //     });
  //   }
  // }
  const AdminPermissions = {
    vehicles: {
      view: true,
      create: true,
      delete: true,
      edit: true,
    },
    orders: {
      view: true,
      create: true,
      delete: true,
      edit: true,
    },
    users: {
      view: true,
      create: true,
      delete: true,
      edit: true,
    },
    roles: {
      view: true,
      create: true,
      delete: true,
      edit: true,
    },
    customers: {
      view: true,
      create: true,
      delete: true,
      edit: true,
    },
    dashboard: {
      view: true,
    },
    reports: {
      view: true,
    },
    calendar: {
      view: true,
    },
  };
  const handleSave = () => {
    if (pathName?.includes("edit")) {
      let index = RolesData?.findIndex((ele) => ele?.id === Info?.id);
      let data = RolesData.slice();
      data[index] = {
        ...Info,
      };
      setRolesData(data);
      navigate("/management/roles");
    } else {
      setRolesData((prev) => [
        {
          ...Info,
          id: Math.random(),
        },
        ...(prev || []),
      ]);
      navigate("/management/roles");
    }
  };
  // const handleSave = () => {
  //   const requestBody = {
  //     name: Info.name,
  //     permissions: Info.name === "Admin" ? AdminPermissions : Info.permissions,
  //   };
  //   setLoading(true);
  //   setError({
  //     isError: false,
  //     errorMessage: "",
  //     errors: "",
  //   });

  //   if (pathName?.includes("edit")) {
  //     axiosInstance.put(API.roles + `/${Info.id}`, requestBody).then((res) => {
  //       handleResponse(res);
  //     });
  //   } else {
  //     axiosInstance.post(API.create_roles, requestBody).then((res) => {
  //       handleResponse(res);
  //     });
  //   }
  // };
  const tableLabelStyle = {
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "16.8px",
    textAlign: "left",
    color: "#201D23",
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
                Role Info
              </Typography>
              <Typography
                sx={{ ...theme.card_sub_title }}
                variant="subtitle1"
                textAlign={"left"}
              >
                Please enter role info
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
                placeholder="Enter role name"
                // size="small"
                fullWidth
                value={Info?.name}
                onChange={(event) => {
                  setInfo((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }));
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} />
            <Grid size={{ xs: 12, sm: 12 }}>
              <Typography
                sx={{ ...theme.field_label }}
                variant="subtitle2"
                textAlign={"left"}
              >
                Select permissions
              </Typography>
              <Card sx={{ marginTop: "5px" }}>
                <Grid
                  container
                  spacing={3}
                  p={1}
                  sx={{ backgroundColor: "#FAFAFA" }}
                >
                  <Grid size={{ xs: 3, sm: 3 }}>
                    <Typography
                      sx={tableLabelStyle}
                      variant="body1"
                      textAlign={"left"}
                    >
                      Permissions
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 2, sm: 2 }}>
                    <Typography
                      sx={tableLabelStyle}
                      variant="body1"
                      textAlign={"left"}
                    >
                      View
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 2, sm: 2 }}>
                    <Typography
                      sx={tableLabelStyle}
                      variant="body1"
                      textAlign={"left"}
                    >
                      Create
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 2, sm: 2 }}>
                    <Typography
                      sx={tableLabelStyle}
                      variant="body1"
                      textAlign={"left"}
                    >
                      Delete
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 2, sm: 2 }}>
                    <Typography
                      sx={tableLabelStyle}
                      variant="body1"
                      textAlign={"left"}
                    >
                      Edit
                    </Typography>
                  </Grid>
                </Grid>
                {[
                  {
                    label: "Dashboard",
                    value: "dashboard",
                    hide_create: true,
                    hide_delete: true,
                    hide_edit: true,
                  },
                  { label: "Vehicles", value: "vehicles" },
                  { label: "Users", value: "users" },
                  { label: "Roles", value: "roles" },
                  { label: "Customers", value: "customers" },
                  { label: "Orders", value: "orders" },
                  {
                    label: "Report",
                    value: "reports",
                    hide_create: true,
                    hide_delete: true,
                    hide_edit: true,
                  },
                  {
                    label: "Calendar",
                    value: "calendar",
                    hide_create: true,
                    hide_delete: true,
                    hide_edit: true,
                  },
                ].map((ele, i) => (
                  <Grid
                    container
                    spacing={3}
                    p={1}
                    sx={{ backgroundColor: i % 2 !== 0 ? "#FAFAFA" : "#fff" }}
                    key={i}
                  >
                    <Grid size={{ xs: 3, sm: 3 }}>
                      <Typography variant="subtitle2" textAlign={"left"}>
                        {ele.label}
                      </Typography>
                    </Grid>
                    <Grid
                      size={{ xs: 2, sm: 2 }}
                      display={"flex"}
                      justifyContent={"left"}
                    >
                      <Checkbox
                        checked={Info?.permissions[ele.value]?.view}
                        // disabled={Info.name === "Admin"}
                        onChange={(e) => {
                          setInfo((prev) => ({
                            ...prev,
                            permissions: {
                              ...(prev?.permissions || {}),
                              [ele.value]: {
                                ...(prev?.permissions[ele.value] || {}),
                                view: e.target.checked,
                              },
                            },
                          }));
                        }}
                        color="secondary"
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    </Grid>
                    <Grid
                      size={{ xs: 2, sm: 2 }}
                      display={"flex"}
                      justifyContent={"left"}
                    >
                      {!ele?.hide_create && (
                        <Checkbox
                          checked={Info?.permissions[ele.value]?.create}
                          // disabled={Info.name === "Admin"}
                          onChange={(e) => {
                            setInfo((prev) => ({
                              ...prev,
                              permissions: {
                                ...(prev?.permissions || {}),
                                [ele.value]: {
                                  ...(prev?.permissions[ele.value] || {}),
                                  create: e.target.checked,
                                },
                              },
                            }));
                          }}
                          color="secondary"
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      )}
                    </Grid>
                    <Grid
                      size={{ xs: 2, sm: 2 }}
                      display={"flex"}
                      justifyContent={"left"}
                    >
                      {!ele?.hide_delete && (
                        <Checkbox
                          checked={Info?.permissions[ele.value]?.delete}
                          // disabled={Info.name === "Admin"}
                          onChange={(e) => {
                            setInfo((prev) => ({
                              ...prev,
                              permissions: {
                                ...(prev?.permissions || {}),
                                [ele.value]: {
                                  ...(prev?.permissions[ele.value] || {}),
                                  delete: e.target.checked,
                                },
                              },
                            }));
                          }}
                          color="secondary"
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      )}
                    </Grid>
                    <Grid
                      size={{ xs: 2, sm: 2 }}
                      display={"flex"}
                      justifyContent={"left"}
                    >
                      {!ele?.hide_edit && (
                        <Checkbox
                          checked={Info?.permissions[ele.value]?.edit}
                          // disabled={Info.name === "Admin"}
                          onChange={(e) => {
                            setInfo((prev) => ({
                              ...prev,
                              permissions: {
                                ...(prev?.permissions || {}),
                                [ele.value]: {
                                  ...(prev?.permissions[ele.value] || {}),
                                  edit: e.target.checked,
                                },
                              },
                            }));
                          }}
                          color="secondary"
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      )}
                    </Grid>
                  </Grid>
                ))}
              </Card>
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
