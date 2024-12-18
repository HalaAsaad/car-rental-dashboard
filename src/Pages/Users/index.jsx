import React, { useState, useEffect, useContext } from "react";
import axiosInstance from "../../axiosInstance";
import API from "../../api";
import Filter from "./Filter";
import ActionCellMenu from "../../Components/ActionCellMenu";
import { AppContext } from "../../Context/AppContext";

import { CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { DataGrid } from "@mui/x-data-grid/DataGrid/DataGrid";
import {
  ConnectedTv as ConnectedTvIcon,
  BorderColorOutlined as BorderColorOutlinedIcon,
  DeleteOutlined as DeleteOutlinedIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import StateBody from "../../Components/Columns/StateBody";
import RemoveDialog from "../../Components/RemoveDialog";

function Users({ permissions }) {
  const navigate = useNavigate();
  const { setShowBackButton } = useContext(AppContext);
  const [DataTable, setDataTable] = useState([]);
  const [filterValues, setFilterValues] = useState({
    name: undefined,
    status: [],
  });
  const [OpenRemove, setOpenRemove] = useState(false);
  const [OpenActivate, setOpenActivate] = useState(false);
  const [RowData, setRowData] = useState({});
  const [Refresh, setRefresh] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [Loading, setLoading] = useState(false);
  const [FilterData, setFilterData] = useState({
    status: "", // [],
  });

  useEffect(() => {
    setShowBackButton(false);
  }, []);
  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(API.users_getall, {
        params: {
          name: filterValues?.name,
          state: filterValues?.status, //filterValues?.status?.join(","),
        },
      })
      .then((res) => {
        setTotalRecords(res?.data?.count);
        let data = res?.data?.data?.map((val) => ({
          ...val,
          id: val?._id,
          role_name: val?.role?.name || "",
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
  useEffect(() => {
    axiosInstance.get(API.users_getall).then((res) => {
      let data = res?.data?.data?.map((val) => ({
        ...val,
        id: val?._id,
        role_name: val?.role?.name || "",
      }));
      setFilterData({
        status: [...new Set(data?.map((ele) => ele?.state))],
      });
    });
  }, [Refresh]);
  const colors = {
    active: "#0F930F",
    inactive: "#EF0A0A",
  };
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
      editable: true,
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
      editable: true,
      //renderEditCell: (params) => <CustomTypeEditComponent {...params} />,
    },
    {
      field: "mobile",
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
      field: "role_name",
      headerName: "Role",
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
      field: "state",
      headerName: "State",
      align: "left",
      headerAlign: "left",
      flex: 1,
      hideSortIcons: false,
      sortable: true,
      disableColumnMenu: true,
      renderCell: (params) => (
        <StateBody
          color={colors[params?.row?.state]}
          value={params?.row?.state}
        />
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
      display: false,
      renderCell: (params) => (
        <>
          {!permissions?.users?.edit && !permissions?.users?.delete ? (
            <small>Not authorized</small>
          ) : (
            <ActionCellMenu
              menuItems={[
                {
                  icon: <BorderColorOutlinedIcon />,
                  label: "Edit",
                  onClick: () => {
                    navigate(`/management/users/edit/${params?.row?._id}`);
                  },
                  hide: !permissions?.users?.edit,
                },
                {
                  icon: (
                    <ConnectedTvIcon
                      sx={{
                        color:
                          params?.row?.state === "active"
                            ? colors["inactive"]
                            : colors["active"],
                      }}
                    />
                  ),
                  label:
                    params?.row?.state === "active" ? "Inactive" : "Active",
                  onClick: () => {
                    setRowData(params?.row);
                    setOpenActivate(true);
                  },
                  hide: !permissions?.users?.edit,
                },
                {
                  icon: <DeleteOutlinedIcon color="secondary" />,
                  label: "Delete",
                  color: "secondary",
                  onClick: () => {
                    setRowData(params?.row);
                    setOpenRemove(true);
                  },
                  hide: !permissions?.users?.delete,
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
            FilterData={FilterData}
            showCreateBtn={permissions?.users?.create}
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
        endpoint={API.users}
        itemId={RowData?._id}
        setRefresh={setRefresh}
        Refresh={Refresh}
      />

      <RemoveDialog
        open={OpenActivate}
        setOpen={setOpenActivate}
        message={
          RowData?.state === "active"
            ? "Are you sure to inactive item?"
            : "Are you sure to active item?"
        }
        itemId={RowData?._id}
        applyLabel="Apply"
        handleSave={() => {
          axiosInstance
            .put(API.users + `/${RowData?._id}`, {
              state: RowData?.state === "active" ? "inactive" : "active",
            })
            .then((res) => {
              setOpenActivate(false);
              setRefresh(!Refresh);
            });
        }}
      />
    </>
  );
}
export default Users;
