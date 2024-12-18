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
  BorderColorOutlined as BorderColorOutlinedIcon,
  DeleteOutlined as DeleteOutlinedIcon,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import API from "../../api";
import { AppContext } from "../../Context/AppContext";
import dayjs from "dayjs";
import RemoveDialog from "../../Components/RemoveDialog";
import DateTimeBody from "../../Components/Columns/DateTimeBody";
import StateBody from "../../Components/Columns/StateBody";
import { addCommas } from "../../lib";

import "./index.css";

function Details() {
  const navigate = useNavigate();
  const params = useParams();
  // console.log("params ", params.name);
  const { setShowBackButton } = useContext(AppContext);
  const [values, setValues] = useState([new Date(), new Date("2024-10-25")]);
  // console.log(values);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [OpenRemove, setOpenRemove] = useState(false);
  //cardType: "Visa", "MasterCard", "PayPal"
  const [Info, setInfo] = useState({
    // "image": {
    //     "url": "https://res.cloudinary.com/beirut-mart/image/upload/v1731626416/skyline-car-rental-media/dqtilgyvjkrggvxtuv7c.jpg",
    //     "public_id": "skyline-car-rental-media/dqtilgyvjkrggvxtuv7c",
    //     "resource_type": "image"
    // },
    // "_id": "673665275736867bfa361765",
    // "name": "John Doe2",
    // "phoneNumber": "1234567",
    // "email": "johndo@example.com",
    // "dateOfBirth": "1997-12-31T22:00:00.000Z",
    // "policyNumber": "INS12345",
    // "paymentMethod": "online",
    // "status": "active",
    // "orders": [
    //     {
    //         "orderId": "67366a405736867bfa361864",
    //         "state": "pending",
    //         "customerName": "John Doe2",
    //         "cars": [
    //             {
    //                 "pickupDateTime": "2024-11-15T09:10:43.299Z",
    //                 "returnDateTime": "2024-11-21T21:08:43.299Z",
    //                 "totalPrice": 900
    //             }
    //         ]
    //     },
    //     {
    //         "orderId": "67368e6b22c42d696be1fc64",
    //         "state": "pending",
    //         "customerName": "John Doe2",
    //         "cars": [
    //             {
    //                 "pickupDateTime": "2024-11-18T23:55:48.696Z",
    //                 "returnDateTime": "2024-11-22T23:55:48.696Z",
    //                 "totalPrice": 600
    //             },
    //             {
    //                 "pickupDateTime": "2024-11-19T23:56:03.885Z",
    //                 "returnDateTime": "2024-11-26T23:56:03.885Z",
    //                 "totalPrice": 350
    //             }
    //         ]
    //     },
    //     {
    //         "orderId": "67376cdbc958fff04165c64a",
    //         "state": "pending",
    //         "customerName": "John Doe2",
    //         "cars": [
    //             {
    //                 "pickupDateTime": "2024-11-15T15:43:33.565Z",
    //                 "returnDateTime": "2024-11-20T15:43:33.565Z",
    //                 "totalPrice": 250
    //             },
    //             {
    //                 "pickupDateTime": "2024-11-15T15:43:33.565Z",
    //                 "returnDateTime": "2024-11-20T15:43:33.565Z",
    //                 "totalPrice": 250
    //             }
    //         ]
    //     }
    // ],
    // "createdAt": "2024-11-14T21:01:27.407Z",
    // "updatedAt": "2024-11-15T15:46:36.125Z",
    // "__v": 0
  });
  const [Loading, setLoading] = useState(false);
  useEffect(() => {
    setShowBackButton(true);
  }, []);
  useEffect(() => {
    if (params.name) {
      // get info by name
      setLoading(true);
      axiosInstance.get(API.customers + `/${params.name}`).then((res) => {
        if (res?.data?.success) {
          console.log(res?.data?.data?.name);
          setInfo({
            id: res?.data?.data?._id,
            name: res?.data?.data?.name,
            email: res?.data?.data?.email,
            phone: res?.data?.data?.phoneNumber,
            createdAt: res?.data?.data?.createdAt,
            updatedAt: res?.data?.data?.updatedAt,
            paymentMethods: [],
            // [
            //   ...res?.data?.data?.paymentMethods,
            //   ...res?.data?.data?.paymentMethods,
            // ] || [],

            image: res?.data?.data?.image?.url || undefined,
            dateOfBirth: dayjs(res?.data?.data?.dateOfBirth),
            policyNumber: res?.data?.data?.policyNumber,
            paymentMethod: res?.data?.data?.paymentMethod,
            status: res?.data?.data?.status,
            orders: res?.data?.data?.orders || [],
          });
        }
        setLoading(false);
      });
    }
  }, [params.name]);
  //console.log("Info ", Info);

  const GalleryComp = (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <div
          className="oneImage"
          style={{
            height: "350px",
            //backgroundImage: `url(${Info?.image})`,
            backgroundImage: `url('/images/user.png')`,
            // opacity: selectedImage !== img && "0.5",
            position: "relative",
            objectFit: "cover",
          }}
          // onClick={() => {
          //   setSelectedImage(img);
          //   setSelectVideo("");
          // }}
        />
      </Grid>
    </Grid>
  );
  const DetailsComp = (
    <Stack direction={"column"}>
      <Typography variant="h6" textAlign={"center"} sx={{ padding: "5px" }}>
        {Info?.name || ""}
      </Typography>
      {[
        { name: "Phone number", value: Info?.phone || "" },
        { name: "Email address", value: Info?.email || "" },
        {
          name: "Date of birth",
          value: Info?.dateOfBirth
            ? new Date(Info?.dateOfBirth).toLocaleDateString()
            : "",
        },
        { name: "Last visit", value: Info?.updatedAt || "" },
        { name: "Policy number", value: Info?.policyNumber || "" },
      ].map((ele, i) => (
        <Stack key={i} direction={"row"}>
          <Typography variant="subtitle2">{ele.name}: &nbsp;</Typography>
          <Typography variant="body2">{ele.value}</Typography>
        </Stack>
      ))}
      <Divider sx={{ margin: "5px 0px" }} />
      <Stack direction={"row"}>
        <Typography variant="subtitle2" sx={{ textAlign: "left" }}>
          Payment method: &nbsp;
        </Typography>
        <Typography variant="body2">{Info?.paymentMethod}</Typography>
        {/* {Info?.paymentMethods?.map((ele, i) => (
          <Stack
            key={i}
            direction={"row"}
            justifyContent={"space-between"}
            sx={{
              backgroundColor: "#F6F7F9",
              padding: "10px 10px",
              borderRadius: "8px",
              marginBottom: "5px",
            }}
          >
            <Typography sx={{ textAlign: "left" }} variant="body2">
              {ele?.cvc || ""}
            </Typography>
            <img
              alt={ele?.cardType}
              src={
                ele?.cardType === "Visa"
                  ? "/images/Visa.png"
                  : ele?.cardType === "PayPal"
                  ? "/images/PayPal.png"
                  : ""
              }
            />
          </Stack>
        ))} */}
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
      field: "id",
      headerName: "Order ID",
      align: "left",
      headerAlign: "left",
      flex: 1,
      hideSortIcons: false,
      disableColumnMenu: true,
      sortable: true,
      editable: true,
      //renderEditCell: (params) => <CustomTypeEditComponent {...params} />,
    },
    {
      field: "customerName",
      headerName: "Customer",
      align: "left",
      headerAlign: "left",
      flex: 1,
      hideSortIcons: false,
      disableColumnMenu: true,
      sortable: true,
      editable: true,
      //renderEditCell: (params) => <CustomTypeEditComponent {...params} />,
    },
    {
      field: "Pickup date",
      headerName: "Pickup date",
      align: "center",
      headerAlign: "left",
      flex: 2,
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      editable: true,
      renderCell: (params) => (
        <Stack
          direction={"column"}
          justifyContent={"center"}
          sx={{ height: "100%" }}
        >
          {params?.row?.cars?.map((car) => (
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
          justifyContent={"center"}
          sx={{ height: "100%" }}
        >
          {params?.row?.cars?.map((car) => (
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
      headerName: "Total price",
      align: "left",
      headerAlign: "left",
      flex: 1,
      hideSortIcons: false,
      disableColumnMenu: true,
      sortable: true,
      editable: true,
      renderCell: (params) => (
        <>
          {addCommas(
            params?.row?.cars?.reduce((accumulator, item) => {
              return (accumulator += item.totalPrice);
            }, 0)
          )}
          &nbsp; USD
        </>
      ),
    },
    {
      field: "state",
      headerName: "State",
      align: "left",
      headerAlign: "left",
      flex: 1,
      hideSortIcons: false,
      disableColumnMenu: true,
      sortable: true,
      renderCell: (params) => (
        <>
          {params?.row?.state && (
            <StateBody
              color={colors[params?.row?.state]}
              value={params?.row?.state}
            />
          )}
        </>
      ),
    },
  ];
  const TableComp = (
    <>
      <DataGrid
        rows={Info?.orders?.map((ele, i) => ({ ...ele, id: i + 1 })) || []}
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
  return (
    <>
      <Grid container spacing={2} mb={2}>
        {Loading ? (
          <Grid size={{ xs: 12, sm: 12 }}>
            <CircularProgress />
          </Grid>
        ) : null}
        {!Loading ? (
          <Grid size={{ xs: 12, sm: 12, md: 4 }}>
            <Card sx={{ padding: "15px 25px" }}>
              <Stack direction={"column"} spacing={1}>
                {GalleryComp}
                <Divider />
                {DetailsComp}
                <Divider />
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
                        navigate(`/customers/edit/${params.name}`);
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
                      Edit payment
                    </Button>
                  </Box>
                </Grid>
              </Stack>
            </Card>
          </Grid>
        ) : null}
        {!Loading ? (
          <Grid size={{ xs: 12, sm: 12, md: 8 }}>
            <Grid container spacing={1}>
              <Grid size={{ xs: 12 }}>
                <Typography textAlign={"left"} fontWeight={600} variant="h5">
                  Cars rented report
                </Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Card sx={{ padding: "15px" }}>{TableComp}</Card>
              </Grid>
            </Grid>
          </Grid>
        ) : null}
      </Grid>
      <RemoveDialog
        open={OpenRemove}
        setOpen={setOpenRemove}
        handleSave={() => {
          axiosInstance
            .delete(`${API.customers}/${params.name}`)
            .then((res) => {
              //   console.log("delete res ", res);
              if (res?.statusText === "OK") {
                navigate("/customers");
              }
            });
        }}
      />
    </>
  );
}

export default Details;
