import axios from "../../axiosInstance";
import API from "../../api";

import {
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  InputAdornment,
  CircularProgress,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
// import LoadingButton from "@mui/lab/LoadingButton";
import { useState } from "react";

const imagebg = {
  backgroundImage: 'url("/images/login.png")',
  backgroundColor: "#cccccc",
  height: "100vh",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};
function Login() {
  const [Data, setData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [IsError, setIsError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onChange = (e) => {
    setIsError(false);
    const { name, value } = e.currentTarget;
    setData((prev) => ({ ...prev, [name]: value }));
  };
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };
  const AdminPermissions = {
    vehicles: {
      view: true,
      create: true,
      delete: true,
      edit: true,
    },
    orders: {
      view: true,
      create: true,
      delete: true,
      edit: true,
    },
    users: {
      view: true,
      create: true,
      delete: true,
      edit: true,
    },
    roles: {
      view: true,
      create: true,
      delete: true,
      edit: true,
    },
    customers: {
      view: true,
      create: true,
      delete: true,
      edit: true,
    },
    dashboard: {
      view: true,
    },
    reports: {
      view: true,
    },
    calendar: {
      view: true,
    },
  };
  const handleSubmit = () => {
    localStorage.setItem("name", Data.username);
    localStorage.setItem("role", "Admin");
    localStorage.setItem("permissions", JSON.stringify(AdminPermissions));
    localStorage.setItem("accessToken", "test");
    window.location.href = "/";

    // setLoading(true);
    // const data = {
    //   email: Data.username,
    //   password: Data.password,
    // };
    // axios
    //   .post(API.login, data)
    //   .then((res) => {
    //     setLoading(false);
    //     localStorage.setItem("name", res.data?.user?.name);
    //     localStorage.setItem("role", res.data?.user?.role?.name);
    //     localStorage.setItem(
    //       "permissions",
    //       JSON.stringify(res?.data?.user?.role?.permissions)
    //     );
    //     localStorage.setItem("accessToken", res.data.token);
    //     window.location.href = "/";
    //   })
    //   .catch((err) => {
    //     setLoading(false);
    //     setIsError(true);
    //   });
  };
  return (
    <>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 7 }}>
          <div style={imagebg} />
        </Grid>
        <Grid
          size={{ xs: 12, sm: 6, md: 5 }}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Stack
            direction="column"
            spacing={2}
            sx={{
              justifyContent: "center",
              alignItems: "flex-start",
              //   marginTop: "20%",
              width: "310px",
            }}
          >
            <Typography
              sx={{
                fontWeight: "700",
                lineHeight: "31.69px",
                fontFamily: "Montserrat",
              }}
              variant="h5"
            >
              Hello Again!
            </Typography>
            <Typography variant="subtitle1" sx={{ fontFamily: "Montserrat" }}>
              Welcome Back
            </Typography>
            <TextField
              label=""
              variant="outlined"
              size="medium"
              name="username"
              value={Data.username}
              onChange={onChange}
              fullWidth
              placeholder="Email Address"
              sx={{
                "& .MuiInputBase-input": {
                  background: "none !important",
                },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "30px",
                  "& fieldset": {
                    borderColor: "#EEEEEE",
                  },
                  "&:hover fieldset": {
                    borderColor: "#EEEEEE",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#EEEEEE",
                  },
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailOutlineIcon sx={{ color: "#EEEEEE" }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              label=""
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              variant="outlined"
              size="medium"
              name="password"
              value={Data.password}
              onChange={onChange}
              fullWidth
              placeholder="Password"
              sx={{
                "& .MuiInputBase-input": {
                  background: "none",
                },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "30px",
                  "& fieldset": {
                    borderColor: "#EEEEEE",
                  },
                  "&:hover fieldset": {
                    borderColor: "#EEEEEE",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#EEEEEE",
                  },
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "#EEEEEE" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                          showPassword
                            ? "hide the password"
                            : "display the password"
                        }
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            {IsError && (
              <Typography
                sx={{ color: "#DE0030", fontFamily: "Montserrat" }}
                variant="caption"
                display="block"
                gutterBottom
              >
                Invalid authentication username or password.
              </Typography>
            )}

            <Button
              variant="contained"
              onClick={handleSubmit}
              loading={loading}
              disabled={loading}
              color="secondary"
              fullWidth
              size="large"
              sx={{
                borderRadius: "30px",
                padding: "10px",
                textTransform: "capitalize",
              }}
            >
              {loading && (
                <CircularProgress
                  sx={{ width: "20px", height: "20px", marginRight: "20px" }}
                />
              )}
              Login
            </Button>
            <Typography
              sx={{
                width: "100%",
                lineHeight: "17px",
                color: "#333333",
                textAlign: "end",
                textTransform: "capitalize",
              }}
              variant="body2"
            >
              Forgot Password?
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}

export default Login;
