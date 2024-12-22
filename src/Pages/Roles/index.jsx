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
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import RemoveDialog from "../../Components/RemoveDialog";
import { deleteItemFromArray } from "../../lib";

function Roles({ permissions }) {
  const navigate = useNavigate();
  const { setShowBackButton, RolesData, setRolesData } = useContext(AppContext);
  // const [DataTable, setDataTable] = useState([]);
  // const [AllDataTable, setAllDataTable] = useState([]);

  const [filterValues, setFilterValues] = useState({
    name: undefined,
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
  }, []);
  // useEffect(() => {
  //   setLoading(true);
  //   axiosInstance
  //     .get(API.roles_getall)
  //     .then((res) => {
  //       setTotalRecords(res?.data?.count);
  //       let data = res?.data?.data?.map((val) => ({
  //         ...val,
  //         id: val?._id,
  //       }));
  //       setPage(0);
  //       setDataTable([...data]);
  //       setAllDataTable([...data]);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       setTotalRecords(0);
  //       setDataTable([]);
  //       setAllDataTable([]);
  //       setLoading(false);
  //     });
  // }, [Refresh]);
  // useEffect(() => {
  //   if (filterValues.name) {
  //     let data = AllDataTable?.filter((ele) =>
  //       ele?.name?.toLowerCase().includes(filterValues.name)
  //     );
  //     setDataTable(data);
  //   } else {
  //     setDataTable(AllDataTable);
  //   }
  // }, [filterValues.name, AllDataTable]);

  const columns = [
    {
      field: "name",
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
          {!permissions?.roles?.edit && !permissions?.roles?.delete ? (
            <small>Not authorized</small>
          ) : (
            <ActionCellMenu
              menuItems={[
                {
                  icon: <BorderColorOutlinedIcon />,
                  label: "Edit",
                  onClick: () => {
                    navigate(`/management/roles/edit/${params?.row?.id}`);
                  },
                  hide: !permissions?.roles?.edit,
                },
                {
                  icon: <DeleteOutlinedIcon color="error" />,
                  label: "Delete",
                  color: "error",
                  onClick: () => {
                    setRowData(params?.row);
                    setOpenRemove(true);
                  },
                  hide: !permissions?.roles?.delete,
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
            showCreateBtn={permissions?.roles?.create}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
          {Loading ? (
            <CircularProgress />
          ) : (
            <DataGrid
              //rows={DataTable || []}
              rows={RolesData?.map((ele, i) => ({ ...ele, index: i })) || []}
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
          let newData = deleteItemFromArray(RolesData, RowData.index);
          setRolesData(newData);
          setOpenRemove(false);
        }}
        // endpoint={API.roles}
        // itemId={RowData?._id}
        // setRefresh={setRefresh}
        // Refresh={Refresh}
      />
    </>
  );
}
export default Roles;
