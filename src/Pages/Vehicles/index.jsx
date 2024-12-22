import React, { useState, useEffect, useContext } from "react";
// import axiosInstance from "../../axiosInstance";
// import API from "../../api";
import Filter from "./Filter";
import ActionCellMenu from "../../Components/ActionCellMenu";
import { AppContext } from "../../Context/AppContext";

import { CircularProgress, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { DataGrid } from "@mui/x-data-grid/DataGrid/DataGrid";
import {
  VisibilityOutlined as VisibilityOutlinedIcon,
  SettingsOutlined as SettingsOutlinedIcon,
  BorderColorOutlined as BorderColorOutlinedIcon,
  DeleteOutlined as DeleteOutlinedIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import StateBody from "../../Components/Columns/StateBody";
import RemoveDialog from "../../Components/RemoveDialog";
import { addCommas, deleteItemFromArray } from "../../lib";

function Vehicles({ permissions }) {
  const navigate = useNavigate();
  const {
    setShowBackButton,
    setNavigationBackURL,
    VehiclesData,
    setVehiclesData,
  } = useContext(AppContext);
  // const [DataTable, setDataTable] = useState([]);
  const [FilterData, setFilterData] = useState({
    Brands: [],
    Models: [],
    Status: [],
  });
  const [filterValues, setFilterValues] = useState({
    search: undefined,
    brands: [],
    models: [],
    status: "", //[],
    priceMin: undefined,
    priceMax: undefined,
  });
  const [OpenRemove, setOpenRemove] = useState(false);
  const [RowData, setRowData] = useState({});
  // const [Refresh, setRefresh] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [Loading, setLoading] = useState(false);

  useEffect(() => {
    setShowBackButton(false);
    setNavigationBackURL({
      to: "",
      state: {},
    });
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  // useEffect(() => {
  //   setLoading(true);
  //   axiosInstance
  //     .get(API.vehicles, {
  //       params: {
  //         search: filterValues?.search,
  //         brands: filterValues?.brands?.join(","),
  //         models: filterValues?.models?.join(","),
  //         status:
  //           filterValues?.status !== "rented" &&
  //           filterValues?.status !== "in maintenance"
  //             ? filterValues?.status
  //             : undefined,
  //         priceMin: filterValues?.priceMin,
  //         priceMax: filterValues?.priceMax,
  //         isRented: filterValues?.status?.includes("rented")
  //           ? true
  //           : filterValues?.status?.includes("available")
  //           ? false
  //           : undefined,
  //         isMaintenance: filterValues?.status?.includes("in maintenance")
  //           ? true
  //           : filterValues?.status?.includes("available")
  //           ? false
  //           : undefined,
  //       },
  //     })
  //     .then((res) => {
  //       setTotalRecords(res?.data?.count);
  //       let data = res?.data?.data?.map((val) => ({
  //         ...val,
  //         id: val?._id,
  //       }));
  //       setPage(0);
  //       setDataTable([...data]);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       setTotalRecords(0);
  //       setDataTable([]);
  //       setLoading(false);
  //     });
  // }, [filterValues, Refresh]);
  // useEffect(() => {
  //   axiosInstance.get(API.vehicles).then((res) => {
  //     let data = res?.data?.data?.map((val) => ({
  //       ...val,
  //       id: val?._id,
  //     }));
  //     let isRentedExist = data?.find((ele) => ele?.isRented);
  //     let isIsMaintenaceExist = data?.find((ele) => ele?.IsMaintenance);
  //     setFilterData({
  //       Brands: [...new Set(data?.map((ele) => ele?.brand))],
  //       Models: [...new Set(data?.map((ele) => ele?.model))],
  //       Status: [
  //         ...new Set(data?.map((ele) => ele?.state)),
  //         isRentedExist ? "rented" : null,
  //         isIsMaintenaceExist ? "in maintenance" : null,
  //       ],
  //     });
  //   });
  // }, [Refresh]);
  const colors = {
    available: "#0F930F",
    unavailable: "#EF0A0A",
    rented: "#EF0A0A",
    in_maintenance: "#FF9407",
  };
  const columns = [
    {
      field: "image",
      headerName: "Picture",
      align: "center",
      headerAlign: "center",
      flex: 1,
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => (
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          alignItems="center"
        >
          <img
            src={params?.row?.media[0]?.url}
            width="50px"
            height={"50px"}
            style={{ borderRadius: 2, cursor: "pointer", objectFit: "contain" }}
            onLoad={() => {}}
            onError={(e) => {
              e.currentTarget.onerror = null; // prevents looping
              e.currentTarget.src = "/images/car.jpeg";
              // e.currentTarget.style = 'display: none';
              //e.target.style.display = 'none';
            }}
            // onClick={() => {
            //   setRowData(params?.row);
            //   setOpenDialog(true);
            // }}
          />
        </Stack>
      ),
    },
    {
      field: "carId",
      headerName: "Car ID",
      align: "left",
      headerAlign: "left",
      flex: 2,
      hideSortIcons: false,
      disableColumnMenu: true,
      sortable: true,
      editable: true,
      //renderEditCell: (params) => <CustomTypeEditComponent {...params} />,
    },
    {
      field: "vinNumber",
      headerName: "VIN Number",
      align: "left",
      headerAlign: "left",
      flex: 1,
      hideSortIcons: false,
      disableColumnMenu: true,
      sortable: true,
      editable: true,
    },
    {
      field: "brand",
      headerName: "Brand",
      align: "left",
      headerAlign: "left",
      flex: 1,
      hideSortIcons: false,
      disableColumnMenu: true,
      sortable: true,
      editable: true,
    },
    {
      field: "model",
      headerName: "Model",
      align: "left",
      headerAlign: "left",
      flex: 1,
      hideSortIcons: false,
      disableColumnMenu: true,
      sortable: true,
      editable: true,
    },
    {
      field: "year",
      headerName: "Year",
      align: "left",
      headerAlign: "left",
      flex: 1,
      hideSortIcons: false,
      disableColumnMenu: true,
      sortable: true,
      editable: true,
    },
    {
      field: "color",
      headerName: "Color",
      align: "left",
      headerAlign: "left",
      flex: 1,
      hideSortIcons: false,
      disableColumnMenu: true,
      sortable: true,
      editable: true,
    },
    {
      field: "mileage",
      headerName: "Mileage",
      align: "left",
      headerAlign: "left",
      flex: 1,
      hideSortIcons: false,
      disableColumnMenu: true,
      sortable: true,
      renderCell: (params) => (
        <Stack
          direction={"row"}
          justifyContent={"flex-start"}
          alignItems={"center"}
          spacing={1}
          sx={{ height: "100%", color: "#000" }}
        >
          <Typography variant="subtitle2">
            {addCommas(params?.row?.mileage || 0)} &nbsp; miles
          </Typography>
        </Stack>
      ),
    },
    // {
    //   field: "nextMaintenanceDate",
    //   headerName: "Next Maintenance Date",
    //   align: "left",
    //   headerAlign: "left",
    //   flex: 2,
    //   hideSortIcons: false,
    //   disableColumnMenu: true,
    //   sortable: true,
    //   renderCell: (params) => (
    //     <DateBody value={params?.row?.nextMaintenanceDate} />
    //   ),
    // },
    {
      field: "rentalPrice",
      headerName: "Price",
      align: "left",
      headerAlign: "left",
      flex: 1,
      hideSortIcons: false,
      disableColumnMenu: true,
      sortable: true,
      renderCell: (params) => (
        <Stack
          direction={"row"}
          justifyContent={"flex-start"}
          alignItems={"center"}
          spacing={1}
          sx={{ height: "100%", color: "#000" }}
        >
          <Typography variant="subtitle2">
            ${addCommas(params?.row?.rentalPrice)}
          </Typography>
        </Stack>
      ),
    },
    {
      field: "state",
      headerName: "State",
      align: "left",
      headerAlign: "left",
      flex: 2,
      hideSortIcons: false,
      disableColumnMenu: true,
      sortable: true,
      renderCell: (params) => {
        let state = params?.row?.state || "available";
        // let state;
        // if (params?.row?.state === "out_of_service") {
        //   state = "out_of_service";
        // } else if (
        //   !params?.row?.isRented &&
        //   !params?.row?.IsMaintenance &&
        //   params?.row?.state !== "out_of_service"
        // ) {
        //   state = "available";
        // } else if (
        //   params?.row?.isRented &&
        //   params?.row?.IsMaintenance &&
        //   params?.row?.state !== "out_of_service"
        // ) {
        //   return (
        //     <Stack direction={"column"}>
        //       <StateBody color={colors["rented"]} value={"rented"} />
        //       <StateBody
        //         color={colors["in_maintenance"]}
        //         value={"in maintenance"}
        //       />
        //     </Stack>
        //   );
        // } else if (
        //   params?.row?.isRented &&
        //   !params?.row?.IsMaintenance &&
        //   params?.row?.state !== "out_of_service"
        // ) {
        //   state = "rented";
        // } else if (
        //   !params?.row?.isRented &&
        //   params?.row?.IsMaintenance &&
        //   params?.row?.state !== "out_of_service"
        // ) {
        //   state = "in_maintenance";
        // }
        return (
          <StateBody color={colors[state]} value={state?.replace("_", " ")} />
        );
      },
    },
    {
      field: "",
      headerName: "Actions",
      align: "center",
      headerAlign: "center",
      flex: 1,
      hideSortIcons: false,
      disableColumnMenu: true,
      disableExport: true,
      sortable: false,
      renderCell: (params) => (
        <>
          {!permissions?.vehicles?.view &&
          !permissions?.vehicles?.edit &&
          !permissions?.vehicles?.delete ? (
            <small>Not authorized</small>
          ) : (
            <ActionCellMenu
              menuItems={[
                {
                  icon: <VisibilityOutlinedIcon />,
                  label: "View",
                  onClick: () => {
                    setShowBackButton(true);
                    navigate(`/vehicles/details/${params?.row?.id}`);
                  },
                  hide: !permissions?.vehicles?.view,
                },
                {
                  icon: <SettingsOutlinedIcon />,
                  label: "Maintenance",
                  onClick: () => {
                    setShowBackButton(true);
                    navigate(`/vehicles/maintenance/${params?.row?.id}`);
                  },
                },
                {
                  icon: <BorderColorOutlinedIcon />,
                  label: "Edit",
                  onClick: () => {
                    navigate(`/vehicles/edit/${params?.row?.id}`);
                  },
                  hide: !permissions?.vehicles?.edit,
                },
                {
                  icon: <DeleteOutlinedIcon color="error" />,
                  label: "Delete",
                  color: "error",
                  onClick: () => {
                    console.log("params ", params);
                    setRowData(params?.row);
                    setOpenRemove(true);
                  },
                  hide: !permissions?.vehicles?.delete,
                },
              ]}
            />
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
            FilterData={FilterData}
            setFilterValues={setFilterValues}
            filterValues={filterValues}
            showCreateBtn={permissions?.vehicles?.create}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
          {Loading ? (
            <CircularProgress />
          ) : (
            <DataGrid
              //rows={DataTable || []}
              rows={VehiclesData?.map((ele, i) => ({ ...ele, index: i })) || []}
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
        handleSave={() => {
          let newData = deleteItemFromArray(VehiclesData, RowData.index);
          setVehiclesData(newData);
          setOpenRemove(false);
        }}
        // endpoint={API.vehicles}
        // itemId={RowData?._id}
        // setRefresh={setRefresh}
        // Refresh={Refresh}
      />
    </>
  );
}
export default Vehicles;
