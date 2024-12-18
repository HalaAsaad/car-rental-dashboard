import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  Card,
  Divider,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { DataGrid } from "@mui/x-data-grid/DataGrid/DataGrid";
import {
  // VisibilityOutlined as VisibilityOutlinedIcon,
  // SettingsOutlined as SettingsOutlinedIcon,
  BorderColorOutlined as BorderColorOutlinedIcon,
  DeleteOutlined as DeleteOutlinedIcon,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import API from "../../api";
import { AppContext } from "../../Context/AppContext";
// import ActionCellMenu from "../../Components/ActionCellMenu";
import RemoveDialog from "../../Components/RemoveDialog";
import DateTimeBody from "../../Components/Columns/DateTimeBody";
import StateBody from "../../Components/Columns/StateBody";
import LinkBody from "../../Components/Columns/LinkBody";

// import MultipleDatesPicker from "@ambiot/material-ui-multiple-dates-picker";
import { Calendar, DateObject } from "react-multi-date-picker";
// import "react-multi-date-picker/styles/colors/red.css";
import "./index.css";
import { addCommas } from "../../lib";
import dayjs from "dayjs";

const data = {
  _id: "673bc2310f16e58a118f1fb3",
  carId: "DCWA-680",
  vinNumber: "KMHLN4AJ4MU009226",
  brand: "HYUNDAI",
  model: "ELENTRA",
  color: "BLACK",
  mileage: 50000,
  year: 2021,
  rentalPrice: 50,
  state: "available",
  media: [
    {
      url: "https://res.cloudinary.com/beirut-mart/image/upload/v1731969646/skyline-car-rental-media/ejii4ceaps68t297xq2v.jpg",
      public_id: "skyline-car-rental-media/ejii4ceaps68t297xq2v",
      resource_type: "image",
      _id: "673bc26f0f16e58a118f1feb",
    },
  ],
  isRented: false,
  IsMaintenace: true,
  maintenanceTasks: [
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
  ],
  rentalHistory: [],
  createdAt: "2024-11-18T22:39:45.451Z",
  updatedAt: "2024-12-12T22:35:09.134Z",
  __v: 39,
  currentCustomer: "",
};
function Details() {
  const navigate = useNavigate();
  const params = useParams();
  //console.log("params ", params.name);
  const { setShowBackButton } = useContext(AppContext);
  const [values, setValues] = useState([[new Date(), new Date()]]); // Multiple Range Picker
  const [startDateInDetails, setStartDateInDetails] = useState([]);
  const [endDateInDetails, setEndDateInDetails] = useState([]);
  console.log(values);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [Info, setInfo] = useState({
    media: undefined,
    carId: undefined,
    vinNumber: undefined,
    brand: undefined,
    model: undefined,
    color: undefined,
    mileage: undefined,
    rentalPrice: undefined,
    state: undefined,
    nextMaintenanceDate: undefined,
    rentalHistory: [],
    maintenanceTasks: [],
  });
  const [SelectedImageIndex, setSelectedImageIndex] = useState(0);
  const [OpenRemove, setOpenRemove] = useState(false);
  const [Loading, setLoading] = useState(false);
  const data = {
    success: true,
    data: {
      _id: "673662285736867bfa361690",
      carId: "125 lwv",
      vinNumber: "vin20",
      brand: "BMW",
      model: "2024",
      color: "Dark blue ",
      mileage: 1020,
      nextMaintenanceDate: "2024-11-20T22:00:00.000Z",
      rentalPrice: 150,
      state: "rented",
      media: [
        {
          url: "https://res.cloudinary.com/beirut-mart/image/upload/v1731617487/skyline-car-rental-media/lnf05yhbvgrrgcqga1ks.jpg",
          public_id: "skyline-car-rental-media/lnf05yhbvgrrgcqga1ks",
          resource_type: "image",
          _id: "673662dd5736867bfa3616de",
        },
        {
          url: "https://res.cloudinary.com/beirut-mart/image/upload/v1731617493/skyline-car-rental-media/ty7z5tufpnuam3qldtdq.jpg",
          public_id: "skyline-car-rental-media/ty7z5tufpnuam3qldtdq",
          resource_type: "image",
          _id: "673662dd5736867bfa3616df",
        },
        {
          url: "https://res.cloudinary.com/beirut-mart/image/upload/v1731617499/skyline-car-rental-media/pgl3szwbggeqqicmarcp.jpg",
          public_id: "skyline-car-rental-media/pgl3szwbggeqqicmarcp",
          resource_type: "image",
          _id: "673662dd5736867bfa3616e1",
        },
      ],
      maintenanceTasks: [],
      rentalHistory: [
        {
          orderId: {
            _id: "67366a405736867bfa361864",
            customer: {
              _id: "673665275736867bfa361765",
              name: "John Doe2",
            },
            state: "pending",
            cars: [
              {
                pickupDateTime: "2024-11-15T09:10:43.299Z",
                returnDateTime: "2024-11-21T21:08:43.299Z",
                totalPrice: 900,
                _id: "67373f3922c42d696be20448",
              },
            ],
          },
          orderDate: "2024-11-14T21:23:13.097Z",
          _id: "67366a415736867bfa36186a",
        },
        {
          orderId: {
            _id: "67368e6b22c42d696be1fc64",
            customer: {
              _id: "673665275736867bfa361765",
              name: "John Doe2",
            },
            state: "pending",
            cars: [
              {
                pickupDateTime: "2024-11-18T23:55:48.696Z",
                returnDateTime: "2024-11-22T23:55:48.696Z",
                totalPrice: 600,
                _id: "67373f3922c42d696be20449",
              },
            ],
          },
          orderDate: "2024-11-14T23:57:31.644Z",
          _id: "67368e6b22c42d696be1fc6c",
        },
      ],
      createdAt: "2024-11-14T20:48:40.844Z",
      updatedAt: "2024-11-15T07:20:09.889Z",
      __v: 4,
    },
  };
  useEffect(() => {
    setShowBackButton(true);
  }, []);
  useEffect(() => {
    if (params.name) {
      // get car info by name
      setLoading(true);
      axiosInstance.get(API.vehicles + `/${params.name}`).then((res) => {
        // console.log(res?.data?.data);
        setValues([]);
        if (res?.data?.success) {
          setInfo({
            id: res?.data?.data?._id,
            media: res?.data?.data?.media,
            carId: res?.data?.data?.carId,
            vinNumber: res?.data?.data?.vinNumber,
            brand: res?.data?.data?.brand,
            model: res?.data?.data?.model,
            color: res?.data?.data?.color,
            mileage: res?.data?.data?.mileage,
            rentalPrice: res?.data?.data?.rentalPrice,
            state: res?.data?.data?.state,
            nextMaintenanceDate: res?.data?.data?.nextMaintenanceDate,
            rentalHistory: res?.data?.data?.rentalHistory,
            maintenanceTasks: res?.data?.data?.maintenanceTasks,
            currentCustomer: res?.data?.data?.currentCustomer,
          });
          res?.data?.data?.rentalHistory?.forEach((element) => {
            setValues((prev) => [
              ...prev,
              [
                new Date(element?.orderId?.cars[0]?.pickupDateTime),
                new Date(element?.orderId?.cars[0]?.returnDateTime),
              ],
            ]);
          });
        }
        setLoading(false);
      });
    }
  }, [params.name]);
  useEffect(() => {
    if (values?.length > 0) {
      // let start = dayjs(values[0][0]).format("YYYY-MM-DD");
      // let end = dayjs(values[values.length - 1][1]).format("YYYY-MM-DD");

      let start = values?.map((ele) => dayjs(ele[0]).format("YYYY-MM-DD"));
      let end = values?.map((ele) => dayjs(ele[1]).format("YYYY-MM-DD"));
      setStartDateInDetails(start);
      setEndDateInDetails(end);
    }
  }, [values]);

  const GalleryComp = (
    <Grid container spacing={2}>
      <Grid size={{ xs: Info?.media?.length > 1 ? 9 : 12 }}>
        <div
          className="oneImage"
          style={{
            height: "300px",
            // backgroundImage: `url(${getImgVidUrl(img)})`,
            backgroundImage: `url('${
              Info?.media?.length > 0
                ? Info?.media[SelectedImageIndex]?.url
                : "/images/car.jpeg"
            }')`,
            // opacity: selectedImage !== img && "0.5",
            position: "relative",
          }}
          // onClick={() => {
          //   setSelectedImage(img);
          //   setSelectVideo("");
          // }}
        />
      </Grid>
      {Info?.media?.length > 1 && (
        <Grid size={{ xs: 3 }}>
          <Stack
            direction={"column"}
            spacing={1}
            sx={{ height: "100%", maxHeight: "300px", overflow: "auto" }}
          >
            {Info?.media?.map((ele, i) => (
              <div
                key={i}
                className="oneImage"
                style={{
                  height: "calc(100% / 4 - 6px)",
                  backgroundImage: `url(${ele?.url})`,
                  // backgroundImage: `url('/images/car.jpeg')`,
                  // opacity: selectedImage !== img && "0.5",
                  position: "relative",
                }}
                onClick={() => {
                  setSelectedImageIndex(i);
                }}
              />
            ))}
          </Stack>
        </Grid>
      )}
    </Grid>
  );
  const DetailsComp = (
    <Stack direction={"column"}>
      <Typography
        variant="h6"
        textAlign={"center"}
        sx={{
          padding: "5px",
          fontFamily: "Montserrat",
          fontSize: "20px",
          fontWeight: 600,
          lineHeight: "30px",
          textAlign: "center",
          color: "#191919",
        }}
      >
        {Info?.carId}
      </Typography>
      {[
        { name: "Car ID", value: Info?.carId },
        { name: "VIN Number", value: Info?.vinNumber },
        { name: "Brand", value: Info?.brand },
        { name: "Model", value: Info?.model },
        { name: "Color", value: Info?.color },
        { name: "Mileage", value: Info?.mileage },
        { name: "State", value: Info?.state },
        // {
        //   name: "Next maintenance",
        //   value: new Date(Info?.nextMaintenanceDate).toLocaleDateString(),
        // },
      ].map((ele, i) => (
        <Stack key={i} direction={"row"}>
          <Typography
            sx={{
              fontFamily: "Montserrat",
              fontSize: "14px",
              fontWeight: 600,
              lineHeight: "21px",
              textAlign: "center",
              color: "#191919",
            }}
          >
            {ele.name}: &nbsp;
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontFamily: "Montserrat",
              fontSize: "14px",
              fontWeight: 500,
              lineHeight: "21px",
              textAlign: "center",
              color: "#191919",
            }}
          >
            {ele.value}
          </Typography>
        </Stack>
      ))}
      <Stack direction={"column"}>
        <Typography
          sx={{
            fontFamily: "Montserrat",
            fontSize: "14px",
            fontWeight: 600,
            lineHeight: "21px",
            textAlign: "left",
            color: "#191919",
          }}
        >
          Current customer: &nbsp;
        </Typography>
        <Typography
          sx={{
            backgroundColor: "#F6F7F9",
            textAlign: "center",
            padding: "10px 10px",
            borderRadius: "8px",
          }}
          variant="body2"
        >
          {Info?.currentCustomer}
        </Typography>
      </Stack>
    </Stack>
  );
  const colors = {
    in_route: "#D80027",
    pending: "#FF9407",
    completed: "#0F930F",
  };
  const columns = [
    {
      field: "id", //"orderNumber",
      headerName: "Order ID",
      align: "left",
      headerAlign: "left",
      // flex: 1,
      hideSortIcons: false,
      disableColumnMenu: true,
      sortable: true,
      editable: true,
      //renderEditCell: (params) => <CustomTypeEditComponent {...params} />,
    },
    {
      field: "Customer",
      headerName: "Customer",
      align: "left",
      headerAlign: "left",
      flex: 2,
      hideSortIcons: false,
      disableColumnMenu: true,
      sortable: true,
      editable: true,
      renderCell: (params) => (
        <LinkBody
          value={params?.row?.orderId?.customer?.name}
          to={`/customers/details/${params?.row?.orderId?.customer?._id}`}
        />
      ),
    },
    {
      field: "Pickup date",
      headerName: "Pickup date",
      align: "left",
      headerAlign: "left",
      flex: 2,
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      editable: true,
      renderCell: (params) => (
        <Stack
          direction={"column"}
          justifyContent={"left"}
          sx={{ height: "100%" }}
        >
          {params?.row?.orderId?.cars?.map((car) => (
            <DateTimeBody
              value={car?.pickupDateTime}
              color="#201D23CC"
              hideIcon
            />
          ))}
        </Stack>
      ),
    },
    {
      field: "Return date",
      headerName: "Return date",
      align: "left",
      headerAlign: "left",
      flex: 2,
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      editable: true,
      renderCell: (params) => (
        <Stack
          direction={"column"}
          justifyContent={"left"}
          sx={{ height: "100%" }}
        >
          {params?.row?.orderId?.cars?.map((car) => (
            <DateTimeBody
              value={car?.returnDateTime}
              color="#201D23CC"
              hideIcon
            />
          ))}
        </Stack>
      ),
    },
    {
      field: "Total price",
      headerName: "price",
      align: "left",
      headerAlign: "left",
      flex: 2,
      hideSortIcons: false,
      disableColumnMenu: true,
      sortable: true,
      editable: true,
      renderCell: (params) => (
        <>
          {addCommas(
            params?.row?.orderId?.cars?.reduce((accumulator, item) => {
              return (accumulator += item.totalPrice);
            }, 0)
          )}
          &nbsp; USD
        </>
      ),
    },
    {
      field: "State",
      headerName: "State",
      align: "left",
      headerAlign: "left",
      flex: 2,
      hideSortIcons: false,
      disableColumnMenu: true,
      sortable: true,
      renderCell: (params) => (
        <>
          {params?.row?.orderId?.state && (
            <StateBody
              color={colors[params?.row?.orderId?.state]}
              value={params?.row?.orderId?.state}
            />
          )}
        </>
      ),
    },
    // {
    //   field: "",
    //   headerName: "Actions",
    //   align: "left",
    //   headerAlign: "left",
    //   flex: 1,
    //   hideSortIcons: true,
    //   disableColumnMenu: true,
    //   disableExport: true,
    //   sortable: false,
    //   renderCell: (params) => (
    //     <>
    //       <ActionCellMenu
    //         menuItems={[
    //           {
    //             icon: <VisibilityOutlinedIcon />,
    //             label: "View",
    //             onClick: () => {
    //               setShowBackButton(true);
    //               navigate("/vehicles/details");
    //             },
    //           },
    //           {
    //             icon: <SettingsOutlinedIcon />,
    //             label: "Maintenance",
    //             onClick: () => {},
    //           },
    //           {
    //             icon: <BorderColorOutlinedIcon />,
    //             label: "Edit",
    //             onClick: () => {
    //               navigate("/vehicles/edit", {
    //                 state: { id: "id444" },
    //               });
    //             },
    //           },
    //           {
    //             icon: <DeleteOutlinedIcon color="secondary" />,
    //             label: "Delete",
    //             color: "secondary",
    //             onClick: () => {},
    //           },
    //         ]}
    //       />
    //     </>
    //   ),
    // },
  ];
  const TableComp = (
    <>
      <DataGrid
        rows={
          Info?.rentalHistory?.map((ele, i) => ({ ...ele, id: i + 1 })) || []
        }
        columns={columns}
        style={{ overflow: "auto" }}
        pagination
        pageSize={pageSize}
        rowLength={totalRecords}
        pageSizeOptions={[5, 10, 25]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: pageSize, page: page },
          },
        }}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "odd" : "even"
        }
        sx={{
          borderColor: "#fff",
          color: "#201D23CC",
          lineHeight: "19.6px",
          fontSize: "14px",
          fontFamily: "Montserrat",
          "& .even": {
            backgroundColor: "#FAFAFA !important",
          },
          "& .odd": {
            backgroundColor: "#FFF !important",
          },
          "& .MuiDataGrid-cell": {
            border: "unset",
            fontFamily: "Montserrat",
            height: "unset !important",
          },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#FAFAFA !important",
            borderBottom: "unset !important",
          },

          "& .MuiTablePagination-spacer": {
            flex: "0 !important",
          },
          "& .MuiInputBase-root": {
            marginRight: "auto !important",
          },
        }}
        disableRowSelectionOnClick
      />
    </>
  );
  function isInService(strDate, inServiceDates) {
    return inServiceDates?.some(
      ([start, end]) =>
        new Date(strDate) >= new Date(start) &&
        new Date(strDate) <= new Date(end)
    );
  }
  return (
    <>
      <Grid container spacing={2} mb={2}>
        {Loading && (
          <Grid size={{ xs: 12, sm: 12 }}>
            <CircularProgress />
          </Grid>
        )}
        {!Loading && (
          <Grid size={{ xs: 12, sm: 12, md: 4.5 }}>
            <Card sx={{ padding: "15px 25px" }}>
              <Stack direction={"column"} spacing={1} pl={2} pr={2}>
                {GalleryComp}
                <Divider />
                {DetailsComp}
              </Stack>
            </Card>
          </Grid>
        )}
        {!Loading && (
          <Grid size={{ xs: 12, sm: 12, md: 7.5 }}>
            <Grid container spacing={1}>
              <Grid size={{ xs: 12 }}>
                <Card sx={{ padding: "15px" }}>
                  <Calendar
                    //value={values}
                    // currentDate={[
                    //   new Date(dayjs().startOf("month")),
                    //   new Date(dayjs().endOf("month")),
                    // ]}
                    //onChange={setValues}
                    multiple
                    range
                    className="red details-calendar"
                    containerStyle={{ width: "100%" }}
                    style={{ width: "100%" }}
                    mapDays={({ date }) => {
                      let strDate = date;
                      let format_day = dayjs(strDate).format("YYYY-MM-DD");
                      let isStart = startDateInDetails.includes(format_day);
                      let isEnd = endDateInDetails.includes(format_day);
                      //console.log("date ", dayjs(strDate).format("YYYY-MM-DD"));
                      let props = {};
                      let _isInService = isInService(strDate, values);
                      props.disabled = true;
                      props.className = `${isStart ? "start-range" : ""} ${
                        isEnd ? "end-range" : ""
                      }`;
                      if (_isInService) {
                        props.children = (
                          <div
                            className={`booked-day ${
                              isStart ? "start-range" : ""
                            } ${isEnd ? "end-range" : ""}`}
                            style={
                              {
                                // borderBottomLeftRadius: "35px !important",
                                // borderTopLeftRadius: "35px !important",
                                // borderBottomRightRadius: "35px !important",
                                // borderTopRightRadius: "35px !important",
                                // backgroundColor: "#ef0a0a !important",
                                // boxShadow: "0 0 3px #ef0a0a !important",
                                // fontFamily: "Quicksand",
                                // fontSize: "18px !important",
                                // fontWight: "600 !important",
                                // lineHeight: "25px !important",
                              }
                            }
                          >
                            <span>{date.format("D")}</span>
                          </div>
                        );
                      } else {
                        props.children = (
                          <div
                            className={`not-booked-day ${
                              isStart ? "start-range" : ""
                            } ${isEnd ? "end-range" : ""}`}
                            // style={{
                            //   borderBottomLeftRadius: "35px !important",
                            //   borderTopLeftRadius: "35px !important",
                            //   borderBottomRightRadius: "35px !important",
                            //   borderTopRightRadius: "35px !important",
                            //   backgroundColor: "#ef0a0a !important",
                            //   boxShadow: "0 0 3px #ef0a0a !important",
                            // }}
                          >
                            <span>{date.format("D")}</span>
                          </div>
                        );
                      }

                      return props;
                    }}
                  />
                </Card>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Card sx={{ padding: "15px" }}>{TableComp}</Card>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  mb={2}
                >
                  <Button
                    variant="contained"
                    onClick={() => {
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
                      navigate(`/vehicles/edit/${params.name}`);
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
                    Edit Vehicle
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
      <RemoveDialog
        open={OpenRemove}
        setOpen={setOpenRemove}
        handleSave={() => {
          axiosInstance.delete(`${API.vehicles}/${params.name}`).then((res) => {
            //   console.log("delete res ", res);
            if (res?.statusText === "OK") {
              navigate("/vehicles");
            }
          });
        }}
      />
    </>
  );
}

export default Details;
