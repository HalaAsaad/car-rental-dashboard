import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  TextField,
  Card,
  Snackbar,
  Alert,
  Radio,
  Select,
  MenuItem,
  Stack,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Grid from "@mui/material/Grid2";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import API from "../../api";
import { AppContext } from "../../Context/AppContext";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SaveCancelBtns from "../../Components/SaveCancelBtns";
import dayjs from "dayjs";
import { useTheme } from "@mui/material/styles";

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
  const { setShowBackButton, CustomersData, setCustomersData } =
    useContext(AppContext);
  let pathName = window.location.pathname;
  const [Info, setInfo] = useState({
    id: undefined,
    name: undefined,
    email: undefined,
    phoneNumber: undefined,

    image: undefined,
    dateOfBirth: undefined,
    policyNumber: undefined,
    paymentMethod: undefined, // enum: ["online", "bank-transfer", "cash-on-delivery"],
    status: undefined,
  });
  const [MethodInfo, setMethodInfo] = useState({
    cardType: undefined, //"Visa", "MasterCard", "PayPal"
    cardNumber: undefined,
    expirationDate: undefined,
    cardHolder: undefined,
    cvc: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [LoadingInfo, setLoadingInfo] = useState(false);
  const [Roles, setRoles] = useState([]);
  const [Error, setError] = useState({
    isError: false,
    errorMessage: "",
    errors: "",
  });
  const [expanded, setExpanded] = React.useState("Visa");
  const [File, setFile] = useState(undefined);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  useEffect(() => {
    setShowBackButton(false);
  }, []);
  useEffect(() => {
    if (pathName?.includes("edit")) {
      // get car info by name
      setLoading(true);
      let findItem = CustomersData?.find((ele) => `${ele?.id}` === params.name);
      if (findItem) {
        setInfo({
          id: findItem?.id,
          name: findItem?.name,
          email: findItem?.email,
          phoneNumber: findItem?.phoneNumber,
          image: findItem?.image,
          dateOfBirth: dayjs(findItem?.dateOfBirth),
          policyNumber: findItem?.policyNumber,
          paymentMethod: findItem?.paymentMethod,
          status: findItem?.status,
        });
      }
      setLoadingInfo(false);
      setLoading(false);
    } else {
      setLoadingInfo(false);
      setLoading(false);
    }
  }, [params.name, CustomersData]);
  // useEffect(() => {
  //   if (pathName?.includes("edit")) {
  //     // get car info by name
  //     setLoadingInfo(true);
  //     axiosInstance
  //       .get(API.customers + `/${params.name}`)
  //       .then((res) => {
  //         // console.log(res?.data?.data);
  //         if (res?.data?.success) {
  //           setInfo({
  //             id: res?.data?.data?._id,
  //             name: res?.data?.data?.name,
  //             email: res?.data?.data?.email,
  //             phone: res?.data?.data?.phoneNumber,
  //             image: res?.data?.data?.image,
  //             dateOfBirth: dayjs(res?.data?.data?.dateOfBirth),
  //             policyNumber: res?.data?.data?.policyNumber,
  //             paymentMethod: res?.data?.data?.paymentMethod,
  //             status: res?.data?.data?.status,
  //           });
  //         }
  //         setLoadingInfo(false);
  //       })
  //       .catch((err) => {});
  //   }
  // }, [pathName, params.name]);
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

  // function handleResponse(res) {
  //   // console.log("res ", res);
  //   if (res?.data?.success === true || res?.data?.customer?._id) {
  //     setLoading(false);
  //     navigate("/customers");
  //   } else {
  //     setLoading(false);
  //     setError({
  //       isError: true,
  //       errorMessage: res?.data?.error || "Some thing went wrong.",
  //       errors: res?.data?.errors?.join(", "),
  //     });
  //   }
  // }

  // "paymentMethods": [
  //   {
  //     "cardType": "Visa",  //"Visa", "MasterCard", "PayPal"
  //     "cardNumber": "4111111111111111",
  //     "expirationDate": "12/24",
  //     "cardHolder": "John Doe",
  //     "cvc": "123"
  //   }
  // ]

  const handleSave = () => {
    if (pathName?.includes("edit")) {
      let index = CustomersData?.findIndex((ele) => ele?.id === Info?.id);
      let data = CustomersData.slice();
      data[index] = {
        ...Info,
      };
      setCustomersData(data);
      navigate("/customers");
    } else {
      setCustomersData((prev) => [
        {
          ...Info,
          id: Math.random(),
        },
        ...(prev || []),
      ]);
      navigate("/customers");
    }
  };
  // const handleSave = () => {
  //   let bodyData = new FormData();
  //   bodyData.append("name", Info?.name);
  //   bodyData.append("email", Info?.email);
  //   bodyData.append("phoneNumber", Info?.phone);

  //   bodyData.append("dateOfBirth", Info?.dateOfBirth);
  //   bodyData.append("policyNumber", Info?.policyNumber);
  //   bodyData.append("paymentMethod", Info?.paymentMethod);
  //   bodyData.append("status", Info?.status);
  //   // bodyData.append("image", File);
  //   setLoading(true);
  //   setError({
  //     isError: false,
  //     errorMessage: "",
  //     errors: "",
  //   });

  //   if (pathName?.includes("edit")) {
  //     axiosInstance.put(API.customers + `/${Info.id}`, bodyData).then((res) => {
  //       handleResponse(res);
  //     });
  //   } else {
  //     axiosInstance.post(API.customers, bodyData).then((res) => {
  //       handleResponse(res);
  //     });
  //   }
  // };
  const renderMuiAccordionSummary = (label, image) => (
    <MuiAccordionSummary aria-controls="panel1d-content" id="panel1d-header">
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
        sx={{ width: "100%" }}
      >
        <Box display={"flex"} alignItems={"center"}>
          <Radio
            checked={expanded === label}
            name="radio-buttons"
            inputProps={{ "aria-label": "A" }}
          />
          <Typography>{label}</Typography>
        </Box>
        <img alt={label} src={image} />
      </Box>
    </MuiAccordionSummary>
  );
  const VisaFields = (
    <>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography
            sx={{ ...theme.field_label }}
            variant="subtitle2"
            textAlign={"left"}
          >
            Card Number
          </Typography>
          <TextField
            placeholder="Enter Card number"
            // size="small"
            fullWidth
            value={MethodInfo?.cardNumber || ""}
            onChange={(event) => {
              setMethodInfo((prev) => ({
                ...prev,
                cardNumber: event.target.value,
              }));
            }}
          />
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
            Expiation Date
          </Typography>
          <LocalizationProvider
            sx={{ "& .MuiTextField-root": { width: "100% !important" } }}
            dateAdapter={AdapterDayjs}
          >
            <DatePicker
              sx={{
                "& input": {
                  // padding: "8.5px 14px",
                  width: "100%",
                },
              }}
              size="small"
              value={MethodInfo.expirationDate}
              onChange={(newValue) =>
                setMethodInfo((prev) => ({
                  ...prev,
                  expirationDate: newValue,
                }))
              }
            />
          </LocalizationProvider>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography
            sx={{ ...theme.field_label }}
            variant="subtitle2"
            textAlign={"left"}
          >
            Card Holder
          </Typography>
          <TextField
            placeholder="Enter Card Holder"
            // size="small"
            fullWidth
            value={MethodInfo?.cardHolder || ""}
            onChange={(event) => {
              setInfo((prev) => ({
                ...prev,
                cardHolder: event.target.value,
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
            CVC
          </Typography>
          <TextField
            placeholder="CVC"
            // size="small"
            fullWidth
            value={MethodInfo?.cvc || ""}
            onChange={(event) => {
              setMethodInfo((prev) => ({
                ...prev,
                cvc: event.target.value,
              }));
            }}
          />
        </Grid>
      </Grid>
    </>
  );
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
                Customer Information
              </Typography>
              <Typography
                sx={{ ...theme.card_sub_title }}
                variant="subtitle1"
                textAlign={"left"}
              >
                Add customer onformation
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
                Phone number
              </Typography>
              <TextField
                placeholder="Enter user phone number"
                // size="small"
                fullWidth
                value={Info?.phoneNumber || ""}
                onChange={(event) => {
                  setInfo((prev) => ({
                    ...prev,
                    phoneNumber: event.target.value,
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
            <Grid
              size={{ xs: 12, sm: 6 }}
              sx={{ "& .MuiFormControl-root": { width: "100%" } }}
            >
              <Typography
                sx={{ ...theme.field_label }}
                variant="subtitle2"
                textAlign={"left"}
              >
                Date Of Birth
              </Typography>
              <LocalizationProvider
                sx={{ "& .MuiTextField-root": { width: "100% !important" } }}
                dateAdapter={AdapterDayjs}
              >
                <DatePicker
                  sx={{
                    "& input": {
                      // padding: "8.5px 14px",
                      width: "100%",
                    },
                  }}
                  // size="small"
                  value={Info.dateOfBirth}
                  onChange={(newValue) =>
                    setInfo((prev) => ({
                      ...prev,
                      dateOfBirth: newValue,
                    }))
                  }
                />
              </LocalizationProvider>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography
                sx={{ ...theme.field_label }}
                variant="subtitle2"
                textAlign={"left"}
              >
                Policy Number
              </Typography>
              <TextField
                placeholder="Enter policy number"
                // size="small"
                fullWidth
                value={Info?.policyNumber || ""}
                onChange={(event) => {
                  setInfo((prev) => ({
                    ...prev,
                    policyNumber: event.target.value,
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
                Status
              </Typography>
              <Select
                // multiple
                value={Info?.status || ""}
                onChange={(event) => {
                  setInfo((prev) => ({
                    ...prev,
                    status: event.target.value,
                  }));
                }}
                name={"status"}
                fullWidth
                // size="small"
                placeholder="Select status"
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
                Payment Method
              </Typography>
              <Select
                value={Info?.paymentMethod || ""}
                onChange={(event) => {
                  setInfo((prev) => ({
                    ...prev,
                    paymentMethod: event.target.value,
                  }));
                }}
                name={"paymentMethod"}
                fullWidth
                // size="small"
                placeholder="Select payment method"
              >
                {[
                  { label: "online", value: "online" },
                  { label: "bank transfer", value: "bank-transfer" },
                  { label: "cash on delivery", value: "cash-on-delivery" },
                ]?.map((ele) => (
                  <MenuItem key={ele.label} value={ele.value}>
                    {ele.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
        </Card>
      )}
      {/* {!LoadingInfo && (
        <Card sx={{ padding: "15px", marginTop: "10px", marginBottom: "10px" }}>
          <Grid container spacing={1}>
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <Typography
                sx={{ ...theme.card_title }}
                variant="h6"
                textAlign={"left"}
              >
                Add image
              </Typography>
              <Typography
                sx={{ ...theme.card_sub_title }}
                variant="subtitle1"
                textAlign={"left"}
              >
                Please enter customer image
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <Grid container spacing={1}>
                {Info?.image && (
                  <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                    {renderImage(Info?.image?.url, () => {
                      setInfo((prev) => ({ ...prev, image: undefined }));
                    })}
                  </Grid>
                )}
                {File && (
                  <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                    {renderImage(window.URL.createObjectURL(File), () => {
                      setFile(undefined);
                    })}
                  </Grid>
                )}
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
                        Upload customer image
                      </Typography>
                      <VisuallyHiddenInput
                        id="upload_car_id"
                        type="file"
                        onChange={(event) => {
                          // console.log(event.target.files[0]);
                          setInfo((prev) => ({ ...prev, image: undefined }));
                          setFile(event.target.files[0]);
                        }}
                      />
                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Card>
      )} */}
      {!LoadingInfo && (
        <Card sx={{ padding: "15px", marginTop: "10px", marginBottom: "10px" }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <Typography
                sx={{ ...theme.card_title }}
                variant="h6"
                textAlign={"left"}
              >
                Payment method
              </Typography>
              <Typography
                sx={{ ...theme.card_sub_title }}
                variant="subtitle1"
                textAlign={"left"}
              >
                Add payment method
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12 }}>
              <MuiAccordion
                expanded={expanded === "Visa"}
                onChange={handleChange("Visa")}
                sx={{ marginBottom: "10px", backgroundColor: "#F6F7F9" }}
              >
                {renderMuiAccordionSummary("Visa", "/images/Visa.png")}

                <MuiAccordionDetails>{VisaFields}</MuiAccordionDetails>
              </MuiAccordion>
              <MuiAccordion
                expanded={expanded === "PayPal"}
                onChange={handleChange("PayPal")}
                sx={{ marginBottom: "10px", backgroundColor: "#F6F7F9" }}
              >
                {renderMuiAccordionSummary("PayPal", "/images/PayPal.png")}

                <MuiAccordionDetails>
                  <Typography>PayPal</Typography>
                </MuiAccordionDetails>
              </MuiAccordion>
              <MuiAccordion
                expanded={expanded === "MasterCard"}
                onChange={handleChange("MasterCard")}
                sx={{ marginBottom: "10px", backgroundColor: "#F6F7F9" }}
              >
                {renderMuiAccordionSummary("MasterCard", "/images/PayPal.png")}
                <MuiAccordionDetails>
                  <Typography>MasterCard</Typography>
                </MuiAccordionDetails>
              </MuiAccordion>
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
