import React, { useState, useEffect, useContext } from "react";
import axiosInstance from "../../axiosInstance";
import API from "../../api";
import Filter from "./Filter";
import { AppContext } from "../../Context/AppContext";

import { CircularProgress, Button, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { DataGrid } from "@mui/x-data-grid/DataGrid/DataGrid";
import { useNavigate } from "react-router-dom";
import RemoveDialog from "../../Components/RemoveDialog";
import DateTimeBody from "../../Components/Columns/DateTimeBody";
import StateBody from "../../Components/Columns/StateBody";
import LinkBody from "../../Components/Columns/LinkBody";

const data = {
  customer: "674f6a39c33f69807dd061a9", //required
  state: "pending", //["pending", "confirmed", "canceled"], default: "pending", // Example states

  additionalInfo: {
    policyNumber: "PN123456",
    idPhotoUrl: {
      url: "https://example.com/id_photo.jpg",
      public_id: "id_photo_1",
    },
    insurancePolicyUrl: {
      url: "https://example.com/insurance_policy.jpg",
      public_id: "insurance_policy_1",
    },
  },
  payment: { method: ["Visa", "Cash"], reminder: "Weekly" }, //  enum: ["Weekly", "Biweekly", "Monthly"], // Example reminder

  cars: [
    {
      carId: "673bc2310f16e58a118f1fb3", //required
      pickupDateTime: "2024-12-04T10:00:00Z", //required
      returnDateTime: "2024-12-11T20:00:00Z", //required
      rentingPeriod: "20 Days",
      totalPrice: 500, //required
      carImages: {
        front: { url: "https://example.com/front.jpg", public_id: "front_1" },
        driverFront: {
          url: "https://example.com/driver_front.jpg",
          public_id: "driver_front_1",
        },
        passengerFront: {
          url: "https://example.com/passenger_front.jpg",
          public_id: "passenger_front_1",
        },
        driverRear: {
          url: "https://example.com/driver_rear.jpg",
          public_id: "driver_rear_1",
        },
        passengerRear: {
          url: "https://example.com/passenger_rear.jpg",
          public_id: "passenger_rear_1",
        },
        rear: { url: "https://example.com/rear.jpg", public_id: "rear_1" },
      },
    },
  ],
  rentalSummary: {
    discountType: "percentage",
    discountValue: 10,
    subtotal: 550,
    discount: 50,
    totalPrice: 500,
  },
  confirmation: {
    notes: "Customer requested a GPS",
    signatureUrl: {
      url: "https://res.cloudinary.com/beirut-mart/image/upload/v1733338121/skyline-car-rental-media/lqrg0viaonelixzpyqey.jpg",
      public_id: "skyline-car-rental-media/lqrg0viaonelixzpyqey",
    },
  }, //required
};
function Orders({ permissions }) {
  const navigate = useNavigate();
  const { setShowBackButton } = useContext(AppContext);
  const [DataTable, setDataTable] = useState([]);
  const [filterValues, setFilterValues] = useState({
    carIds: [],
    from: undefined,
    to: undefined,
  });
  const [OpenRemove, setOpenRemove] = useState(false);
  const [RowData, setRowData] = useState({});
  const [Refresh, setRefresh] = useState(false);
  const [pageSize] = useState(10);
  const [page, setPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [Loading, setLoading] = useState(false);
  const [CarIDsOptions, setCarIDsOptions] = useState([]);
  useEffect(() => {
    setShowBackButton(false);
  }, []);
  useEffect(() => {
    // get all without filter
    axiosInstance.get(API.orders).then((res) => {
      let allCars = [];
      res?.data?.data?.forEach((ele) => {
        ele?.cars?.forEach((c) => {
          allCars = [...allCars, c?.carId?.carId];
        });
      });
      setCarIDsOptions(
        [...new Set(allCars)]?.filter(
          (ele) => ele !== undefined && ele !== null
        )
      );
    });
  }, []);
  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(API.orders, {
        params: {
          carIds: filterValues?.carIds?.join(","),
          pickupDate: filterValues?.from
            ? new Date().toISOString(filterValues?.from).split("T")[0]
            : undefined,
          pickupTime: filterValues?.from
            ? new Date()
                .toISOString(filterValues?.from)
                .split("T")[1]
                .split(".")[0]
            : undefined,
          returnDate: filterValues?.to
            ? new Date().toISOString(filterValues?.to).split("T")[0]
            : undefined,
          returnTime: filterValues?.to
            ? new Date()
                .toISOString(filterValues?.to)
                .split("T")[1]
                .split(".")[0]
            : undefined,
        },
      })
      .then((res) => {
        setTotalRecords(res?.data?.count);
        let data = res?.data?.data?.map((val, i) => ({
          ...val,
          // orderNumber: i + 1,
          id: val?._id,
          customer_name: val?.customer?.name || "",
        }));
        setPage(0);
        setDataTable([...data]);
        setLoading(false);
      })
      .catch((err) => {
        setTotalRecords(0);
        setDataTable([]);
        setLoading(false);
      });
  }, [filterValues, Refresh]);
  const colors = {
    in_route: "#D80027",
    pending: "#FF9407",
    completed: "#0F930F",
  };
  const columns = [
    {
      field: "orderNumber",
      headerName: "No",
      align: "left",
      headerAlign: "left",
      hideSortIcons: false,
      disableColumnMenu: true,
      sortable: true,
      editable: true,
      //renderEditCell: (params) => <CustomTypeEditComponent {...params} />,
    },
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
          direction={"column"}
          justifyContent={"center"}
          sx={{ height: "100%" }}
        >
          {params?.row?.cars
            // ?.filter((car) => car?.carId?.carId)
            .map((car) => {
              if (!car?.carId?.carId) {
                return (
                  <Typography variant="subtitle2">
                    {car?.carId?.carId || "__"}
                  </Typography>
                );
              } else {
                return (
                  <LinkBody
                    value={car?.carId?.carId || "__"}
                    to={`/vehicles/details/${car?.carId?._id}`}
                  />
                );
              }
            })}
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
        <LinkBody
          value={params?.row?.customer_name}
          to={`/customers/details/${params?.row?.customer?._id}`}
        />
      ),
    },
    {
      field: "Pick-Up date",
      headerName: "Pick-Up date",
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
      field: "createdAt",
      headerName: "Order date",
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
          <DateTimeBody
            value={params?.row?.updatedAt}
            color="#201D23CC"
            hideIcon
          />
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
              onClick={() => navigate(`/orders/view/${params?.row?._id}`)}
            >
              View
            </Button>
          )}
        </>
      ),
    },
  ];
  return (
    <>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
          <Filter
            setFilterValues={setFilterValues}
            filterValues={filterValues}
            CarIDsOptions={CarIDsOptions}
            showCreateBtn={permissions?.orders?.create}
          />
        </Grid>
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
                "& .MuiDataGrid-row": {
                  maxHeight: "unset !important",
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
          )}
        </Grid>
      </Grid>
      <RemoveDialog
        open={OpenRemove}
        setOpen={setOpenRemove}
        endpoint={API.customers}
        itemId={RowData?._id}
        setRefresh={setRefresh}
        Refresh={Refresh}
      />
    </>
  );
}
export default Orders;
