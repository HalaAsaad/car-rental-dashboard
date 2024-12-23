import React, { useState, useEffect, useContext } from "react";
// import axiosInstance from "../../axiosInstance";
// import API from "../../api";
import Filter from "./Filter";
import ActionCellMenu from "../../Components/ActionCellMenu";
import { AppContext } from "../../Context/AppContext";

import { CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { DataGrid } from "@mui/x-data-grid/DataGrid/DataGrid";
import {
  BorderColorOutlined as BorderColorOutlinedIcon,
  DeleteOutlined as DeleteOutlinedIcon,
  VisibilityOutlined as VisibilityOutlinedIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import RemoveDialog from "../../Components/RemoveDialog";
import DateBody from "../../Components/Columns/DateBody";
import { deleteItemFromArray } from "../../lib";

function Customers({ permissions }) {
  const navigate = useNavigate();
  const { setShowBackButton, CustomersData, setCustomersData } =
    useContext(AppContext);
  // const [DataTable, setDataTable] = useState([]);
  const [AllCustomers, setAllCustomers] = useState([]);
  const [filterValues, setFilterValues] = useState({
    name: undefined,
    phoneNumber: undefined,
    email: undefined,
  });
  const [OpenRemove, setOpenRemove] = useState(false);
  const [RowData, setRowData] = useState({});
  // const [Refresh, setRefresh] = useState(false);
  const [pageSize] = useState(10);
  const [page, setPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [Loading, setLoading] = useState(false);

  useEffect(() => {
    setShowBackButton(false);
  }, []);
  // useEffect(() => {
  //   setAllCustomers([]);
  //   axiosInstance.get(API.customers).then((res) => {
  //     setAllCustomers(res?.data?.data || []);
  //   });
  // }, [Refresh]);
  // useEffect(() => {
  //   setLoading(true);
  //   axiosInstance
  //     .get(API.customers, {
  //       params: {
  //         name: filterValues?.name,
  //         phoneNumber: filterValues?.phoneNumber,
  //         email: filterValues?.email,
  //       },
  //     })
  //     .then((res) => {
  //       setTotalRecords(res?.data?.data?.length);
  //       let data = res?.data?.data?.map((val) => ({
  //         ...val,
  //         id: val?._id,
  //         role_name: val?.role?.name || "",
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

  const columns = [
    {
      field: "name",
      headerName: "Name",
      align: "left",
      headerAlign: "left",
      flex: 1,
      hideSortIcons: false,
      disableColumnMenu: true,
      sortable: true,
      // editable: true,
      //renderEditCell: (params) => <CustomTypeEditComponent {...params} />,
    },
    {
      field: "email",
      headerName: "Email",
      align: "left",
      headerAlign: "left",
      flex: 1,
      hideSortIcons: false,
      disableColumnMenu: true,
      sortable: true,
      // editable: true,
      //renderEditCell: (params) => <CustomTypeEditComponent {...params} />,
    },
    {
      field: "phoneNumber",
      headerName: "Phone number",
      align: "left",
      headerAlign: "left",
      flex: 1,
      hideSortIcons: false,
      disableColumnMenu: true,
      sortable: true,
      editable: true,
    },
    {
      field: "latestOrderDate",
      headerName: "Last rented",
      align: "left",
      headerAlign: "left",
      flex: 1,
      hideSortIcons: false,
      disableColumnMenu: true,
      sortable: true,
      editable: true,
      renderCell: (params) =>
        params?.row?.latestOrderDate ? (
          <DateBody value={params?.row?.latestOrderDate} />
        ) : (
          ""
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
          {!permissions?.customers?.view &&
          !permissions?.customers?.edit &&
          !permissions?.customers?.delete ? (
            <small>Not authorized</small>
          ) : (
            <ActionCellMenu
              menuItems={[
                {
                  icon: <VisibilityOutlinedIcon />,
                  label: "View",
                  onClick: () => {
                    setShowBackButton(true);
                    navigate(`/customers/details/${params?.row?.id}`);
                  },
                  hide: !permissions?.customers?.view,
                },
                {
                  icon: <BorderColorOutlinedIcon />,
                  label: "Edit",
                  onClick: () => {
                    navigate(`/customers/edit/${params?.row?.id}`);
                  },
                  hide: !permissions?.customers?.edit,
                },
                {
                  icon: <DeleteOutlinedIcon color="error" />,
                  label: "Delete",
                  color: "error",
                  onClick: () => {
                    setRowData(params?.row);
                    setOpenRemove(true);
                  },
                  hide: !permissions?.customers?.delete,
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
            setFilterValues={setFilterValues}
            filterValues={filterValues}
            showCreateBtn={permissions?.customers?.create}
            AllCustomers={AllCustomers}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
          {Loading ? (
            <CircularProgress />
          ) : (
            <DataGrid
              //rows={DataTable || []}
              rows={
                CustomersData?.map((ele, i) => ({ ...ele, index: i })) || []
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
          let newData = deleteItemFromArray(CustomersData, RowData.index);
          setCustomersData(newData);
          setOpenRemove(false);
        }}
        // endpoint={API.customers}
        // itemId={RowData?._id}
        // setRefresh={setRefresh}
        // Refresh={Refresh}
      />
    </>
  );
}
export default Customers;
