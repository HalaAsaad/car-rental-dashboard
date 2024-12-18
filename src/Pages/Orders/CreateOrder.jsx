import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  Card,
  CircularProgress,
  Pagination,
  Checkbox,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  Select,
  MenuItem,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import API from "../../api";
import { AppContext } from "../../Context/AppContext";
import { addCommas } from "../../lib";
import VehiclesFilter from "../Vehicles/Filter";
import CustomersFilter from "../Customers/Filter";
import { Calendar } from "react-multi-date-picker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useTheme } from "@mui/material/styles";
import "./index.css";
import { DatePicker } from "@mui/x-date-pickers";

const data = [
  {
    _id: "673bc2310f16e58a118f1fb3",
    carId: "DCWA-680",
    vinNumber: "KMHLN4AJ4MU009226",
    brand: "HYUNDAI",
    model: "ELENTRA",
    color: "BLACK",
    mileage: 50000,
    year: 2021,
    rentalPrice: 350,
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
    IsMaintenace: false,
    maintenanceTasks: [
      {
        title: "Testt",
        nextReminderDate: "2024-11-18T22:00:00.000Z",
        status: "pending",
        _id: "673cfb181b6a656a7570e26f",
      },
    ],
    rentalHistory: [],
    createdAt: "2024-11-18T22:39:45.451Z",
    updatedAt: "2024-11-19T21:19:50.547Z",
    __v: 2,
  },
  {
    _id: "673bc30c0f16e58a118f1ffd",
    carId: "DCWA-763",
    vinNumber: "2HGFE1F93NH004085",
    brand: "HONDA",
    model: "CIVIC TOURING",
    color: "GREY",
    mileage: 50000,
    year: 2022,
    rentalPrice: 350,
    state: "available",
    media: [
      {
        url: "https://res.cloudinary.com/beirut-mart/image/upload/v1731969803/skyline-car-rental-media/tzhgwo8zwr0nob8vny9v.jpg",
        public_id: "skyline-car-rental-media/tzhgwo8zwr0nob8vny9v",
        resource_type: "image",
        _id: "673bc30c0f16e58a118f1ffe",
      },
    ],
    isRented: false,
    IsMaintenace: false,
    maintenanceTasks: [],
    rentalHistory: [],
    createdAt: "2024-11-18T22:43:24.249Z",
    updatedAt: "2024-11-19T20:41:49.668Z",
    __v: 0,
  },
  {
    _id: "673bc39c0f16e58a118f2012",
    carId: "DCWA-583",
    vinNumber: "KMHLM4AG5NU341149",
    brand: "HYUNDAI",
    model: "ELENTRA",
    color: "WHITE",
    mileage: 50000,
    year: 2022,
    rentalPrice: 350,
    state: "available",
    media: [
      {
        url: "https://res.cloudinary.com/beirut-mart/image/upload/v1731969948/skyline-car-rental-media/xckhdtklqcblj15e1skg.jpg",
        public_id: "skyline-car-rental-media/xckhdtklqcblj15e1skg",
        resource_type: "image",
        _id: "673bc39c0f16e58a118f2013",
      },
    ],
    isRented: true,
    IsMaintenace: false,
    maintenanceTasks: [],
    rentalHistory: [
      {
        orderId: {
          _id: "673d03491b6a656a7570e951",
          customer: {
            _id: "673d021c1b6a656a7570e8d4",
            name: "AHMAD",
          },
          state: "pending",
          cars: [
            {
              pickupDateTime: "2024-11-20T05:35:27.684Z",
              returnDateTime: "2024-11-28T05:25:27.684Z",
              totalPrice: 2800,
            },
          ],
        },
        orderDate: "2024-11-19T21:29:45.426Z",
        _id: "673d03491b6a656a7570e957",
      },
    ],
    createdAt: "2024-11-18T22:45:48.811Z",
    updatedAt: "2024-11-20T12:31:39.429Z",
    __v: 0,
  },
  {
    _id: "673bc42e0f16e58a118f2029",
    carId: "DCWA-793",
    vinNumber: "3MW5R7J00M8B60147",
    brand: "BMW",
    model: "SERIES 3",
    color: "BLACK",
    mileage: 70000,
    year: 2021,
    rentalPrice: 80,
    state: "available",
    media: [
      {
        url: "https://res.cloudinary.com/beirut-mart/image/upload/v1731970094/skyline-car-rental-media/rxcdx68cm0twvijxjiyf.jpg",
        public_id: "skyline-car-rental-media/rxcdx68cm0twvijxjiyf",
        resource_type: "image",
        _id: "673bc42e0f16e58a118f202a",
      },
    ],
    isRented: false,
    IsMaintenace: false,
    maintenanceTasks: [],
    rentalHistory: [],
    createdAt: "2024-11-18T22:48:14.811Z",
    updatedAt: "2024-11-19T20:42:13.906Z",
    __v: 0,
  },
  {
    _id: "673bc4ce0f16e58a118f2042",
    carId: "DCWM-040",
    vinNumber: "2HGFE2F20PH110506",
    brand: "HONDA",
    model: "CIVIC",
    color: "BLACK",
    mileage: 50000,
    year: 2020,
    rentalPrice: 350,
    state: "available",
    media: [
      {
        url: "https://res.cloudinary.com/beirut-mart/image/upload/v1731970254/skyline-car-rental-media/l3zroofjilhwruoxzqsp.jpg",
        public_id: "skyline-car-rental-media/l3zroofjilhwruoxzqsp",
        resource_type: "image",
        _id: "673bc4ce0f16e58a118f2043",
      },
    ],
    isRented: false,
    IsMaintenace: false,
    maintenanceTasks: [],
    rentalHistory: [],
    createdAt: "2024-11-18T22:50:54.971Z",
    updatedAt: "2024-11-19T20:42:24.386Z",
    __v: 0,
  },
  {
    _id: "673bc54a0f16e58a118f205d",
    carId: "DCWM-011",
    vinNumber: "KMHLN4AG7MU064841",
    brand: "HYUNDAI",
    model: "ELENTRA",
    color: "GREY",
    mileage: 50000,
    year: 2021,
    rentalPrice: 350,
    state: "available",
    media: [
      {
        url: "https://res.cloudinary.com/beirut-mart/image/upload/v1731970377/skyline-car-rental-media/ok5ixh5smhz2n3kdzpyg.jpg",
        public_id: "skyline-car-rental-media/ok5ixh5smhz2n3kdzpyg",
        resource_type: "image",
        _id: "673bc54a0f16e58a118f205e",
      },
    ],
    isRented: false,
    IsMaintenace: false,
    maintenanceTasks: [],
    rentalHistory: [],
    createdAt: "2024-11-18T22:52:58.011Z",
    updatedAt: "2024-11-19T21:22:13.265Z",
    __v: 0,
  },
  {
    _id: "673bc60f0f16e58a118f20b3",
    carId: "DCWM-009",
    vinNumber: "1HGCY2F88PA801229",
    brand: "HONDA",
    model: "ACCORD",
    color: "SKY BLUE",
    mileage: 100000,
    year: 2023,
    rentalPrice: 350,
    state: "available",
    media: [
      {
        url: "https://res.cloudinary.com/beirut-mart/image/upload/v1731970574/skyline-car-rental-media/trmii2wrrusxnlrugtzh.jpg",
        public_id: "skyline-car-rental-media/trmii2wrrusxnlrugtzh",
        resource_type: "image",
        _id: "673bc60f0f16e58a118f20b4",
      },
    ],
    isRented: false,
    IsMaintenace: false,
    maintenanceTasks: [],
    rentalHistory: [],
    createdAt: "2024-11-18T22:56:15.050Z",
    updatedAt: "2024-11-19T20:42:55.026Z",
    __v: 0,
  },
  {
    _id: "673bc6ad0f16e58a118f20d2",
    carId: "DCWM-029",
    vinNumber: "2T3R1RFV1NC305491",
    brand: "TOYOTA",
    model: "RAV4",
    color: "WHITE",
    mileage: 50000,
    year: 2022,
    rentalPrice: 350,
    state: "available",
    media: [
      {
        url: "https://res.cloudinary.com/beirut-mart/image/upload/v1731970732/skyline-car-rental-media/v6sgvnrf3rkzkbyb9b49.jpg",
        public_id: "skyline-car-rental-media/v6sgvnrf3rkzkbyb9b49",
        resource_type: "image",
        _id: "673bc6ad0f16e58a118f20d3",
      },
    ],
    isRented: false,
    IsMaintenace: false,
    maintenanceTasks: [],
    rentalHistory: [],
    createdAt: "2024-11-18T22:58:53.129Z",
    updatedAt: "2024-11-19T20:43:09.427Z",
    __v: 0,
  },
  {
    _id: "673bc75c0f16e58a118f20f9",
    carId: "DCWA-788",
    vinNumber: "2HGFC2F59LH015730",
    brand: "HONDA",
    model: "CIVIC ",
    color: "BLACK",
    mileage: 50000,
    year: 2023,
    rentalPrice: 350,
    state: "available",
    media: [
      {
        url: "https://res.cloudinary.com/beirut-mart/image/upload/v1731970907/skyline-car-rental-media/yjfph7b1cwqps0llr5ri.jpg",
        public_id: "skyline-car-rental-media/yjfph7b1cwqps0llr5ri",
        resource_type: "image",
        _id: "673bc75c0f16e58a118f20fa",
      },
    ],
    isRented: false,
    IsMaintenace: false,
    maintenanceTasks: [],
    rentalHistory: [],
    createdAt: "2024-11-18T23:01:48.165Z",
    updatedAt: "2024-11-19T20:43:21.428Z",
    __v: 0,
  },
  {
    _id: "673bc8270f16e58a118f211c",
    carId: "DCWM-349",
    vinNumber: "1G1ZD5ST4NF111874",
    brand: "CHEVROLIT",
    model: "MALIBU",
    color: "WHITE",
    mileage: 50000,
    year: 2022,
    rentalPrice: 350,
    state: "available",
    media: [
      {
        url: "https://res.cloudinary.com/beirut-mart/image/upload/v1731971111/skyline-car-rental-media/x2xtcytqbakvv4huztnf.jpg",
        public_id: "skyline-car-rental-media/x2xtcytqbakvv4huztnf",
        resource_type: "image",
        _id: "673bc8270f16e58a118f211d",
      },
    ],
    isRented: false,
    IsMaintenace: false,
    maintenanceTasks: [],
    rentalHistory: [],
    createdAt: "2024-11-18T23:05:11.530Z",
    updatedAt: "2024-11-19T20:43:30.708Z",
    __v: 0,
  },
  {
    _id: "673bc9090f16e58a118f2141",
    carId: "DCWM-198",
    vinNumber: "KMHLM4AG8NU215710",
    brand: "HYUNDAI",
    model: "ELENTRA",
    color: "GREY",
    mileage: 50000,
    year: 2023,
    rentalPrice: 350,
    state: "available",
    media: [
      {
        url: "https://res.cloudinary.com/beirut-mart/image/upload/v1731971337/skyline-car-rental-media/px0jb3oz75jxovncqbat.jpg",
        public_id: "skyline-car-rental-media/px0jb3oz75jxovncqbat",
        resource_type: "image",
        _id: "673bc9090f16e58a118f2142",
      },
    ],
    isRented: false,
    IsMaintenace: false,
    maintenanceTasks: [],
    rentalHistory: [],
    createdAt: "2024-11-18T23:08:57.849Z",
    updatedAt: "2024-11-19T20:43:47.748Z",
    __v: 0,
  },
  {
    _id: "673bca390f16e58a118f2168",
    carId: "DCWM-650",
    vinNumber: "5NPEG4JAXMH120221",
    brand: "HYUNDAI",
    model: "SONATA",
    color: "WHITE",
    mileage: 50000,
    year: 2021,
    rentalPrice: 350,
    state: "available",
    media: [
      {
        url: "https://res.cloudinary.com/beirut-mart/image/upload/v1731971640/skyline-car-rental-media/lqzp4tefs3rwzo5qy9ry.jpg",
        public_id: "skyline-car-rental-media/lqzp4tefs3rwzo5qy9ry",
        resource_type: "image",
        _id: "673bca390f16e58a118f2169",
      },
    ],
    isRented: false,
    IsMaintenace: false,
    maintenanceTasks: [],
    rentalHistory: [],
    createdAt: "2024-11-18T23:14:01.047Z",
    updatedAt: "2024-11-19T20:43:57.905Z",
    __v: 0,
  },
  {
    _id: "673bcaac0f16e58a118f2191",
    carId: "DCWM-574",
    vinNumber: "2HGFC2F77LH032219",
    brand: "HONDA",
    model: "CIVIC",
    color: "BLACK",
    mileage: 50000,
    year: 2020,
    rentalPrice: 350,
    state: "available",
    media: [
      {
        url: "https://res.cloudinary.com/beirut-mart/image/upload/v1731971753/skyline-car-rental-media/y18tmkmrpolillenretn.jpg",
        public_id: "skyline-car-rental-media/y18tmkmrpolillenretn",
        resource_type: "image",
        _id: "673bcaac0f16e58a118f2192",
      },
    ],
    isRented: false,
    IsMaintenace: false,
    maintenanceTasks: [],
    rentalHistory: [],
    createdAt: "2024-11-18T23:15:56.167Z",
    updatedAt: "2024-11-19T20:44:11.346Z",
    __v: 0,
  },
  {
    _id: "673bcb5d0f16e58a118f21c0",
    carId: "DCWM-454",
    vinNumber: "1C4RJHBG9N8602370",
    brand: "JEEP",
    model: " GRAND CHEROKI",
    color: "WHITE",
    mileage: 50000,
    year: 2022,
    rentalPrice: 100,
    state: "available",
    media: [
      {
        url: "https://res.cloudinary.com/beirut-mart/image/upload/v1731971932/skyline-car-rental-media/ekzkghmrusahiizcbmnk.jpg",
        public_id: "skyline-car-rental-media/ekzkghmrusahiizcbmnk",
        resource_type: "image",
        _id: "673bcb5d0f16e58a118f21c1",
      },
    ],
    isRented: false,
    IsMaintenace: false,
    maintenanceTasks: [],
    rentalHistory: [],
    createdAt: "2024-11-18T23:18:53.369Z",
    updatedAt: "2024-11-19T20:44:23.827Z",
    __v: 0,
  },
  {
    _id: "673bcbd20f16e58a118f21ed",
    carId: "DCWM-665",
    vinNumber: "KMHLN2DG2RU701721",
    brand: "HYUNDAI",
    model: "ELENTRA",
    color: "GREY",
    mileage: 50000,
    year: 2024,
    rentalPrice: 350,
    state: "available",
    media: [
      {
        url: "https://res.cloudinary.com/beirut-mart/image/upload/v1731972050/skyline-car-rental-media/ybneegejo655qatqygni.jpg",
        public_id: "skyline-car-rental-media/ybneegejo655qatqygni",
        resource_type: "image",
        _id: "673bcbd20f16e58a118f21ee",
      },
    ],
    isRented: false,
    IsMaintenace: false,
    maintenanceTasks: [],
    rentalHistory: [],
    createdAt: "2024-11-18T23:20:50.969Z",
    updatedAt: "2024-11-19T20:44:34.386Z",
    __v: 0,
  },
  {
    _id: "673bcc8b0f16e58a118f221c",
    carId: "DCWM-668",
    vinNumber: "KMHLN4AG9PU408173",
    brand: "HYUNDAI",
    model: "ELENTRA",
    color: "GREY",
    mileage: 50000,
    year: 2023,
    rentalPrice: 350,
    state: "available",
    media: [
      {
        url: "https://res.cloudinary.com/beirut-mart/image/upload/v1731972234/skyline-car-rental-media/ht1go37olv9sd70dcyeg.jpg",
        public_id: "skyline-car-rental-media/ht1go37olv9sd70dcyeg",
        resource_type: "image",
        _id: "673bcc8b0f16e58a118f221d",
      },
    ],
    isRented: false,
    IsMaintenace: false,
    maintenanceTasks: [],
    rentalHistory: [],
    createdAt: "2024-11-18T23:23:55.126Z",
    updatedAt: "2024-11-19T20:44:49.985Z",
    __v: 0,
  },
  {
    _id: "673bcda20f16e58a118f224d",
    carId: "DCWM-832",
    vinNumber: "5NPEJ4J2XMH073539",
    brand: "HYNDAI",
    model: "SONATA",
    color: "GREY",
    mileage: 50000,
    year: 2021,
    rentalPrice: 350,
    state: "available",
    media: [
      {
        url: "https://res.cloudinary.com/beirut-mart/image/upload/v1731972514/skyline-car-rental-media/yuehgzzxcxhk0cwzcjyq.jpg",
        public_id: "skyline-car-rental-media/yuehgzzxcxhk0cwzcjyq",
        resource_type: "image",
        _id: "673bcda20f16e58a118f224e",
      },
    ],
    isRented: false,
    IsMaintenace: false,
    maintenanceTasks: [],
    rentalHistory: [],
    createdAt: "2024-11-18T23:28:34.649Z",
    updatedAt: "2024-11-19T20:45:06.385Z",
    __v: 0,
  },
  {
    _id: "673bd0e70f16e58a118f2280",
    carId: "DCWM-922",
    vinNumber: "JTDBBMBE3N3502414",
    brand: "TOYOTA",
    model: "COROLLA",
    color: "BLACK",
    mileage: 50000,
    year: 2022,
    rentalPrice: 350,
    state: "available",
    media: [
      {
        url: "https://res.cloudinary.com/beirut-mart/image/upload/v1731973350/skyline-car-rental-media/orbtgtr7dtgjy61bpwyp.jpg",
        public_id: "skyline-car-rental-media/orbtgtr7dtgjy61bpwyp",
        resource_type: "image",
        _id: "673bd0e70f16e58a118f2281",
      },
    ],
    isRented: false,
    IsMaintenace: false,
    maintenanceTasks: [],
    rentalHistory: [],
    createdAt: "2024-11-18T23:42:31.205Z",
    updatedAt: "2024-11-19T20:45:17.346Z",
    __v: 0,
  },
  {
    _id: "673c96880f16e58a118f2a11",
    carId: "56666",
    vinNumber: "7555",
    brand: "test",
    model: "test",
    color: "test",
    mileage: 500,
    year: 2018,
    rentalPrice: 555,
    media: [],
    isRented: false,
    IsMaintenace: false,
    maintenanceTasks: [],
    rentalHistory: [
      {
        orderId: {
          _id: "673c991b0f16e58a118f2dff",
          customer: {
            _id: "67397d5fc1cf4475818c0bd2",
            name: "testaa",
          },
          state: "pending",
          cars: [
            {
              pickupDateTime: "2024-11-19T13:55:50.607Z",
              returnDateTime: "2024-11-20T13:55:50.607Z",
              totalPrice: 555,
            },
          ],
        },
        orderDate: "2024-11-19T13:56:43.926Z",
        _id: "673c991c0f16e58a118f2e06",
      },
    ],
    createdAt: "2024-11-19T13:45:44.648Z",
    updatedAt: "2024-11-20T15:57:42.231Z",
    __v: 0,
    state: "available",
  },
];
function CreateOrder() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { setShowBackButton } = useContext(AppContext);
  const [openAddCustomer, setOpenAddCustomer] = useState(false);
  const [openSelectDate, setOpenSelectDate] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [SelectedVehicle, setSelectedVehicle] = useState({});
  const [CustomSelectedVehicle, setSelectedVehicleCustom] = useState({});
  const [SelectedDates, setSelectedDates] = useState([new Date(), new Date()]);
  // ([
  //   ["2024-11-19T23:56:03.885Z", "2024-11-26T23:56:03.885Z"],
  //   ["2024-11-26T12:51:22.770Z", "2024-11-30T12:51:22.770Z"],
  //   ["2024-11-15T15:43:33.565Z", "2024-11-20T15:43:33.565Z"],
  // ]);
  const [Error, setError] = useState({
    isError: false,
    errorMessage: "",
    errors: "",
  });
  // console.log(
  //   "SelectedDates ",
  //   SelectedDates?.map((ele) => new Date(ele))
  // );
  const [Refresh, setRefresh] = useState(false);
  const [FilterData, setFilterData] = useState({
    Brands: [],
    Models: [],
    Status: [],
  });
  const [AllCustomers, setAllCustomers] = useState([]);
  const [filterValues, setFilterValues] = useState({
    // customer filter
    name: undefined,
    phoneNumber: undefined,
    email: undefined,
    // vehicle filter
    search: undefined,
    brands: [],
    models: [],
    status: "", //[],
    priceMin: undefined,
    priceMax: undefined,
  });
  const [AllVehicles, setAllVehicles] = useState([]);
  const [AllVehiclesBookedDates, setAllVehiclesBookedDates] = useState({});
  const [Vehicles, setVehicles] = useState([]);
  const [TotalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = React.useState(1);
  const handleChange = (event, value) => {
    setPage(value);
  };
  const rowsPerPage = 12;
  const [SelectedCars, setSelectedCars] = useState([]);
  const [LoadingAddCustomer, setLoadingAddCustomer] = useState(false);
  const [CustomerData, setCustomerData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    dateOfBirth: "",
    policyNumber: "",
    paymentMethod: "",
    status: "",
    image: undefined,
    orders: [],
    _id: "",
  });
  const [VehiclesDates, setVehiclesDates] = useState({});
  const [DisablePickUpTime, setDisablePickUpTime] = useState(false);
  const [DisableReturnTime, setDisableReturnTime] = useState(false);

  //#region useEffect
  useEffect(() => {
    setShowBackButton(true);
  }, []);
  useEffect(() => {
    setAllVehiclesBookedDates({});
    axiosInstance.get(API.vehicles).then((res) => {
      let data = res?.data?.data?.map((val) => ({
        ...val,
        id: val?._id,
      }));
      setAllVehicles(data);
      data?.forEach((ele) => {
        setAllVehiclesBookedDates((prev) => ({
          ...prev,
          [ele?._id]: ele?.rentalHistory?.map((h) => {
            let car = h?.orderId?.cars?.length > 0 ? h?.orderId?.cars[0] : [];
            return [
              new Date(car?.pickupDateTime),
              new Date(car?.returnDateTime),
            ];
          }),
        }));
      });
      let isRentedExist = data?.find((ele) => ele?.isRented);
      let isIsMaintenaceExist = data?.find((ele) => ele?.IsMaintenace);
      setFilterData({
        Brands: [...new Set(data?.map((ele) => ele?.brand))],
        Models: [...new Set(data?.map((ele) => ele?.model))],
        // Status: [...new Set(data?.map((ele) => ele?.state))],
        Status: [
          ...new Set(data?.map((ele) => ele?.state)),
          isRentedExist ? "rented" : null,
          isIsMaintenaceExist ? "in maintenance" : null,
        ],
      });
    });
  }, []);
  useEffect(() => {
    // get all customers
    setAllCustomers([]);
    axiosInstance.get(API.customers).then((res) => {
      setAllCustomers(res?.data?.data || []);
    });
  }, [Refresh]);
  useEffect(() => {
    if (
      filterValues?.name ||
      filterValues?.phoneNumber ||
      filterValues?.email
    ) {
      axiosInstance
        .get(API.customers, {
          params: {
            name: filterValues?.name,
            phoneNumber: filterValues?.phoneNumber,
            email: filterValues?.email,
          },
        })
        .then((res) => {
          const data = res?.data?.data;
          if (data?.length > 0) {
            setCustomerData({
              name: data[0]?.name,
              phoneNumber: data[0]?.phoneNumber,
              email: data[0]?.email,
              dateOfBirth: data[0]?.dateOfBirth,
              policyNumber: data[0]?.policyNumber,
              paymentMethod: data[0]?.paymentMethod,
              status: data[0]?.status,
              image: data[0]?.image,
              orders: data[0]?.orders,
              _id: data[0]?._id,
            });
          }
        });
    }
  }, [filterValues.name, filterValues.email, filterValues.phoneNumber]);
  useEffect(() => {
    setLoading(true);
    setVehicles([]);
    axiosInstance
      .get(API.vehicles, {
        params: {
          search: filterValues?.search,
          brands: filterValues?.brands?.join(","),
          models: filterValues?.models?.join(","),
          //status: filterValues?.status?.join(","),
          priceMin: filterValues?.priceMin,
          priceMax: filterValues?.priceMax,
          status:
            filterValues?.status !== "rented" &&
            filterValues?.status !== "in maintenance"
              ? filterValues?.status
              : undefined,
          priceMin: filterValues?.priceMin,
          priceMax: filterValues?.priceMax,
          isRented: filterValues?.status?.includes("rented")
            ? true
            : filterValues?.status?.includes("available")
            ? false
            : undefined,
          isMaintenance: filterValues?.status?.includes("in maintenance")
            ? true
            : filterValues?.status?.includes("available")
            ? false
            : undefined,
        },
      })
      .then((res) => {
        setPage(1);
        setTotalRecords(res?.data?.count);
        let data = res?.data?.data?.map((val) => ({
          ...val,
          id: val?._id,
        }));
        setVehicles([...data]);
        setLoading(false);
      })
      .catch((err) => {
        setTotalRecords(0);
        setVehicles([]);
        setLoading(false);
      });
  }, [
    filterValues?.search,
    filterValues?.brands,
    filterValues?.models,
    filterValues?.status,
    filterValues?.priceMin,
    filterValues?.priceMax,
  ]);
  //#endregion useEffect

  //#region functions
  const handleClickOpenAddCustomer = () => {
    setOpenAddCustomer(true);
  };

  const handleCloseAddCustomer = () => {
    setOpenAddCustomer(false);
  };

  const handleClickOpenSelectDate = (vehicle) => {
    if (VehiclesDates[vehicle?._id]) {
      setSelectedDates(VehiclesDates[vehicle?._id]);
    }
    setSelectedVehicleCustom(vehicle);
    setSelectedVehicle(vehicle);
    setOpenSelectDate(true);
  };

  const handleCloseSelectDate = () => {
    setOpenSelectDate(false);
    setSelectedVehicle({});
    setSelectedDates([new Date(), new Date()]);
  };
  function isInService(strDate, inServiceDates) {
    return inServiceDates?.some(
      ([start, end]) =>
        new Date(strDate) >= new Date(start) &&
        new Date(strDate) <= new Date(end)
    );
  }
  function isUnAvailableDates(ranges, inServiceDates) {
    if (!ranges[1]) return false;
    return inServiceDates?.some(
      ([start, end]) =>
        new Date(ranges[0]) <= new Date(start) &&
        new Date(ranges[1]) >= new Date(end)
    );
  }
  function findBookedDateIndexFunc(BookedDates, date) {
    let findBookedDateIndex = BookedDates?.map((d) =>
      new Date(d).toLocaleDateString()
    )?.findIndex((d) => d === new Date(date).toLocaleDateString());
    return findBookedDateIndex;
  }
  const onChangeCalendar = (ranges) => {
    // console.log(
    //   "ranges",
    //   ranges?.map((ele) => new Date(ele))
    // );
    let _isUnAvailableDates = isUnAvailableDates(
      ranges,
      AllVehiclesBookedDates[CustomSelectedVehicle?._id]
    );

    /******/
    let isInService_ranges = ranges?.map((r) => new Date(r));
    let BookedDates = (
      AllVehiclesBookedDates[CustomSelectedVehicle?._id] || []
    )?.flat();
    let findBookedDateIndex_0 = findBookedDateIndexFunc(
      BookedDates,
      isInService_ranges[0]
    );
    let findBookedDateIndex_1 = findBookedDateIndexFunc(
      BookedDates,
      isInService_ranges[1]
    );
    if (findBookedDateIndex_0 !== -1 || isInService_ranges[0]) {
      let Hours = new Date(BookedDates[findBookedDateIndex_0]).getHours();
      let Minutes = new Date(BookedDates[findBookedDateIndex_0]).getMinutes();
      isInService_ranges[0] = new Date(
        BookedDates[findBookedDateIndex_0]
      ).setHours(Hours - 1);
    }
    if (findBookedDateIndex_1 !== -1 || isInService_ranges[1]) {
      let Hours = new Date(BookedDates[findBookedDateIndex_1]).getHours();
      let Minutes = new Date(BookedDates[findBookedDateIndex_1]).getMinutes();
      isInService_ranges[1] = new Date(
        BookedDates[findBookedDateIndex_1]
      ).setHours(Hours + 1);
    }
    let isInService_0 = isInService(
      isInService_ranges[0],
      AllVehiclesBookedDates[CustomSelectedVehicle?._id]
    );
    let isInService_1 = isInService(
      isInService_ranges[1],
      AllVehiclesBookedDates[CustomSelectedVehicle?._id]
    );

    let UnAvailableDates_ranges = ranges?.map((r) => new Date(r));
    if (findBookedDateIndex_0 !== -1 || isInService_ranges[0]) {
      UnAvailableDates_ranges[0] = new Date(BookedDates[findBookedDateIndex_0]);
    }
    if (findBookedDateIndex_1 !== -1 || isInService_ranges[1]) {
      UnAvailableDates_ranges[1] = new Date(BookedDates[findBookedDateIndex_1]);
    }
    let _isUnAvailableDates_1 = isUnAvailableDates(
      UnAvailableDates_ranges,
      AllVehiclesBookedDates[CustomSelectedVehicle?._id]
    );
    /*****/

    if (
      _isUnAvailableDates ||
      // isInService_0 ||
      // isInService_1 ||
      _isUnAvailableDates_1
    )
      return false;
    setSelectedDates(ranges);
  };
  const mapDaysRender = ({
    date,
    // today,
    // selectedDate,
    // currentMonth,
    // isSameDate,
  }) => {
    let className;
    let strDate = date; //.format();
    let BookedDates = (
      AllVehiclesBookedDates[CustomSelectedVehicle?._id] || []
    )?.flat();
    let findBookedDateIndex = findBookedDateIndexFunc(BookedDates, strDate);
    if (findBookedDateIndex !== -1 && findBookedDateIndex % 2 === 0) {
      //let Hours = new Date(
      //   BookedDates[findBookedDateIndex]
      // ).getHours();
      let Minutes = new Date(BookedDates[findBookedDateIndex]).getMinutes();
      // strDate = new Date(date).setHours(Hours, Minutes, 0, 0);
      strDate = new Date(BookedDates[findBookedDateIndex]).setMinutes(
        Minutes - 1
      );
    } else if (findBookedDateIndex !== -1 && findBookedDateIndex % 2 !== 0) {
      let Hours = new Date(BookedDates[findBookedDateIndex]).getHours();
      let Minutes = new Date(BookedDates[findBookedDateIndex]).getMinutes();
      // strDate = new Date(date).setHours(Hours, Minutes + 1, 0, 0);
      strDate = new Date(BookedDates[findBookedDateIndex]).setMinutes(
        Minutes + 1
      );
    }
    let _isInService = isInService(
      strDate,
      AllVehiclesBookedDates[CustomSelectedVehicle?._id]
    );
    if (_isInService) className = "in-service";

    return {
      disabled: _isInService ? true : false,
      children: (
        <div
          className={className}
          style={{
            padding: "0px 13px",
            fontSize: "16px",
            lineHeight: "25px",
          }}
        >
          <div>{date.format("D")}</div>
        </div>
      ),
    };
  };
  const shouldDisablePickUpTime = (time, clockType) => {
    let BookedDates = (
      AllVehiclesBookedDates[CustomSelectedVehicle?._id] || []
    )?.flat();
    let findBookedDateIndex = findBookedDateIndexFunc(
      BookedDates,
      SelectedDates[0]
    );

    // let _isInService = isInService(
    //   new Date(time),
    //   AllVehiclesBookedDates[CustomSelectedVehicle?._id]
    // );
    // if (_isInService) {
    //   return true;
    // }

    if (findBookedDateIndex !== -1) {
      let pickupHours = new Date(BookedDates[findBookedDateIndex]); //new Date(BookedDates[findBookedDateIndex]).getHours() - 1
      let _time = new Date(time);
      // let pickupHours =
      //   new Date(BookedDates[findBookedDateIndex]).getHours() - 1;
      if (
        // pickupHours === new Date(time).getHours() ||
        // pickupHours > new Date(time).getHours()
        pickupHours === _time ||
        pickupHours > _time
      ) {
        setDisablePickUpTime(true);
        return true;
      } else {
        setDisablePickUpTime(false);
        return false;
      }
    } else {
      setDisablePickUpTime(false);
      return false;
    }
  };
  const shouldDisableReturnTime = (time, clockType) => {
    let BookedDates = (
      AllVehiclesBookedDates[CustomSelectedVehicle?._id] || []
    )?.flat();
    let findBookedDateIndex = findBookedDateIndexFunc(
      BookedDates,
      SelectedDates[1]
    );
    // console.log("time ", new Date(time));
    if (findBookedDateIndex !== -1) {
      let ReturnHours = new Date(BookedDates[findBookedDateIndex]); //dayjs(BookedDates[findBookedDateIndex]).format("H"); //new Date(BookedDates[findBookedDateIndex]).getHours();
      let _time = new Date(time); //dayjs(time).format("H"); //new Date(time).getHours()
      // console.log("ReturnHours ", ReturnHours);
      // console.log("_time ", _time);
      if (ReturnHours === _time || ReturnHours < _time) {
        setDisableReturnTime(true);
        return true;
      } else {
        setDisableReturnTime(false);
        return false;
      }
    } else {
      setDisableReturnTime(false);
      return false;
    }
  };
  //#endregion functions
  //#region rendering
  const cardTitle = {
    fontFamily: "Montserrat",
    fontSize: "20px",
    fontWeight: 600,
    lineHeight: "30px",
    letterSpacing: "-0.03em",
    color: "#191919",
  };
  const subTitle = {
    fontFamily: "Montserrat",
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "21px",
    letterSpacing: "-2%",
    color: "#656575",
  };
  const labelStyle = {
    fontFamily: "Montserrat",
    fontSize: "12px",
    fontWeight: 500,
    lineHeight: "21px",
    letterSpacing: "-2%",
    color: "#656575",
    whiteSpace: "nowrap",
  };
  const priceStyle = {
    fontFamily: "Montserrat",
    fontSize: "20px",
    fontWeight: 600,
    lineHeight: "24.2px",
    color: "#191919",
  };
  const priceSpanStyle = {
    fontFamily: "Montserrat",
    fontSize: "14px",
    fontWeight: 600,
    lineHeight: "16.94px",
    color: "#656575",
  };
  const carCard = (vehicle, i) => {
    return (
      <Card
        key={i}
        sx={{
          padding: "20px !important",
          //   cursor: "pointer",
          border: SelectedCars?.includes(vehicle?._id)
            ? "1px solid #EF0A0A"
            : "unset",
          boxShadow: "0px 8px 24px 0px #4545501A",
        }}
      >
        <Grid container spacing={1}>
          <Grid size={{ xs: 12, sm: 12, md: 12 }} sx={{ textAlign: "left" }}>
            <Stack direction={"column"}>
              <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <Typography
                  sx={cardTitle}
                  variant="subtitle2"
                  textAlign={"left"}
                >
                  {vehicle?.carId}
                </Typography>
                {SelectedCars?.includes(vehicle?._id) && (
                  <Checkbox
                    color="secondary"
                    sx={{ padding: "0px" }}
                    checked={SelectedCars?.includes(vehicle?._id)}
                    onChange={(e) => {
                      // console.log(e.target.checked);
                      if (e.target.checked) {
                        setSelectedCars((prev) => [...prev, vehicle?._id]);
                      } else {
                        setSelectedCars((prev) =>
                          [...prev].filter((ele) => ele !== vehicle?._id)
                        );
                        let _VehiclesDates = { ...VehiclesDates };
                        delete _VehiclesDates[vehicle?._id];
                        setVehiclesDates(_VehiclesDates);
                      }
                    }}
                  />
                )}
              </Stack>
              <Typography variant="caption" sx={subTitle}>
                {vehicle?.model}
              </Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12 }}>
            <img
              src={vehicle?.media[0]?.url}
              width="100%"
              height={"220px"}
              style={{ borderRadius: 2, objectFit: "contain" }}
              onLoad={() => {}}
              onError={(e) => {
                e.currentTarget.onerror = null; // prevents looping
                e.currentTarget.src = "/images/car.jpeg";
              }}
            />
          </Grid>
          <Grid size={{ xs: 4, sm: 4, md: 4.7 }}>
            <Stack direction={"row"} spacing={1} alignItems={"center"}>
              <img src="/images/brand.png" />
              <Typography variant="caption" sx={labelStyle}>
                {vehicle?.brand}
              </Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 4, sm: 4, md: 3.3 }}>
            <Stack direction={"row"} spacing={1} alignItems={"center"}>
              <img src="/images/calendar-check.png" />
              <Typography variant="caption" sx={labelStyle}>
                {vehicle?.year || "----"}
              </Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 4, sm: 4, md: 4 }}>
            <Stack direction={"row"} spacing={1} alignItems={"center"}>
              <img src="/images/color.png" />
              <Typography variant="caption" sx={labelStyle}>
                {vehicle?.color}
              </Typography>
            </Stack>
          </Grid>
          <Grid
            size={{ xs: 12, sm: 12, md: 12 }}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Stack direction={"row"} spacing={1} alignItems={"center"}>
              <Typography sx={priceStyle} variant="body2" textAlign={"left"}>
                ${addCommas(vehicle?.rentalPrice)}/
              </Typography>
              <Typography variant="caption" sx={priceSpanStyle}>
                day
              </Typography>
            </Stack>
            <Button
              variant="contained"
              //size="small"
              sx={{ textTransform: "none" }}
              onClick={() => handleClickOpenSelectDate(vehicle)}
            >
              Select date
            </Button>
          </Grid>
        </Grid>
      </Card>
    );
  };
  const CustomerSection = (
    <CustomersFilter
      title="Select a customer"
      setFilterValues={setFilterValues}
      filterValues={filterValues}
      showCreateBtn={true}
      onClickAdd={handleClickOpenAddCustomer}
      AllCustomers={AllCustomers}
    />
  );
  const VehiclesFilterSection = (
    <VehiclesFilter
      title="Select a car"
      FilterData={FilterData}
      setFilterValues={setFilterValues}
      filterValues={filterValues}
      showCreateBtn={false}
    />
  );
  //#endregion rendering
  // console.log("VehiclesDates ", VehiclesDates);
  // console.log("SelectedCars ", SelectedCars);
  console.log("AllVehiclesBookedDates ", AllVehiclesBookedDates);
  console.log("SelectedDates ", SelectedDates);
  // console.log("CustomSelectedVehicle ", CustomSelectedVehicle);
  console.log("SelectedVehicle ", SelectedVehicle);

  return (
    <>
      <Grid container spacing={3} mb={2}>
        <Grid size={{ xs: 12, sm: 12, md: 12 }}>{CustomerSection}</Grid>
        <Grid size={{ xs: 12, sm: 12, md: 12 }}>{VehiclesFilterSection}</Grid>
        {Loading && (
          <Grid size={{ xs: 12 }}>
            <CircularProgress />
          </Grid>
        )}
        {Vehicles?.slice((page - 1) * rowsPerPage, rowsPerPage * page)?.map(
          (vehicle, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              {carCard(vehicle, i)}
            </Grid>
          )
        )}
        <Grid size={{ xs: 12 }}>
          <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
            <Pagination
              count={Math.ceil(TotalRecords / rowsPerPage)}
              page={page}
              onChange={handleChange}
              rowsPerPage={rowsPerPage}
            />
          </Box>
        </Grid>
        {!Loading && (
          <Grid mt={1} mb={1} size={{ xs: 12 }}>
            <Button
              sx={{ width: "150px", textTransform: "none" }}
              variant="contained"
              color="secondary"
              disabled={!CustomerData?._id || SelectedCars?.length === 0}
              onClick={() => {
                if (
                  Object.keys(VehiclesDates).sort()?.join("") !==
                  SelectedCars?.sort()?.join("")
                ) {
                  setError({
                    isError: true,
                    errorMessage:
                      "Please select a date for all selected vehicles.",
                    errors: "",
                  });
                } else if (!CustomerData?._id) {
                  setError({
                    isError: true,
                    errorMessage: "Please select a customer.",
                    errors: "",
                  });
                } else {
                  setError({
                    isError: false,
                    errorMessage: "",
                    errors: "",
                  });
                  navigate("/orders/inspect", {
                    state: {
                      CustomerData: CustomerData,
                      SelectedCars: AllVehicles?.filter((ele) =>
                        SelectedCars.includes(ele?._id)
                      ),
                      VehiclesDates: VehiclesDates,
                    },
                  });
                }
              }}
            >
              Rent Now
            </Button>
          </Grid>
        )}
      </Grid>

      {/**  Add customer Dialog */}
      <Dialog
        open={openAddCustomer}
        onClose={handleCloseAddCustomer}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            setLoadingAddCustomer(true);
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const name = formJson.name;
            const phoneNumber = formJson.phoneNumber;
            const email = formJson.email;
            const policyNumber = formJson?.policyNumber;
            const dateOfBirth = formJson?.dateOfBirth;
            const paymentMethod = formJson?.paymentMethod;
            const status = formJson?.status;

            let bodyData = new FormData();
            bodyData.append("name", name);
            bodyData.append("email", email);
            bodyData.append("phoneNumber", phoneNumber);
            bodyData.append(
              "dateOfBirth",
              dateOfBirth ? new Date(dateOfBirth).toISOString() : undefined
            );
            bodyData.append("policyNumber", policyNumber);
            bodyData.append("paymentMethod", paymentMethod);
            bodyData.append("status", status);
            axiosInstance.post(API.customers, bodyData).then((res) => {
              if (res?.data?.success === true || res?.data?.customer?._id) {
                setRefresh(!Refresh);
                setCustomerData(res?.data?.customer);
                handleCloseAddCustomer();
              }
              setLoadingAddCustomer(false);
            });
          },
        }}
      >
        <DialogTitle
          sx={{
            textTransform: "capitalize",
            ...theme.card_title,
            marginBottom: "0px",
            padding: "10px 24px 0px",
          }}
        >
          Customer Information
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{ textTransform: "capitalize", ...theme.card_sub_title }}
          >
            Add customer Information
          </DialogContentText>
          <Typography mt={2} sx={{ ...theme.field_label }} variant="subtitle2">
            Name
          </Typography>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            type="text"
            fullWidth
            variant="outlined"
            size="small"
          />
          <Typography sx={{ ...theme.field_label }} mt={1} variant="subtitle2">
            Phone number
          </Typography>
          <TextField
            required
            margin="dense"
            id="name"
            name="phoneNumber"
            type="text"
            fullWidth
            variant="outlined"
            size="small"
          />
          <Typography sx={{ ...theme.field_label }} mt={1} variant="subtitle2">
            Email address
          </Typography>
          <TextField
            required
            margin="dense"
            id="name"
            name="email"
            type="email"
            fullWidth
            variant="outlined"
            size="small"
          />
          <Typography sx={{ ...theme.field_label }} mt={1} variant="subtitle2">
            Policy Number
          </Typography>
          <TextField
            margin="dense"
            name="policyNumber"
            type="text"
            fullWidth
            variant="outlined"
            size="small"
          />
          <Typography sx={{ ...theme.field_label }} mt={1} variant="subtitle2">
            Date Of Birth
          </Typography>
          <LocalizationProvider
            sx={{
              width: "100% !important",
              "& .MuiTextField-root": { width: "100% !important" },
            }}
            dateAdapter={AdapterDayjs}
          >
            <DatePicker
              sx={{
                width: "100% !important",
                "& input": { width: "100%", padding: "8.5px 14px" },
              }}
              name="dateOfBirth"
              type="date"
              size="small"
            />
          </LocalizationProvider>
          <Typography sx={{ ...theme.field_label }} mt={1} variant="subtitle2">
            Payment Method
          </Typography>
          <Select
            name={"paymentMethod"}
            fullWidth
            size="small"
            placeholder="Select payment method"
          >
            {[
              { label: "online", value: "online" },
              { label: "bank transfer", value: "bank-transfer" },
              { label: "cash on delivery", value: "cash-on-delivery" },
            ]?.map((ele) => (
              <MenuItem key={ele.label} value={ele.value}>
                {ele.label}
              </MenuItem>
            ))}
          </Select>
          <Typography sx={{ ...theme.field_label }} mt={1} variant="subtitle2">
            Status
          </Typography>
          <Select
            name={"status"}
            fullWidth
            size="small"
            placeholder="Select status"
          >
            {["active", "inactive"]?.map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Box
            sx={{ width: "100%" }}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCloseAddCustomer}
              sx={{ width: "120px", textTransform: "none", marginRight: "5px" }}
            >
              Cancel
            </Button>
            <Button
              sx={{ width: "120px", textTransform: "none" }}
              variant="contained"
              color="secondary"
              type="submit"
            >
              {LoadingAddCustomer && (
                <CircularProgress
                  sx={{
                    width: "20px !important",
                    height: "20px !important",
                    marginRight: "20px",
                  }}
                />
              )}
              Add
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/**  Select Date Dialog */}
      <Dialog
        open={openSelectDate}
        onClose={handleCloseSelectDate}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent>
          <Grid container spacing={1}>
            <Grid size={{ xs: 12 }}>
              <Card sx={{ padding: "15px" }}>
                <Calendar
                  value={SelectedDates}
                  //onChange={setSelectedDates}
                  //multiple
                  range
                  className="red order-picker"
                  containerStyle={{ width: "100%" }}
                  style={{ width: "100%" }}
                  onChange={onChangeCalendar}
                  mapDays={mapDaysRender}
                />
              </Card>
            </Grid>
            <Grid
              size={{ xs: 12 }}
              sx={{ "& .MuiFormControl-root": { width: "100%" } }}
            >
              <Typography variant="subtitle2" textAlign={"left"}>
                Pick up time
              </Typography>
              <LocalizationProvider
                sx={{ "& .MuiTextField-root": { width: "100% !important" } }}
                dateAdapter={AdapterDayjs}
              >
                <TimePicker
                  sx={{ "& input": { padding: "8.5px 14px", width: "100%" } }}
                  size="small"
                  // views={["hours"]}
                  value={dayjs(SelectedDates[0])}
                  onChange={(newValue) => {
                    console.log(newValue);
                    setSelectedDates((prev) => [new Date(newValue), prev[1]]);
                  }}
                  shouldDisableTime={shouldDisablePickUpTime}
                />
              </LocalizationProvider>
              {DisablePickUpTime && (
                <Typography variant="caption" color="error">
                  Reserved time, please choose another.
                </Typography>
              )}
            </Grid>
            <Grid
              size={{ xs: 12 }}
              sx={{ "& .MuiFormControl-root": { width: "100%" } }}
            >
              <Typography variant="subtitle2" textAlign={"left"}>
                Return up time
              </Typography>
              <LocalizationProvider
                sx={{ "& .MuiTextField-root": { width: "100% !important" } }}
                dateAdapter={AdapterDayjs}
              >
                <TimePicker
                  sx={{ "& input": { padding: "8.5px 14px", width: "100%" } }}
                  size="small"
                  // views={["hours"]}
                  value={dayjs(SelectedDates[1])}
                  onChange={(newValue) =>
                    setSelectedDates((prev) => [prev[0], new Date(newValue)])
                  }
                  shouldDisableTime={shouldDisableReturnTime}
                />
              </LocalizationProvider>
              {DisableReturnTime && (
                <Typography variant="caption" color="error">
                  Reserved time, please choose another.
                </Typography>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Box
            sx={{ width: "100%" }}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCloseSelectDate}
              sx={{ width: "120px", textTransform: "none", marginRight: "5px" }}
            >
              Cancel
            </Button>
            <Button
              sx={{ width: "120px", textTransform: "none" }}
              variant="contained"
              color="secondary"
              type="submit"
              disabled={DisablePickUpTime || DisableReturnTime}
              onClick={() => {
                setSelectedCars((prev) => [
                  ...new Set([...prev, SelectedVehicle?._id]),
                ]);
                setVehiclesDates((prev) => ({
                  ...prev,
                  [SelectedVehicle?._id]: SelectedDates?.map(
                    (ele) => new Date(ele)
                  ),
                }));
                handleCloseSelectDate();
              }}
            >
              Apply
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Error.isError}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() =>
            setError({
              isError: false,
              errorMessage: "",
              errors: "",
            })
          }
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {Error.errorMessage}
          {Error?.errors && <br />}
          {Error?.errors || ""}
        </Alert>
      </Snackbar>
    </>
  );
}

export default CreateOrder;
