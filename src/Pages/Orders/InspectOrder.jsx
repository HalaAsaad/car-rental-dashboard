import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Stack,
  Typography,
  Radio,
  Button,
  Card,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
  // InputLabel,
  // OutlinedInput,
  // InputAdornment,
  // IconButton,
  // Pagination,
  // Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
// import API from "../../api";
import { AppContext } from "../../Context/AppContext";
import { addCommas, calculateDaysDifference } from "../../lib";
import {
  DeleteOutlined as DeleteOutlinedIcon,
  ExpandMore as ExpandMoreIcon,
  AccessTime as AccessTimeIcon,
  EventAvailable as EventAvailableIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { styled, useTheme } from "@mui/material/styles";
import SignatureCanvas from "react-signature-canvas";
import SaveCancelBtns from "../../Components/SaveCancelBtns";
import RemoveDialog from "../../Components/RemoveDialog";
import "./index.css";

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

function InspectOrder({ permissions }) {
  const navigate = useNavigate();
  const params = useParams();
  const theme = useTheme();
  const location = useLocation();
  let pathName = window.location.pathname;
  console.log(location.state);
  let refSign;
  //   const [trimmedDataURL, settrimmedDataURL] = useState(null);
  const [IsDrawing, setIsDrawing] = useState(false);
  const { setShowBackButton } = useContext(AppContext);
  const [SelectedCars, setSelectedCars] = useState({});

  const [OpenImagesDialog, setOpenImagesDialog] = useState(false);
  const [SelectedImagesSide, setSelectedImagesSide] = useState({
    id: undefined,
    side: undefined, // front, driverFront ,passengerFront, driverRear, passengerRear, rear
    mainImageIndex: 0,
  });
  const [Order, setOrder] = useState({
    _id: undefined,
    CustomerData: {
      name: "",
      phoneNumber: "",
      email: "",
      dateOfBirth: "",
      policyNumber: "",
      paymentMethod: "",
      status: "",
      orders: [],
      _id: "",
    },
    policyNumber: undefined,
    idPhotoUrl: undefined, // { url, public_id }
    insurancePolicyUrl: undefined, // { url, public_id }
    method: [], //["Visa","Cash"] //  ["Visa", "E-Transfer", "Cash"]
    reminder: undefined, // ["Weekly", "Biweekly", "Monthly"],
    discountType: undefined, // ["percentage", "fixed_amount"],
    discountValue: undefined,
    subtotal: undefined,
    discount_before_apply: undefined,
    discount: undefined,
    totalPrice: undefined,
    notes: undefined,
    signatureUrl: undefined, // { url, public_id }
  });
  const [LoadingUpload, setLoadingUpload] = useState(false);
  const [LoadingDeleteImage, setLoadingDeleteImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [LoadingInfo, setLoadingInfo] = useState(false);
  const [IsView, setIsView] = useState(false);
  const [Error, setError] = useState({
    isError: false,
    errorMessage: "",
    errors: "",
  });
  const [OpenRemove, setOpenRemove] = useState(false);

  useEffect(() => {
    setShowBackButton(true);
  }, []);
  useEffect(() => {
    if (pathName?.includes("view")) {
      setIsView(true);
      // get info by name
      setLoadingInfo(true);
      setSelectedCars({});
      axiosInstance.get(`/orders/${params.name}`).then((res) => {
        // console.log("get order ", res?.data?.data);
        if (res?.data?.data) {
          const data = res?.data?.data;
          setOrder({
            _id: data?._id,
            CustomerData: {
              name: data?.customer?.name,
              phoneNumber: data?.customer?.phoneNumber,
              email: data?.customer?.email,
              _id: data?.customer?._id,
              // dateOfBirth: "",
              // policyNumber: "",
              // paymentMethod: "",
              // status: "",
              // orders: [],
            },
            policyNumber: data?.additionalInfo?.policyNumber,
            idPhotoUrl: data?.additionalInfo?.idPhotoUrl, // { url, public_id }
            insurancePolicyUrl: data?.insurancePolicyUrl, // { url, public_id }
            method: data?.payment?.method, //  ["Visa", "E-Transfer", "Cash"]
            reminder: data?.payment?.reminder, // ["Weekly", "Biweekly", "Monthly"],
            discountType: data?.rentalSummary?.discountType, // ["percentage", "fixed_amount"],
            discountValue: data?.rentalSummary?.discountValue,
            subtotal: data?.rentalSummary?.subtotal,
            discount: data?.rentalSummary?.discount,
            totalPrice: data?.rentalSummary?.totalPrice,
            notes: data?.confirmation?.notes,
            signatureUrl: {
              url: data?.confirmation?.signatureUrl?.url,
              public_id: data?.confirmation?.signatureUrl?.public_id,
            }, // { url, public_id }
            cars: [],
          });
          data?.cars?.forEach((element) => {
            setSelectedCars((prev) => ({
              ...prev,
              [element?._id]: {
                _id: element?._id,
                carId: element?.carId?.carId,
                brand: element?.carId?.brand,
                model: element?.carId?.model,
                color: element?.carId?.color,
                carImages: {
                  front: element?.carImages?.front, // [{ url , public_id }]
                  driverFront: element?.carImages?.driverFront,
                  passengerFront: element?.carImages?.passengerFront,
                  driverRear: element?.carImages?.driverRear,
                  passengerRear: element?.carImages?.passengerRear,
                  rear: element?.carImages?.rear,
                },
                pickupDateTime: element?.pickupDateTime
                  ? new Date(element?.pickupDateTime).toISOString()
                  : undefined,
                returnDateTime: element?.returnDateTime
                  ? new Date(element?.returnDateTime).toISOString()
                  : undefined,
                rentingPeriod: element?.rentingPeriod,
                totalPrice: element?.totalPrice || 0,
                // pickupInfo: {
                //   pickupDate: element?.pickupDateTime
                //     ? new Date(element?.pickupDateTime).toISOString()
                //     : undefined,
                //   pickupTime: element?.pickupDateTime
                //     ? element?.pickupDateTime
                //     : undefined,
                // },
                // returnInfo: {
                //   returnDate: element?.returnDateTime
                //     ? new Date(element?.returnDateTime).toISOString()
                //     : undefined,
                //   returnTime: element?.returnDateTime
                //     ? element?.returnDateTime
                //     : undefined,
                // },
              },
            }));
          });
        }
        setLoadingInfo(false);
      });
    } else {
      setIsView(false);
      setLoadingInfo(false);
    }
  }, [pathName, params.name]);
  useEffect(() => {
    if (location?.state?.SelectedCars?.length > 0) {
      location?.state?.SelectedCars?.forEach((element) => {
        setSelectedCars((prev) => ({
          ...prev,
          [element?._id]: {
            _id: element?._id,
            carId: element?.carId,
            brand: element?.brand,
            model: element?.model,
            color: element?.color,
            carImages: {
              front: element?.carImages?.front, // [{ url, public_id }]
              driverFront: element?.carImages?.driverFront,
              passengerFront: element?.carImages?.passengerFront,
              driverRear: element?.carImages?.driverRear,
              passengerRear: element?.carImages?.passengerRear,
              rear: element?.carImages?.rear,
            },
            pickupDateTime:
              location?.state?.VehiclesDates[element?._id]?.length > 0
                ? new Date(
                    location?.state?.VehiclesDates[element?._id][0]
                  ).toISOString()
                : undefined,
            returnDateTime:
              location?.state?.VehiclesDates[element?._id]?.length > 1
                ? new Date(
                    location?.state?.VehiclesDates[element?._id][1]
                  ).toISOString()
                : undefined,
            rentingPeriod:
              location?.state?.VehiclesDates[element?._id]?.length > 0
                ? calculateDaysDifference(
                    location?.state?.VehiclesDates[element?._id][0],
                    location?.state?.VehiclesDates[element?._id][1]
                  ) + " Days"
                : "_ Days",
            totalPrice:
              location?.state?.VehiclesDates[element?._id]?.length > 0
                ? element?.rentalPrice *
                  calculateDaysDifference(
                    location?.state?.VehiclesDates[element?._id][0],
                    location?.state?.VehiclesDates[element?._id][1]
                  )
                : 0,

            // pickupInfo: {
            //   pickupDate:
            //     location?.state?.VehiclesDates[element?._id]?.length > 0
            //       ? new Date(
            //           location?.state?.VehiclesDates[element?._id][0]
            //         ).toISOString()
            //       : undefined,
            //   pickupTime:
            //     location?.state?.VehiclesDates[element?._id]?.length > 0
            //       ? new Date(
            //           location?.state?.VehiclesDates[element?._id][0]
            //         ).toLocaleTimeString()
            //       : undefined,
            // },
            // returnInfo: {
            //   returnDate:
            //     location?.state?.VehiclesDates[element?._id]?.length > 1
            //       ? new Date(
            //           location?.state?.VehiclesDates[element?._id][1]
            //         ).toISOString()
            //       : undefined,
            //   returnTime:
            //     location?.state?.VehiclesDates[element?._id]?.length > 1
            //       ? new Date(
            //           location?.state?.VehiclesDates[element?._id][1]
            //         ).toLocaleTimeString()
            //       : undefined,
            // },
          },
        }));
      });
    }
    if (location?.state?.CustomerData?._id) {
      setOrder((prev) => ({
        ...prev,
        CustomerData: location?.state?.CustomerData,
      }));
    }
  }, [
    location?.state?.SelectedCars,
    location?.state?.VehiclesDates,
    location?.state?.CustomerData,
  ]);
  useEffect(() => {
    if (Object.values(SelectedCars)?.length > 0) {
      let subtotal = Object.values(SelectedCars)?.reduce(
        (accumulator, item) => {
          return (accumulator += item.totalPrice);
        },
        0
      );
      setOrder((prev) => ({
        ...prev,
        subtotal: subtotal || 0,
        totalPrice: subtotal || 0,
      }));
    } else {
      setOrder((prev) => ({
        ...prev,
        subtotal: 0,
        totalPrice: 0,
      }));
    }
  }, [SelectedCars]);

  console.log("SelectedCars ", SelectedCars);
  console.log("Order ", Order);

  const handleSignature = (signature) => {
    // console.log("signature ", signature);
  };
  const clear = () => {
    refSign?.clear();
    setIsDrawing(false);
    // settrimmedDataURL(null);
  };
  const trim = () => {
    // console.log("refSign ", refSign);
    // console.log("getCanvas ", refSign.getCanvas());
    // console.log("getSignaturePad ", refSign.getSignaturePad());

    let canvas = refSign.getCanvas(); //refSign?.getTrimmedCanvas(); //refSign.getCanvas();

    canvas.toBlob((blob) => {
      let file = new File([blob], "fileName.jpg", { type: "image/jpeg" });
      uploadFiles([file], (images) => {
        setOrder((prev) => ({
          ...prev,
          signatureUrl: images?.length > 0 ? images[0] : undefined,
        }));
      });
    }, "image/jpeg");

    // let data = canvas.toDataURL("image/jpeg");
    // let img = document.createElement("img");
    // img.src = data;
    // let a = document.createElement("a");
    // a.setAttribute("download", "Signature.jpeg");
    // console.log("data ", data);
    // a.setAttribute("href", data);
    // a.appendChild(img);
    // a.click();
    // // document.body.removeChild(a);

    // settrimmedDataURL(refSign?.getTrimmedCanvas().toDataURL("image/png"));
  };

  function uploadFiles(files, handelResponse) {
    // console.log("files ", files);
    setLoadingUpload(true);
    let bodyData = new FormData();
    files?.forEach((f) => {
      bodyData.append("images", f);
    });
    setError({
      isError: false,
      errorMessage: "",
      errors: "",
    });
    axiosInstance.post("/media/upload-images", bodyData).then((res) => {
      // console.log("res ", res);
      if (res?.data?.error) {
        setError({
          isError: true,
          errorMessage: res?.data?.error || "Some thing went wrong.",
          errors: res?.data?.errors
            ? res?.data?.errors?.join(", ")
            : "" + " " + res?.data?.details
            ? res?.data?.details?.result
            : "",
        });
      } else if (res?.data?.images?.length > 0) {
        handelResponse(
          res?.data?.images?.map((ele) => ({
            ...ele,
            url: ele?.imageUrl,
            public_id: ele?.publicId,
          }))
        );
      }
      setLoadingUpload(false);
    });
  }
  function deleteImage(publicId, handelResponse) {
    setLoadingDeleteImage(true);
    axiosInstance
      .post("/media/delete-image", {
        publicId: publicId,
      })
      .then((res) => {
        if (res?.data?.message?.includes("success")) {
          handelResponse();
        }
        setLoadingDeleteImage(false);
      });
  }

  const renderCardTitles = (title, subTitle) => {
    return (
      <Grid size={{ xs: 12, sm: 12, md: 12 }}>
        <Typography
          sx={{ ...theme.card_title }}
          variant="h6"
          fontWeight={"700"}
          textAlign={"left"}
        >
          {title}
        </Typography>
        <Typography
          sx={{ ...theme.card_sub_title }}
          variant="subtitle1"
          textAlign={"left"}
        >
          {subTitle}
        </Typography>
      </Grid>
    );
  };
  const renderInfoField = (label, value, icon) => {
    return (
      <Stack direction={"column"} spacing={1}>
        <Typography
          sx={{ ...theme.field_label }}
          variant="subtitle2"
          textAlign={"left"}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            backgroundColor: "#F6F7F9",
            color: "#90A3BF",
            textAlign: "left",
            padding: "10px 10px",
            borderRadius: "8px",
            height: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: "Montserrat",
          }}
          variant="body2"
        >
          {value || ""}
          {icon && icon}
        </Typography>
      </Stack>
    );
  };
  const renderImage = (url, onClick, style, children) => {
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
          ...(style || {}),
        }}
      >
        {LoadingDeleteImage ? (
          <CircularProgress sx={{ marginLeft: "75%", marginTop: "20px" }} />
        ) : (
          <>
            {url && (
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
            )}
          </>
        )}
        {children && children}
      </div>
    );
  };
  const CustomerInformation = (
    <Card sx={{ padding: "15px" }}>
      <Grid container spacing={2}>
        {renderCardTitles(
          "Customer Information",
          "Customer information added automatically"
        )}
        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
          {renderInfoField("Name", Order?.CustomerData?.name || "")}
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
          {renderInfoField("Email address", Order?.CustomerData?.email || "")}
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
          {renderInfoField(
            "Phone number",
            Order?.CustomerData?.phoneNumber || ""
          )}
        </Grid>
      </Grid>
    </Card>
  );
  const AdditionalInfo = (
    <Card sx={{ padding: "15px" }}>
      <Grid container spacing={2}>
        {renderCardTitles("Additional info", "Please add Additional info")}
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
            value={Order?.policyNumber || ""}
            onChange={(event) => {
              setOrder((prev) => ({
                ...prev,
                policyNumber: event.target.value,
              }));
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }} />
        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
          {Order?.idPhotoUrl ? (
            <>
              {renderImage(Order?.idPhotoUrl?.url, () => {
                deleteImage(Order?.idPhotoUrl?.publicId, () => {
                  setOrder((prev) => ({
                    ...prev,
                    idPhotoUrl: undefined,
                  }));
                });
              })}
            </>
          ) : (
            <Box
              sx={{
                border: "1px dashed #DEDEDE",
                height: "286px",
                borderRadius: "13px",
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Stack
                direction={"column"}
                alignItems={"center"}
                justifyContent={"center"}
                sx={{ flexGrow: 1 }}
              >
                {LoadingUpload ? (
                  <CircularProgress />
                ) : (
                  <img
                    style={{ width: "52px", cursor: "pointer" }}
                    alt={"upload"}
                    src="/images/upload.png"
                    onClick={() => {
                      document.getElementById("upload_ID_photo").click();
                    }}
                  />
                )}
                <Typography
                  sx={{ color: "#808080" }}
                  variant="subtitle1"
                  textAlign={"left"}
                >
                  Upload ID photo image
                </Typography>
                <VisuallyHiddenInput
                  id="upload_ID_photo"
                  type="file"
                  onChange={(event) => {
                    //  console.log(event.target.files[0]);
                    uploadFiles(Object.values(event.target.files), (images) => {
                      setOrder((prev) => ({
                        ...prev,
                        idPhotoUrl: images?.length > 0 ? images[0] : undefined,
                      }));
                    });
                  }}
                />
              </Stack>
            </Box>
          )}
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
          {Order?.insurancePolicyUrl ? (
            <>
              {renderImage(Order?.insurancePolicyUrl?.url, () => {
                deleteImage(Order?.insurancePolicyUrl?.publicId, () => {
                  setOrder((prev) => ({
                    ...prev,
                    insurancePolicyUrl: undefined,
                  }));
                });
              })}
            </>
          ) : (
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
                {LoadingUpload ? (
                  <CircularProgress />
                ) : (
                  <img
                    style={{ width: "52px", cursor: "pointer" }}
                    alt={"upload"}
                    src="/images/upload.png"
                    onClick={() => {
                      document.getElementById("insurance_policy_photo").click();
                    }}
                  />
                )}
                <Typography
                  sx={{ color: "#808080" }}
                  variant="subtitle1"
                  textAlign={"left"}
                >
                  Upload insurance policy image
                </Typography>
                <VisuallyHiddenInput
                  id="insurance_policy_photo"
                  type="file"
                  onChange={(event) => {
                    //  console.log(event.target.files[0]);
                    uploadFiles(Object.values(event.target.files), (images) => {
                      setOrder((prev) => ({
                        ...prev,
                        insurancePolicyUrl:
                          images?.length > 0 ? images[0] : undefined,
                      }));
                    });
                  }}
                />
              </Stack>
            </Box>
          )}
        </Grid>
      </Grid>
    </Card>
  );
  const PaymentMethodSection = (
    <Card sx={{ padding: "15px" }}>
      <Grid container spacing={2}>
        {renderCardTitles("Payment method", "Please enter your payment method")}
        {[
          { label: "Visa", value: "Visa" },
          //{ label: "E-Transfer", value: "E-Transfer" },
          { label: "Cash", value: "Cash" },
        ].map((ele, i) => (
          <Grid key={i} size={{ xs: 12, sm: 12, md: 12 }}>
            <Stack
              direction={"row"}
              alignItems={"center"}
              sx={{
                backgroundColor: "#F6F7F9",
                textAlign: "left",
                padding: "10px 10px",
                borderRadius: "8px",
                height: "40px",
              }}
            >
              <Radio
                checked={Order?.method?.includes(ele?.value)}
                onClick={() => {
                  setOrder((prev) => ({
                    ...prev,
                    method: Order?.method?.includes(ele?.value)
                      ? (prev.method || [])?.filter((val) => val !== ele?.value)
                      : [...(prev.method || []), ele.value],
                  }));
                }}
                value={ele.value}
                name="radio-buttons"
                inputProps={{ "aria-label": ele?.label }}
              />
              <Typography
                variant="67"
                sx={{ ...theme.field_label, marginBottom: "0px" }}
              >
                {ele.label}
              </Typography>
            </Stack>
          </Grid>
        ))}
        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
          <Typography
            sx={{ color: "#191919", fontWeight: 600 }}
            variant="h6"
            textAlign={"left"}
          >
            Payment reminder
          </Typography>
        </Grid>
        {[
          { label: "Weekly", value: "Weekly" },
          { label: "Biweekly", value: "Biweekly" },
          { label: "Monthly", value: "Monthly" },
        ].map((ele, i) => (
          <Grid key={i} size={{ xs: 12, sm: 12, md: 4 }}>
            <Stack direction={"row"} alignItems={"center"}>
              <Radio
                value={ele.value}
                checked={Order?.reminder === ele?.value}
                onChange={(event) => {
                  setOrder((prev) => ({
                    ...prev,
                    reminder: event.target.value,
                  }));
                }}
                name="radio-buttons"
                inputProps={{ "aria-label": ele?.label }}
              />
              <Typography
                sx={{ ...theme.field_label, marginBottom: "0px" }}
                variant="subtitle2"
              >
                {ele.label}
              </Typography>
            </Stack>
          </Grid>
        ))}
      </Grid>
    </Card>
  );
  function onClickSideButton(Id, side) {
    setSelectedImagesSide({
      id: Id,
      side: side,
      mainImageIndex: 0,
    });
    setOpenImagesDialog(true);
  }
  function onCloseImagesDialog() {
    setSelectedImagesSide({
      carId: undefined,
      side: undefined,
      mainImageIndex: 0,
    });
    setOpenImagesDialog(false);
  }
  const SelectedCarsSection = (
    <Grid container spacing={2}>
      {Object.values(SelectedCars)?.map((car, i) => (
        <Grid key={i} size={{ xs: 12, sm: 12, md: 12 }}>
          <Accordion sx={{ marginBottom: "10px", padding: "15px 10px" }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon color="secondary" />}
              aria-controls="panel3-content"
              id="panel3-header"
            >
              <Stack direction={"row"} alignItems={"center"}>
                <Typography variant="h6" fontWeight={"700"}>
                  {car?.brand + " " + car?.model}
                </Typography>

                <DeleteOutlinedIcon
                  sx={{ fontSize: "24px", marginLeft: "20px" }}
                  color="secondary"
                  onClick={() => {
                    console.log("delete car ", car?._id);
                    let cars = { ...SelectedCars };
                    delete cars[car?._id];
                    setSelectedCars(cars);
                  }}
                />
              </Stack>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: "5 15px" }}>
              <Grid container spacing={2}>
                {renderCardTitles(
                  "Car Information",
                  "Car information added automatically"
                )}
                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  {renderInfoField("Brand", car?.brand || "")}
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  {renderInfoField("Model", car?.model || "")}
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  {renderInfoField("Color", car?.color || "")}
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  {renderInfoField("Car ID", car?.carId || "")}
                </Grid>
                {renderCardTitles(
                  "Pick-up & Return info",
                  "Please add Pick-up & Return info"
                )}
                <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                  <Stack direction={"row"} alignItems={"center"}>
                    <Radio
                      color="secondary"
                      checked={true}
                      name="radio-buttons"
                      inputProps={{ "aria-label": "Pick - Up" }}
                    />
                    <Typography variant="h7" fontWeight={"700"}>
                      Pick - Up
                    </Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  {renderInfoField(
                    "Pick - Up Date",
                    car?.pickupDateTime
                      ? new Date(car?.pickupDateTime).toLocaleDateString()
                      : "MM/DD/YYYY",
                    <EventAvailableIcon />
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  {renderInfoField(
                    "Pick - Up time",
                    car?.pickupDateTime
                      ? new Date(car?.pickupDateTime).toLocaleTimeString()
                      : "--:--:--",
                    <AccessTimeIcon />
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                  <Stack direction={"row"} alignItems={"center"}>
                    <Radio
                      checked={true}
                      name="radio-buttons"
                      inputProps={{ "aria-label": "Pick - Up" }}
                    />
                    <Typography variant="h7" fontWeight={"700"}>
                      Return
                    </Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  {renderInfoField(
                    "Return Date",
                    car?.returnDateTime
                      ? new Date(car?.returnDateTime).toLocaleDateString()
                      : "MM/DD/YYYY",
                    <EventAvailableIcon />
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  {renderInfoField(
                    "Return time",
                    car?.returnDateTime
                      ? new Date(car?.returnDateTime).toLocaleTimeString()
                      : "--:--:--",
                    <AccessTimeIcon />
                  )}
                </Grid>

                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  {renderInfoField("Renting period", car?.rentingPeriod)}
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                  {renderInfoField("Total price", car?.totalPrice + " $")}
                </Grid>
                {/** images */}
                {/** rear */}
                <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                  <Stack direction={"column"} alignItems={"center"}>
                    <Typography
                      fontWeight={"700"}
                      variant="h6"
                      textAlign={"center"}
                    >
                      Rear
                    </Typography>
                    <AddCircleOutlineIcon
                      sx={{ cursor: "pointer" }}
                      fontSize="large"
                      color="secondary"
                      onClick={() => onClickSideButton(car?._id, "rear")}
                    />
                  </Stack>
                </Grid>
                {/** middle */}
                <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                  <Stack direction={"row"}>
                    <Box
                      flexDirection={"column"}
                      justifyContent={"space-around"}
                      display={"flex"}
                      alignItems={"center"}
                      flexGrow={1}
                    >
                      {[
                        { side: "driverRear", label: "Driver rear" },
                        { side: "driverFront", label: "Driver front" },
                      ].map((ele, i) => (
                        <Stack
                          key={i}
                          direction={"column"}
                          alignItems={"center"}
                        >
                          <AddCircleOutlineIcon
                            sx={{ cursor: "pointer" }}
                            fontSize="large"
                            color="secondary"
                            onClick={() =>
                              onClickSideButton(car?._id, ele?.side)
                            }
                          />
                          <Typography
                            fontWeight={"700"}
                            variant="h6"
                            textAlign={"center"}
                          >
                            {ele?.label}
                          </Typography>
                        </Stack>
                      ))}
                    </Box>
                    <img alt="inspect" src="/images/inspect_car.png" />

                    <Box
                      flexDirection={"column"}
                      justifyContent={"space-around"}
                      display={"flex"}
                      alignItems={"center"}
                      flexGrow={1}
                    >
                      {[
                        { side: "passengerRear", label: "Pass rear" },
                        { side: "passengerFront", label: "Pass front" },
                      ].map((ele, i) => (
                        <Stack
                          key={i}
                          direction={"column"}
                          alignItems={"center"}
                        >
                          <AddCircleOutlineIcon
                            sx={{ cursor: "pointer" }}
                            fontSize="large"
                            color="secondary"
                            onClick={() =>
                              onClickSideButton(car?._id, ele?.side)
                            }
                          />
                          <Typography
                            fontWeight={"700"}
                            variant="h6"
                            textAlign={"center"}
                          >
                            {ele?.label}
                          </Typography>
                        </Stack>
                      ))}
                    </Box>
                  </Stack>
                </Grid>
                {/** front */}
                <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                  <Stack direction={"column"} alignItems={"center"}>
                    <AddCircleOutlineIcon
                      sx={{ cursor: "pointer" }}
                      fontSize="large"
                      color="secondary"
                      onClick={() => onClickSideButton(car?._id, "front")}
                    />
                    <Typography
                      fontWeight={"700"}
                      variant="h6"
                      textAlign={"center"}
                    >
                      Front
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
      ))}
    </Grid>
  );
  const RentalSummarySection = (
    <Card sx={{ padding: "15px" }}>
      <Grid container spacing={2}>
        {renderCardTitles(
          "Rental Summary",
          "Prices may change depending on the length of the rental and the price of your rental car."
        )}
        <Grid
          size={{ xs: 12, sm: 12, md: 12 }}
          sx={{ backgroundColor: "#FFF8F8" }}
          p={1}
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 12, md: 3 }}>
              <Stack direction={"column"} spacing={1}>
                <Typography
                  sx={{ ...theme.field_label }}
                  variant="subtitle2"
                  textAlign={"left"}
                >
                  Discount type
                </Typography>
                <FormControl size="small" fullWidth>
                  <Select
                    inputProps={{ "aria-label": "Without label" }}
                    displayEmpty
                    value={Order?.discountType || ""}
                    onChange={(e) => {
                      setOrder((prev) => ({
                        ...prev,
                        discountType: e.target.value,
                      }));
                    }}
                    placeholder={"Enter discount type"}
                    sx={{ minWidth: "100px" }}
                    // input={<OutlinedInput label={"Enter discount type.."} />}
                  >
                    {[
                      { label: "Percentage", value: "percentage" },
                      { label: "Fixed Amount", value: "fixed_amount" },
                    ]?.map((ele, i) => (
                      <MenuItem key={i} value={ele.value}>
                        {ele.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <Stack direction={"column"} spacing={1}>
                <Typography
                  sx={{ ...theme.field_label }}
                  variant="subtitle2"
                  textAlign={"left"}
                >
                  Discount value
                </Typography>
                <TextField
                  placeholder="Enter discount value"
                  size="small"
                  type="number"
                  fullWidth
                  value={Order?.discount_before_apply}
                  onChange={(e) => {
                    setOrder((prev) => ({
                      ...prev,
                      discount_before_apply: e.target.value,
                    }));
                  }}
                />
              </Stack>
            </Grid>
            <Grid
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                flexDirection: "column",
              }}
              size={{ xs: 12, sm: 12, md: 3 }}
            >
              <Button
                size="large"
                fullWidth
                color="secondary"
                variant="contained"
                sx={{ textTransform: "capitalize" }}
                onClick={() => {
                  // let subtotal = Object.values(SelectedCars)?.reduce(
                  //   (accumulator, item) => {
                  //     return (accumulator += item.totalPrice);
                  //   },
                  //   0
                  // );
                  let discountValue = Order?.discount_before_apply || 0;
                  let subtotal = Order.subtotal;
                  let discount =
                    Order?.discountType === "percentage"
                      ? subtotal * ((discountValue || 0) / 100)
                      : Order?.discountType === "fixed_amount"
                      ? discountValue || 0
                      : 0;
                  setOrder((prev) => ({
                    ...prev,
                    discountValue: discountValue,
                    subtotal: subtotal,
                    discount: discount,
                    totalPrice: subtotal - discount,
                  }));
                }}
              >
                Apply
              </Button>
            </Grid>
            {[
              { label: "Subtotal", value: Order.subtotal },
              {
                label: "Discount",
                subLabel:
                  Order?.discountType === "percentage"
                    ? ` ${Order.discountValue || ""}%`
                    : "",
                value: Order?.discount,
              },
              { label: "Total price", value: Order.totalPrice },
            ].map((ele, i) => (
              <Grid pt={1} pb={1} key={i} size={{ xs: 12, sm: 12, md: 12 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Stack direction={"row"} alignItems={"center"}>
                    <Typography
                      fontWeight={"500"}
                      fontFamily={"Montserrat"}
                      variant="h5"
                      color="secondary"
                    >
                      {ele?.label}
                    </Typography>
                    {ele?.subLabel && (
                      <Typography
                        variant="h5"
                        fontWeight={"500"}
                        fontFamily={"Montserrat"}
                      >
                        &nbsp; {ele?.subLabel}
                      </Typography>
                    )}
                  </Stack>
                  <Typography
                    fontWeight={"700"}
                    fontFamily={"Montserrat"}
                    variant="h5"
                  >
                    ${addCommas(ele?.value)}
                  </Typography>
                </Box>
                <Divider />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
  const ConfirmationSections = (
    <Card sx={{ padding: "15px" }}>
      <Grid container spacing={2}>
        {renderCardTitles(
          "Confirmation",
          "We are getting to the end. Just few clicks and your rental is ready!"
        )}
        <Grid size={{ xs: 12, sm: 12 }}>
          <Typography
            sx={{ ...theme.field_label }}
            variant="subtitle2"
            textAlign={"left"}
          >
            Notes
          </Typography>
          <TextField
            placeholder="Enter notes"
            // size="small"
            fullWidth
            multiline
            // maxRows={4}
            value={Order?.notes || ""}
            onChange={(event) => {
              setOrder((prev) => ({
                ...prev,
                notes: event.target.value,
              }));
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
          <Stack direction={"row"} alignItems={"center"}>
            <Radio
              color="secondary"
              checked={true}
              name="radio-buttons"
              inputProps={{ "aria-label": "signature" }}
            />
            <Typography variant="h7" fontWeight={"700"}>
              signature
            </Typography>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
          {Order?.signatureUrl?.url ? (
            <>
              {renderImage(Order?.signatureUrl?.url, () => {
                deleteImage(Order?.signatureUrl?.public_id, () => {
                  setOrder((prev) => ({
                    ...prev,
                    signatureUrl: undefined,
                  }));
                });
              })}
            </>
          ) : (
            <Box
              sx={{
                border: "1px dashed #DEDEDE",
                height: "286px",
                borderRadius: "13px",
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                width: "100%",
                // justifyContent: "center",
              }}
            >
              <SignatureCanvas
                penColor="green"
                //   className="sigCanvas"
                canvasProps={{
                  // width: "100%",
                  // height: "100%",
                  className: "sigCanvas",
                }}
                onEnd={handleSignature}
                ref={(ref) => {
                  refSign = ref;
                }}
                //   onEnd={(event) => {
                //     console.log(event.target);
                //     const image = new Image(
                //       event.target.width,
                //       event.target.height,
                //       event.target
                //     );
                //     console.log("onEnd ", image);
                //   }}
              />
            </Box>
          )}
        </Grid>
        <Grid size={{ xs: 12, sm: 12 }}>
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="flex-start"
            spacing={2}
          >
            <Button
              sx={{ textTransform: "none" }}
              color="error"
              variant="text"
              onClick={clear}
            >
              Clear
            </Button>
            <Button
              sx={{ textTransform: "none" }}
              variant="text"
              disabled={LoadingUpload}
              onClick={trim}
            >
              {LoadingUpload ? <CircularProgress /> : "Upload"}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
  function handleResponse(res) {
    // console.log("res ", res);
    if (res?.data?.success === true || res?.data?.order?._id) {
      setLoading(false);
      navigate("/orders");
    } else {
      setLoading(false);
      setError({
        isError: true,
        errorMessage: res?.data?.error || "Some thing went wrong.",
        errors: res?.data?.errors?.join(", "),
      });
    }
  }
  const handleSaveOrder = () => {
    const requestBody = {
      customer: Order?.CustomerData?._id,
      state: "pending",
      additionalInfo: {
        policyNumber: Order?.policyNumber,
        idPhotoUrl: Order?.idPhotoUrl,
        insurancePolicyUrl: Order?.insurancePolicyUrl,
      },
      payment: {
        method: Order?.method,
        reminder: Order?.reminder,
      },
      cars: Object.values(SelectedCars)?.map((car) => ({
        carId: car?._id,
        pickupDateTime: car?.pickupDateTime,
        returnDateTime: car?.returnDateTime,
        // pickupInfo: {
        //   pickupDate: car?.pickupInfo?.pickupDate,
        //   pickupTime: car?.pickupInfo?.pickupTime,
        // },
        // returnInfo: {
        //   returnDate: car?.returnInfo?.returnDate,
        //   returnTime: car?.returnInfo?.returnTime,
        // },
        rentingPeriod: car?.rentingPeriod,
        totalPrice: car?.totalPrice,
        carImages: {
          front: car?.carImages?.front,
          driverFront: car?.carImages?.driverFront,
          passengerFront: car?.carImages?.passengerFront,
          driverRear: car?.carImages?.driverRear,
          passengerRear: car?.carImages?.passengerRear,
          rear: car?.carImages?.rear,
        },
      })),
      rentalSummary: {
        discountType: Order?.discountType,
        discountValue: Order?.discountValue,
        subtotal: Order?.subtotal,
        discount: Order?.discount,
        totalPrice: Order?.totalPrice,
      },
      confirmation: {
        notes: Order?.notes,
        signatureUrl: Order?.signatureUrl || undefined,
      },
    };
    setLoading(true);
    setError({
      isError: false,
      errorMessage: "",
      errors: "",
    });

    if (pathName?.includes("view")) {
      axiosInstance
        .put("/orders" + `/${Order._id}`, requestBody)
        .then((res) => {
          handleResponse(res);
        });
    } else {
      axiosInstance.post("/orders/create", requestBody).then((res) => {
        handleResponse(res);
      });
    }
  };
  return (
    <>
      {LoadingInfo ? (
        <Grid container spacing={2} pt={3} mb={2} pb={10}>
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            <CircularProgress />
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={2} mb={2} pb={10}>
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>{CustomerInformation}</Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>{AdditionalInfo}</Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>{PaymentMethodSection}</Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>{SelectedCarsSection}</Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>{RentalSummarySection}</Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>{ConfirmationSections}</Grid>

          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            <SaveCancelBtns
              cancelLabel={IsView ? "Delete" : "Cancel"}
              handleCancel={() => {
                if (IsView) {
                  setOpenRemove(true);
                } else {
                  navigate(-1);
                }
              }}
              handleSave={handleSaveOrder}
              loading={loading}
              disabledSave={
                !Order?.CustomerData?._id ||
                !Order?.signatureUrl ||
                !Order?.totalPrice ||
                Order?.method === 0 ||
                !Order?.reminder
              }
              hideCancel={IsView && !permissions?.orders?.delete}
              hideSave={IsView && !permissions?.orders?.edit}
            />
          </Grid>
        </Grid>
      )}

      {/**  Add car image */}
      <Dialog
        open={OpenImagesDialog}
        onClose={onCloseImagesDialog}
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
          {SelectedImagesSide?.side} car images
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{ textTransform: "capitalize", ...theme.card_sub_title }}
          >
            You can view {SelectedImagesSide?.side} car images
          </DialogContentText>
          {renderImage(
            SelectedCars[SelectedImagesSide?.id]?.carImages[
              SelectedImagesSide?.side
            ]?.length > 0
              ? SelectedCars[SelectedImagesSide?.id]?.carImages[
                  SelectedImagesSide?.side
                ][SelectedImagesSide?.mainImageIndex]?.url
              : "",
            () => {
              if (
                SelectedCars[SelectedImagesSide?.id]?.carImages[
                  SelectedImagesSide?.side
                ]?.length > 0
              ) {
                deleteImage(
                  SelectedCars[SelectedImagesSide?.id]?.carImages[
                    SelectedImagesSide?.side
                  ][SelectedImagesSide?.mainImageIndex]?.publicId,
                  () => {
                    let cars = { ...SelectedCars };
                    cars[SelectedImagesSide?.id] = {
                      ...cars[SelectedImagesSide?.id],
                      carImages: {
                        ...cars[SelectedImagesSide?.id]?.carImages,
                        [SelectedImagesSide.side]: cars[
                          SelectedImagesSide?.id
                        ]?.carImages[SelectedImagesSide?.side]?.filter(
                          (ele) =>
                            ele?.publicId !==
                            SelectedCars[SelectedImagesSide?.id]?.carImages[
                              SelectedImagesSide?.side
                            ][SelectedImagesSide?.mainImageIndex]?.publicId
                        ),
                      },
                    };
                    setSelectedCars(cars);
                  }
                );
              }
            },
            {
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "flex-end",
              flexDirection: "column",
            },
            <Stack
              direction={"row"}
              sx={{ width: "100%", padding: "5px" }}
              container
              spacing={2}
            >
              {SelectedCars[SelectedImagesSide?.id]?.carImages[
                SelectedImagesSide?.side
              ]?.map((ele, i) => (
                <div
                  key={i}
                  className="oneImage"
                  style={{
                    height: "127px",
                    width: "127px",
                    backgroundImage: `url(${ele?.url})`,
                    // backgroundImage: `url('/images/car.jpeg')`,
                    // opacity: selectedImage !== img && "0.5",
                    position: "relative",
                    border:
                      i === SelectedImagesSide?.mainImageIndex
                        ? "4px solid #EF0A0A"
                        : "4px solid #D9D9D9",
                  }}
                  onClick={() => {
                    setSelectedImagesSide((prev) => ({
                      ...prev,
                      mainImageIndex: i,
                    }));
                  }}
                >
                  <Box
                    sx={{
                      borderRadius: "50%",
                      width: "26px",
                      height: "26px",
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
                    onClick={() => {
                      deleteImage(ele?.publicId, () => {
                        let cars = { ...SelectedCars };
                        cars[SelectedImagesSide?.id] = {
                          ...cars[SelectedImagesSide?.id],
                          carImages: {
                            ...cars[SelectedImagesSide?.id]?.carImages,
                            [SelectedImagesSide.side]: cars[
                              SelectedImagesSide?.id
                            ]?.carImages[SelectedImagesSide?.side]?.filter(
                              (ele) =>
                                ele?.publicId !==
                                SelectedCars[SelectedImagesSide?.id]?.carImages[
                                  SelectedImagesSide?.side
                                ][i]?.publicId
                            ),
                          },
                        };
                        setSelectedCars(cars);
                      });
                    }}
                  >
                    <CloseIcon size={"small"} color="secondary" />
                  </Box>
                </div>
              ))}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Box
            sx={{ width: "100%" }}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Button
              variant="contained"
              onClick={onCloseImagesDialog}
              sx={{ width: "150px", textTransform: "none", marginRight: "5px" }}
            >
              Close
            </Button>
            <Button
              sx={{
                width: "150px",
                textTransform: "none",
                whiteSpace: "nowrap",
              }}
              variant="contained"
              color="secondary"
              disabled={LoadingUpload}
              onClick={() => {
                document.getElementById("side_photo").click();
              }}
            >
              {LoadingUpload && (
                <CircularProgress
                  sx={{
                    width: "20px !important",
                    height: "20px !important",
                    marginRight: "20px",
                  }}
                />
              )}
              Add image
            </Button>
            <VisuallyHiddenInput
              id="side_photo"
              type="file"
              multiple
              onChange={(event) => {
                //  console.log(event.target.files[0]);
                uploadFiles(Object.values(event.target.files), (images) => {
                  let cars = { ...SelectedCars };
                  cars[SelectedImagesSide?.id] = {
                    ...cars[SelectedImagesSide?.id],
                    carImages: {
                      ...cars[SelectedImagesSide?.id]?.carImages,
                      [SelectedImagesSide.side]: images,
                    },
                  };
                  setSelectedCars(cars);
                });
              }}
            />
          </Box>
        </DialogActions>
      </Dialog>

      <RemoveDialog
        open={OpenRemove}
        setOpen={setOpenRemove}
        handleSave={() => {
          axiosInstance.delete(`/orders/${params.name}`).then((res) => {
            //   console.log("delete res ", res);
            if (res?.statusText === "OK") {
              navigate("/orders");
            }
          });
        }}
      />

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

export default InspectOrder;
