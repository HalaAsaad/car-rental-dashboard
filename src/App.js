import { Routes, Route, BrowserRouter } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import AppBar from "./Components/AppBar";
import Login from "./Pages/Login";
import {
  Vehicles,
  AddEditVehicle,
  VehicleDetails,
  VehicleMaintenance,
  AddEditTask,
} from "./Pages/Vehicles/route";
import { Users, AddEditUser } from "./Pages/Users/route";
import { Roles, AddEditRole } from "./Pages/Roles/route";
import {
  Customers,
  AddEditCustomer,
  CustomerDetails,
} from "./Pages/Customers/route";
import { Orders, CreateOrder, InspectOrder } from "./Pages/Orders/route";
import Report from "./Pages/Report";
import Dashboard from "./Pages/Dashboard";
import Calendar from "./Pages/Calendar";
import React, { Suspense } from "react";
import "./App.css";

const theme = {
  palette: {
    mode: "light",
    primary: { main: "#1A1919" },
    secondary: { main: "#1A75BB" },
    error: { main: "#EF0A0A" },
    success: { main: "#0F930F" },
  },
  typography: {
    fontFamily: [
      "Montserrat",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
  card_title: {
    fontSize: "20px",
    fontWeight: 700,
    lineHeight: "30px",
    letterSpacing: "-0.03em",
    textAlign: "left",
    color: "#191919",
    marginBottom: "7px",
  },
  card_sub_title: {
    fontSize: "14px",
    fontWeight: 500,
    lineHeight: "21px",
    letterSpacing: "-0.02em",
    textAlign: "left",
    color: "#808080",
  },
  field_label: {
    fontSize: "16px",
    fontWeight: 600,
    lineHeight: "24px",
    letterSpacing: "-0.02em",
    textAlign: "left",
    color: "#1A202C",
    marginBottom: "10px",
  },
  // .MuiFormLabel-root {
  //   font-family: Inter;
  //   font-size: 16px;
  //   font-weight: 400;
  //   line-height: 24px;
  //   text-align: left;
  //   color: #656575;
  // }
};

// const HomeComponent = React.lazy(() => import('./Apps/Home'));
function App() {
  const accessToken = localStorage.getItem("accessToken");
  const permissions = JSON.parse(localStorage.getItem("permissions"));
  // console.log("permissions ", JSON.parse(permissions));

  return (
    <BrowserRouter>
      <ThemeProvider theme={createTheme(theme)}>
        <CssBaseline enableColorScheme />
        {accessToken ? (
          <AppBar permissions={permissions}>
            <div className="App">
              <Suspense
                fallback={
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                  </Box>
                }
              >
                <Routes>
                  <Route
                    index
                    element={
                      permissions?.dashboard?.view ? (
                        <Dashboard permissions={permissions} />
                      ) : (
                        <>Not authorized</>
                      )
                    }
                  />
                  <Route
                    path="/vehicles"
                    element={
                      permissions?.vehicles?.view ? (
                        <Vehicles permissions={permissions} />
                      ) : (
                        <>Not authorized</>
                      )
                    }
                  />
                  <Route
                    path="/vehicles/add"
                    element={
                      permissions?.vehicles?.create ||
                      permissions?.vehicles?.edit ? (
                        <AddEditVehicle />
                      ) : (
                        <>Not authorized</>
                      )
                    }
                  />
                  <Route
                    path="/vehicles/edit/:name"
                    element={<AddEditVehicle />}
                  />
                  <Route
                    path="/vehicles/details/:name"
                    element={<VehicleDetails />}
                  />
                  <Route
                    path="/vehicles/maintenance/:name"
                    element={<VehicleMaintenance />}
                  />
                  <Route
                    path="/vehicles/maintenance/:name/add-task"
                    element={<AddEditTask />}
                  />
                  <Route
                    path="/vehicles/maintenance/:name/edit-task/:taskId"
                    element={<AddEditTask />}
                  />

                  <Route
                    path="/management/users"
                    element={
                      permissions?.users?.view ? (
                        <Users permissions={permissions} />
                      ) : (
                        <>Not authorized</>
                      )
                    }
                  />
                  <Route
                    path="/management/users/add"
                    element={<AddEditUser />}
                  />
                  <Route
                    path="/management/users/edit/:name"
                    element={<AddEditUser />}
                  />

                  <Route
                    path="/management/roles"
                    element={
                      permissions?.roles?.view ? (
                        <Roles permissions={permissions} />
                      ) : (
                        <>Not authorized</>
                      )
                    }
                  />
                  <Route
                    path="/management/roles/add"
                    element={<AddEditRole />}
                  />
                  <Route
                    path="/management/roles/edit/:name"
                    element={<AddEditRole />}
                  />

                  <Route
                    path="/customers"
                    element={
                      permissions?.customers?.view ? (
                        <Customers permissions={permissions} />
                      ) : (
                        <>Not authorized</>
                      )
                    }
                  />
                  <Route path="/customers/add" element={<AddEditCustomer />} />
                  <Route
                    path="/customers/edit/:name"
                    element={<AddEditCustomer />}
                  />
                  <Route
                    path="/customers/details/:name"
                    element={<CustomerDetails />}
                  />

                  <Route
                    path="/orders"
                    element={
                      permissions?.orders?.view ? (
                        <Orders permissions={permissions} />
                      ) : (
                        <>Not authorized</>
                      )
                    }
                  />
                  <Route
                    path="/orders/create"
                    element={
                      permissions?.orders?.create ? (
                        <CreateOrder />
                      ) : (
                        <>Not authorized</>
                      )
                    }
                  />
                  <Route path="/orders/inspect" element={<InspectOrder />} />
                  <Route
                    path="/orders/view/:name"
                    element={<InspectOrder permissions={permissions} />}
                  />

                  <Route
                    path="/report"
                    element={
                      permissions?.reports?.view ? (
                        <Report permissions={permissions} />
                      ) : (
                        <>Not authorized</>
                      )
                    }
                  />
                  <Route
                    path="/calendar"
                    element={
                      permissions?.calendar?.view ? (
                        <Calendar permissions={permissions} />
                      ) : (
                        <>Not authorized</>
                      )
                    }
                  />

                  <Route path="/*" element={<>Not found</>} />
                </Routes>
              </Suspense>
            </div>
          </AppBar>
        ) : (
          <Routes>
            <Route index element={<Login />} />
            <Route path="login" element={<Login />} />
            <Route path="*" element={<Login />} />
          </Routes>
        )}
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
