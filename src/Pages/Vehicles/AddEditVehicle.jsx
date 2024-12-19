import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Stack,
  Typography,
  TextField,
  Card,
  Select,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
  Checkbox,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { styled, useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import API from "../../api";
import { AppContext } from "../../Context/AppContext";
import SaveCancelBtns from "../../Components/SaveCancelBtns";
import { deleteItemFromArray } from "../../lib";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function AddEdit() {
  const navigate = useNavigate();
  const params = useParams();
  const theme = useTheme();
  // console.log("params ", params.name);
  const { setShowBackButton, VehiclesData, setVehiclesData } =
    useContext(AppContext);
  let pathName = window.location.pathname;
  const [Info, setInfo] = useState({
    id: undefined,
    media: undefined,
    carId: undefined,
    vinNumber: undefined,
    brand: undefined,
    model: undefined,
    color: undefined,
    mileage: undefined,
    rentalPrice: undefined,
    state: undefined,
    //nextMaintenanceDate: undefined,
    year: undefined,
    out_of_service: false,
  });
  console.log("info ", Info);
  // const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [LoadingInfo, setLoadingInfo] = useState(true);
  const [LoadingDeleteImage, setLoadingDeleteImage] = useState(false);
  const [Refresh, setRefresh] = useState(false);
  const [Error, setError] = useState({
    isError: false,
    errorMessage: "",
    errors: "",
  });

  useEffect(() => {
    setShowBackButton(false);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);
  useEffect(() => {
    if (pathName?.includes("edit")) {
      // get car info by name
      setLoading(true);
      let findCar = VehiclesData?.find((ele) => `${ele?.id}` === params.name);
      if (findCar) {
        setInfo({
          id: findCar?.id,
          media: findCar?.media,
          carId: findCar?.carId,
          vinNumber: findCar?.vinNumber,
          brand: findCar?.brand,
          model: findCar?.model,
          color: findCar?.color,
          mileage: findCar?.mileage,
          rentalPrice: findCar?.rentalPrice,
          state: findCar?.state,
          nextMaintenanceDate: findCar?.nextMaintenanceDate,
          out_of_service: findCar?.state === "out_of_service" ? true : false,
          // nextMaintenanceDate: dayjs(findCar?.nextMaintenanceDate),
          year: findCar?.year
            ? dayjs(new Date().setFullYear(findCar?.year))
            : undefined,
        });
      }
      setLoading(false);
      setLoadingInfo(false);
      setLoadingDeleteImage(false);
    } else {
      setLoading(false);
      setLoadingInfo(false);
      setLoadingDeleteImage(false);
    }
  }, [params.name, VehiclesData]);

  // useEffect(() => {
  //   if (pathName?.includes("edit")) {
  //     // get car info by name
  //     setLoadingInfo(true);
  //     axiosInstance
  //       .get(API.vehicles + `/${params.name}`)
  //       .then((res) => {
  //         // console.log(res?.data?.data);
  //         if (res?.data?.success) {
  //           setInfo({
  //             id: res?.data?.data?._id,
  //             media: res?.data?.data?.media,
  //             carId: res?.data?.data?.carId,
  //             vinNumber: res?.data?.data?.vinNumber,
  //             brand: res?.data?.data?.brand,
  //             model: res?.data?.data?.model,
  //             color: res?.data?.data?.color,
  //             mileage: res?.data?.data?.mileage,
  //             rentalPrice: res?.data?.data?.rentalPrice,
  //             state: res?.data?.data?.state,
  //             out_of_service:
  //               res?.data?.data?.state === "out_of_service" ? true : false,
  //             // nextMaintenanceDate: dayjs(res?.data?.data?.nextMaintenanceDate),
  //             year: res?.data?.data?.year
  //               ? dayjs(new Date().setFullYear(res?.data?.data?.year))
  //               : undefined,
  //           });
  //           setLoadingInfo(false);
  //         }
  //         setLoadingDeleteImage(false);
  //       })
  //       .catch((err) => {
  //         setLoadingInfo(false);
  //         setLoadingDeleteImage(false);
  //       });
  //   } else {
  //     setLoadingInfo(false);
  //     setLoadingDeleteImage(false);
  //   }
  // }, [pathName, params.name, Refresh]);

  // function handleResponse(res) {
  //   // console.log("res ", res);
  //   if (res?.data?.success === true) {
  //     setLoading(false);
  //     navigate("/vehicles");
  //   } else {
  //     setLoading(false);
  //     setError({
  //       isError: true,
  //       errorMessage: res?.data?.error || "Some thing went wrong.",
  //       errors: res?.data?.errors?.join(", "),
  //     });
  //   }
  // }
  const handleSave = () => {
    if (pathName?.includes("edit")) {
    } else {
      setVehiclesData((prev) => [
        { ...Info, id: Math.random() },
        ...(prev || []),
      ]);
      navigate("/vehicles");
    }
  };
  // const handleSave = () => {
  //   let bodyData = new FormData();
  //   bodyData.append("carId", Info?.carId);
  //   bodyData.append("vinNumber", Info?.vinNumber);
  //   bodyData.append("brand", Info?.brand);
  //   bodyData.append("model", Info?.model);
  //   bodyData.append("color", Info?.color);
  //   bodyData.append("mileage", Info?.mileage);
  //   bodyData.append("rentalPrice", Info?.rentalPrice);
  //   if (Info?.out_of_service) {
  //     bodyData.append("state", "out_of_service");
  //   } else {
  //     bodyData.append("state", "available");
  //   }
  //   //bodyData.append("nextMaintenanceDate", Info?.nextMaintenanceDate);
  //   bodyData.append(
  //     "year",
  //     Info?.year ? new Date(Info?.year).getFullYear() : undefined
  //   );
  //   files?.forEach((f) => {
  //     bodyData.append("media", f);
  //   });
  //   setLoading(true);
  //   setError({
  //     isError: false,
  //     errorMessage: "",
  //     errors: "",
  //   });

  //   if (pathName?.includes("edit")) {
  //     axiosInstance.put(API.vehicles + `/${Info.id}`, bodyData).then((res) => {
  //       handleResponse(res);
  //     });
  //   } else {
  //     axiosInstance.post(API.vehicles, bodyData).then((res) => {
  //       handleResponse(res);
  //     });
  //   }
  // };
  const renderImage = (url, onClick) => {
    return (
      <div
        className=""
        style={{
          flexGrow: 1,
          height: "286px",
          borderRadius: "13px",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundImage: `url('${url}')`,
          position: "relative",
        }}
      >
        <Box
          sx={{
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            padding: "0px",
            backgroundColor: "#FAFAFAE0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            cursor: "pointer",
            position: "absolute",
            right: 10,
            top: 10,
          }}
          onClick={onClick}
        >
          <CloseIcon size={"small"} color="secondary" />
        </Box>
      </div>
    );
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
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography
                sx={{ ...theme.field_label }}
                variant="subtitle2"
                textAlign={"left"}
              >
                Brand
              </Typography>
              <TextField
                placeholder="Enter car brand"
                //size="small"
                fullWidth
                value={Info?.brand}
                onChange={(event) => {
                  setInfo((prev) => ({
                    ...prev,
                    brand: event.target.value,
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
                Model
              </Typography>
              <TextField
                placeholder="Enter car model"
                //size="small"
                fullWidth
                value={Info?.model}
                onChange={(event) => {
                  setInfo((prev) => ({
                    ...prev,
                    model: event.target.value,
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
                Color
              </Typography>
              <TextField
                placeholder="Enter car color"
                // size="small"
                fullWidth
                value={Info?.color}
                onChange={(event) => {
                  setInfo((prev) => ({
                    ...prev,
                    color: event.target.value,
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
                Mileage
              </Typography>
              <TextField
                placeholder="Enter car mileage"
                //size="small"
                type="number"
                fullWidth
                value={Info?.mileage}
                onChange={(event) => {
                  setInfo((prev) => ({
                    ...prev,
                    mileage: event.target.value,
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
                Car ID
              </Typography>
              <TextField
                placeholder="Enter car ID"
                // size="small"
                fullWidth
                value={Info?.carId}
                onChange={(event) => {
                  setInfo((prev) => ({
                    ...prev,
                    carId: event.target.value,
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
                VIN Number
              </Typography>
              <TextField
                placeholder="Enter car VINnumber"
                //size="small"
                fullWidth
                value={Info?.vinNumber}
                onChange={(event) => {
                  setInfo((prev) => ({
                    ...prev,
                    vinNumber: event.target.value,
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
                Rent price
              </Typography>
              <TextField
                placeholder="Enter rent price"
                //size="small"
                type="number"
                fullWidth
                value={Info?.rentalPrice}
                onChange={(event) => {
                  setInfo((prev) => ({
                    ...prev,
                    rentalPrice: event.target.value,
                  }));
                }}
              />
            </Grid>
            <Grid
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
              size={{ xs: 12, sm: 6 }}
            >
              <Typography
                sx={{ ...theme.field_label, width: "100%" }}
                variant="subtitle2"
                textAlign={"left"}
              >
                Out of service
              </Typography>
              <Checkbox
                sx={{ marginRight: "auto" }}
                checked={Info?.out_of_service}
                color="secondary"
                onChange={(event) => {
                  setInfo((prev) => ({
                    ...prev,
                    out_of_service: event.target.checked,
                  }));
                }}
                inputProps={{ "aria-label": "controlled" }}
              />
              {/* <Select
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
                {[
                  { label: "available", value: "available" },
                  { label: "rented", value: "rented" },
                  { label: "in maintenance", value: "in_maintenance" },
                  { label: "out of service", value: "out_of_service" },
                ]?.map((ele) => (
                  <MenuItem key={ele?.value} value={ele?.value}>
                    {ele.label}
                  </MenuItem>
                ))}
              </Select> */}
            </Grid>
            <Grid
              size={{ xs: 12, sm: 6 }}
              sx={{ "& .MuiFormControl-root": { width: "100%" } }}
            >
              <Typography
                sx={{ ...theme.field_label }}
                variant="subtitle2"
                textAlign={"left"}
              >
                Year
              </Typography>
              <LocalizationProvider
                sx={{ "& .MuiTextField-root": { width: "100% !important" } }}
                dateAdapter={AdapterDayjs}
              >
                <DatePicker
                  openTo="year"
                  views={["year"]}
                  sx={{
                    "& input": {
                      // padding: "8.5px 14px",
                      width: "100%",
                    },
                  }}
                  //size="small"
                  value={Info.year}
                  onChange={(newValue) =>
                    setInfo((prev) => ({
                      ...prev,
                      year: newValue,
                    }))
                  }
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </Card>
      )}
      {!LoadingInfo && (
        <Card sx={{ padding: "15px", marginTop: "10px", marginBottom: "10px" }}>
          <Grid container spacing={1}>
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <Typography
                sx={{ ...theme.card_title }}
                variant="h6"
                textAlign={"left"}
              >
                Add images
              </Typography>
              <Typography
                variant="subtitle1"
                textAlign={"left"}
                sx={{ ...theme.card_sub_title }}
              >
                Please enter car images
              </Typography>
            </Grid>
            {LoadingDeleteImage ? (
              <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                <CircularProgress />
              </Grid>
            ) : (
              <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                <Grid container spacing={1}>
                  {Info?.media?.map((ele, i) => (
                    <Grid key={i} size={{ xs: 12, sm: 12, md: 4 }}>
                      {renderImage(ele?.url, () => {
                        // delete image by url
                        let _newMedia = deleteItemFromArray(Info?.media, i);
                        setInfo((prev) => ({
                          ...prev,
                          media: _newMedia,
                        }));
                      })}
                    </Grid>
                  ))}
                  {/* {Info?.media?.map((ele, i) => (
                    <Grid key={i} size={{ xs: 12, sm: 12, md: 4 }}>
                      {renderImage(ele?.url, () => {
                        // delete image by url
                        setLoadingDeleteImage(true);
                        axiosInstance
                          .delete(`/vehicles/${Info?.id}/media/${ele?._id}`)
                          .then((res) => {
                            //   console.log("delete res ", res);
                            if (res?.statusText === "OK") {
                              setRefresh(!Refresh);
                            }
                          });
                      })}
                    </Grid>
                  ))}
                  {files?.map((file, i) => (
                    <Grid key={i} size={{ xs: 12, sm: 12, md: 4 }}>
                      {renderImage(window.URL.createObjectURL(file), () => {
                        let _files = [...files];
                        _files.splice(i, 1);
                        setFiles(_files);
                      })}
                    </Grid>
                  ))} */}
                  <Grid size="grow">
                    <Box
                      sx={{
                        border: "1px dashed #DEDEDE",
                        height: "286px",
                        borderRadius: "13px",
                        flexGrow: 1,
                        display: "flex",
                        alignItems: "center",
                        // justifyContent: "center",
                      }}
                    >
                      <Stack
                        direction={"column"}
                        alignItems={"center"}
                        justifyContent={"center"}
                        sx={{ flexGrow: 1 }}
                      >
                        <img
                          style={{ width: "52px", cursor: "pointer" }}
                          alt={"upload"}
                          src="/images/upload.png"
                          onClick={() => {
                            document.getElementById("upload_car_id").click();
                          }}
                        />
                        <Typography
                          sx={{ color: "#808080" }}
                          variant="subtitle1"
                          textAlign={"left"}
                        >
                          Upload car image
                        </Typography>
                        <VisuallyHiddenInput
                          id="upload_car_id"
                          type="file"
                          onChange={(event) => {
                            // console.log(event.target.files);
                            const reader = new FileReader();
                            const file = event.target.files[0];
                            reader.addEventListener(
                              "load",
                              function (e) {
                                //console.log(e.currentTarget.result);
                                setInfo((prev) => ({
                                  ...prev,
                                  media: [
                                    ...(prev.media || [])?.filter(
                                      (ele) => ele.url !== undefined
                                    ),
                                    {
                                      url: e.currentTarget.result,
                                    },
                                  ],
                                }));
                              },
                              false
                            );
                            const data = reader.readAsDataURL(file);
                            setInfo((prev) => ({
                              ...prev,
                              media: [
                                ...(prev.media || [])?.filter(
                                  (ele) => ele.url !== undefined
                                ),
                                {
                                  url: data,
                                },
                              ],
                            }));
                          }}
                          //multiple
                          // size={}
                        />
                      </Stack>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Card>
      )}
      {!LoadingInfo && (
        <SaveCancelBtns
          handleSave={handleSave}
          loading={loading}
          disabledSave={!Info?.media?.length}
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

export default AddEdit;
