import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import {
  Divider,
  Toolbar,
  CssBaseline,
  Box,
  Stack,
  Button,
  IconButton,
  Avatar,
  Badge,
  Tooltip,
  List,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Typography,
  Menu,
  MenuItem,
  MenuList,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Logout as LogoutIcon,
  GridView as GridViewIcon,
  DirectionsCar as DirectionsCarIcon,
  SupervisorAccount as SupervisorAccountIcon,
  TextSnippetOutlined as TextSnippetOutlinedIcon,
  DvrOutlined as DvrOutlinedIcon,
  ManageAccountsOutlined as ManageAccountsOutlinedIcon,
  CalendarMonthOutlined as CalendarMonthOutlinedIcon,
  NotificationsNoneOutlined as NotificationsNoneOutlinedIcon,
  ArrowBackOutlined as ArrowBackOutlinedIcon,
} from "@mui/icons-material";

import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import Notifications from "./Notifications";
import axiosInstance from "../../axiosInstance";
import axios from "axios";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: "0px", // `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),

  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  backgroundColor: "#fff",
  zIndex: theme.zIndex.drawer,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  boxShadow: "none",
  borderBottom: "1px solid #E6F0F0",
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => () => {
  // console.log("theme ", theme);
  return {
    width: !open ? "0px" : drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    textDecoration: "none",
    ...(open && {
      ...openedMixin(theme),
      "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": closedMixin(theme),
      width: !open ? "0px" : drawerWidth,
    }),
    "& .MuiDrawer-paper": {
      backgroundColor: theme.palette.primary.main,
      color: "#fff",
      width: !open ? "0px" : drawerWidth,
    },
    borderRadius: "0px !important",
  };
});

export default function MiniDrawer(props) {
  const { children, permissions } = props;
  const { ShowBackButton, NavigationBackURL } = React.useContext(AppContext);

  const userName = localStorage.getItem("name");
  const role = localStorage.getItem("role");
  // console.log("permissions ", permissions);

  const theme = useTheme();
  const navigate = useNavigate();
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = React.useState(
    true
    //isTablet ? false : true
    // window.innerWidth > theme.breakpoints.values.sm ? true : false
  );
  const [notifications, setNotifications] = React.useState([]);
  const [NotReaddCount, setNotReaddCount] = React.useState(0);
  const [NotReaddCountInside, setNotReaddCountInside] = React.useState(0);
  const [link, setLink] = React.useState("/");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openAlert = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  React.useEffect(() => {
    if (ShowBackButton || isTablet) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [ShowBackButton, window.location.pathname, isTablet]);
  React.useEffect(() => {
    axiosInstance.get("/notifications").then((res) => {
      let data = res?.data?.data;
      setNotifications(data || []);
      setNotReaddCount(data?.filter((ele) => ele?.isRead === false)?.length);
      setNotReaddCountInside(
        data?.filter((ele) => ele?.isRead === false)?.length
      );
    });
  }, []);
  React.useEffect(() => {
    let findIsNotRead = notifications?.find((ele) => ele?.isRead === false);
    if (openAlert !== null && findIsNotRead) {
      let allRequests = notifications
        ?.filter((ele) => ele?.isRead === false)
        ?.map((ele) => axiosInstance.put(`/notifications/${ele?._id}/read`));
      axios
        .all(allRequests)
        .then(
          axios.spread((...responses) => {
            // const responseOne = responses[0];
            axiosInstance.get("/notifications").then((res) => {
              let data = res?.data?.data;
              setNotifications(data || []);
              setNotReaddCount(
                data?.filter((ele) => ele?.isRead === false)?.length
              );
            });
          })
        )
        .catch((errors) => {
          console.log(errors);
        });
    }
  }, [openAlert, Notifications]);

  const listItems = [
    {
      to: "/",
      icon: true,
      // img: `${process.env.PUBLIC_URL}/images/xx.svg`,
      iconComp: <GridViewIcon sx={{ color: "#fff" }} />,
      lable: "Dashboard",
      hide: !permissions?.dashboard?.view,
    },
    {
      to: "/vehicles",
      // img: `${process.env.PUBLIC_URL}/images/xx.svg`,
      iconComp: <DirectionsCarIcon sx={{ color: "#fff" }} />,
      icon: true,
      lable: "Vehicles",
      hide: !permissions?.vehicles?.view,
    },
    {
      to: "/management/users",
      // img: `${process.env.PUBLIC_URL}/images/xx.svg`,
      iconComp: <ManageAccountsOutlinedIcon sx={{ color: "#fff" }} />,
      icon: true,
      lable: "Management",
      links: ["/management/users", "/management/roles"],
      hide: !permissions?.users?.view && !permissions?.roles?.view,
      items: [
        {
          to: "/management/users",
          label: "Users",
          hide: !permissions?.users?.view,
        },
        {
          to: "/management/roles",
          label: "Roles",
          hide: !permissions?.roles?.view,
        },
      ],
    },
    {
      to: "/customers",
      // img: `${process.env.PUBLIC_URL}/images/xx.svg`,
      iconComp: <SupervisorAccountIcon sx={{ color: "#fff" }} />,
      icon: true,
      lable: "Customers",
      hide: !permissions?.customers?.view,
    },
    {
      to: "/orders",
      // img: `${process.env.PUBLIC_URL}/images/xx.svg`,
      iconComp: <DvrOutlinedIcon sx={{ color: "#fff" }} />,
      icon: true,
      lable: "Orders",
      hide: !permissions?.orders?.view,
    },
    {
      to: "/report",
      iconComp: <TextSnippetOutlinedIcon sx={{ color: "#fff" }} />,
      icon: true,
      lable: "Car Report",
      hide: !permissions?.reports?.view,
    },
    {
      to: "/calendar",
      // img: `${process.env.PUBLIC_URL}/images/xx.svg`,
      iconComp: <CalendarMonthOutlinedIcon sx={{ color: "#fff" }} />,
      icon: true,
      lable: "Calendar",
      hide: !permissions?.calendar?.view,
    },
  ];

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  return (
    <Box sx={{ display: "flex", height: "100%" }}>
      <CssBaseline />
      <AppBar
        sx={{
          pr: open ? 1 : !open && isTablet ? 1 : { lg: 1, xl: 17 },
          pl: open ? 1 : !open && isTablet ? 1 : { lg: 1, xl: 17 },
          borderRadius: "0px !important",
        }}
        position="fixed"
        open={open}
      >
        <Toolbar>
          <Stack
            direction={{ xs: "row", sm: "row" }}
            justifyContent="space-between"
            alignItems="center"
            sx={{ width: 1 }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {/* <img
                src={`${process.env.PUBLIC_URL}/images/Cognitive_Neuron_Outlined.svg`}
                alt=""
              /> */}
              <IconButton
                color="primary"
                aria-label="open drawer"
                onClick={open ? handleDrawerClose : handleDrawerOpen}
                edge="start"
                sx={{
                  [theme.breakpoints.up("md")]: {
                    display: "none",
                  },
                }}
                //  sx={{ marginRight: 5, ...(open && { display: "none" }) }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                sx={{
                  fontSize:
                    window.innerWidth > theme.breakpoints.values.sm
                      ? "24px"
                      : "14px",
                  fontWeight: "600",
                  lineHeight: "31.69px",
                  color: "#333333",
                  whiteSpace: "nowrap",
                  textAlign: "center",
                }}
                color="primary"
              >
                {ShowBackButton ? (
                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    sx={{ color: "secondary.main", cursor: "pointer" }}
                    onClick={() => {
                      if (NavigationBackURL?.to) {
                        navigate(NavigationBackURL?.to, {
                          state: NavigationBackURL?.state || {},
                        });
                      } else {
                        navigate(-1);
                      }
                    }}
                  >
                    <ArrowBackOutlinedIcon color="secondary" /> Back
                  </Box>
                ) : (
                  `Hi, ${userName}`
                )}
              </Typography>
            </Box>
            <Stack alignItems={"center"} direction="row" spacing={2}>
              <Tooltip title="Notifications">
                <Badge badgeContent={NotReaddCount} color="secondary">
                  <NotificationsNoneOutlinedIcon
                    color="action"
                    sx={{ cursor: "pointer" }}
                    aria-controls={openAlert ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={openAlert ? "true" : undefined}
                    onClick={handleClick}
                  />
                </Badge>
              </Tooltip>
              <Avatar alt="photo" src="/images/user.png" />
              <Stack direction="column" spacing={0.2}>
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: "500",
                    lineHeight: "18px",
                    color: "#808080",
                  }}
                  color="primary"
                >
                  {role}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: "600",
                    lineHeight: "21px",
                    color: "#01150C",
                  }}
                  color="primary"
                >
                  {userName}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        open={open}
        sx={{ "& .MuiPaper-root": { borderRadius: "0px !important" } }}
      >
        <DrawerHeader sx={{ borderRadius: "0px !important" }}>
          <img
            style={{ margin: "0 auto", height: "130px", width: "130px" }}
            src={"/car-rental_2389246.png"}
            alt=""
          />
          <IconButton
            sx={{
              [theme.breakpoints.up("md")]: {
                display: "none",
              },
            }}
            onClick={open ? handleDrawerClose : handleDrawerOpen}
          >
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List className="list-sidebar">
          {listItems
            ?.filter((ele) => !ele.hide)
            ?.map((ele, i) => (
              <Link
                to={ele.to}
                key={i}
                style={{ textDecoration: "unset" }}
                onClick={() => setLink(ele)}
              >
                <ListItemButton
                  sx={{
                    flexGrow: 1,
                    backgroundColor:
                      ele.to === window.location.pathname ||
                      ele?.links?.includes(window.location.pathname)
                        ? // window.location.pathname.includes(ele.to)
                          theme.palette.secondary.main
                        : theme.palette.primary.main,
                    margin: "0 25px 0px 10px",
                    borderRadius: "4px",
                    ":hover": {
                      backgroundColor: theme.palette.secondary.main,
                    },
                    // borderLeft: "3px solid #fff",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {ele.icon ? (
                      ele?.iconComp
                    ) : (
                      <img
                        className="sidebar-icon"
                        src={ele.img}
                        width="30px"
                      />
                    )}
                    {/* <img className="sidebar-icon" src={ele.img} width="30px" /> */}
                  </ListItemIcon>
                  <ListItemText
                    primary={ele.lable}
                    sx={{ opacity: open ? 1 : 0, color: "#fff" }}
                  />
                </ListItemButton>
                {link?.items?.length > 0 && ele?.to === link.to && (
                  <Stack direction={"column"} spacing={1}>
                    {link?.items
                      ?.filter((ele) => !ele.hide)
                      ?.map((val, i) => (
                        <Link
                          to={val.to}
                          key={i}
                          style={{ textDecoration: "unset" }}
                        >
                          <Typography
                            sx={{
                              color: "#fff",
                              margin: "0 25px 0px 10px",
                              padding: "5px 15px 0px",
                              marginTop: "3px",
                              borderRadius: "1px",
                              borderLeft:
                                val.to === window.location.pathname
                                  ? `2px solid ${theme.palette.secondary.main}`
                                  : `2px solid ${theme.palette.primary.main}`,
                            }}
                          >
                            {val.label}
                          </Typography>
                        </Link>
                      ))}
                  </Stack>
                )}
              </Link>
            ))}
        </List>
        <Box sx={{ marginTop: "40px" }}>
          <ListItemButton
            sx={{
              flexGrow: 1,
              backgroundColor: "gray",
              margin: "0 25px 0px 10px",
              borderRadius: "4px",
              ":hover": {
                backgroundColor: theme.palette.secondary.main,
              },
              // borderLeft: "3px solid #fff",
            }}
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : "auto",
                justifyContent: "center",
              }}
            >
              <LogoutIcon
                sx={{ flexGrow: 1, transform: "rotate(180deg)", color: "#fff" }}
              />
            </ListItemIcon>
            <ListItemText
              primary={"Logout"}
              sx={{ opacity: open ? 1 : 0, color: "#fff" }}
            />
          </ListItemButton>
        </Box>
      </Drawer>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={openAlert}
        onClose={handleClose}
        // onClick={handleClose}
        sx={{
          "& .MuiPaper-root": {
            width: "370px",
            height: notifications?.length > 5 ? "520px" : "450px",
            overflowY: "auto",
            // left: 1500,
            // padding: "10px",
            boxShadow: "0px 4px 12px 0px #0000001F !important",
            // boxShadow: "0px 0px 44px 0px #00000014 !important",
            paddingBottom: "0px",
          },
          "& .MuiList-root": {
            height: "100%",
          },
        }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Notifications
          notifications={notifications}
          NotReaddCountInside={NotReaddCountInside}
        />
        {/* <MenuItem onClick={handleClose}> </MenuItem> */}
      </Menu>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pr: open ? 3 : !open && isTablet ? 1 : { lg: 3, xl: 20 },
          pl: open ? 3 : !open && isTablet ? 1 : { lg: 3, xl: 20 },
          pt: 3,
          bgcolor: "#FAFAFA",
          overflow: "auto",
          height: "100%",
        }}
      >
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}
