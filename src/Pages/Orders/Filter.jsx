import React from "react";
import {
  Stack,
  Typography,
  TextField,
  Button,
  Card,
  Box,
  Autocomplete,
  // InputAdornment,
  // Input,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useNavigate } from "react-router-dom";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import DvrIcon from "@mui/icons-material/Dvr";

function Filter({
  setFilterValues,
  filterValues,
  CarIDsOptions,
  showCreateBtn,
}) {
  const navigate = useNavigate();
  // console.log("filterValues ", filterValues);
  return (
    <Card sx={{ padding: "32px 28px 40px 28px" }}>
      <Grid container spacing={1}>
        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
          <Typography variant="h6" textAlign={"left"}>
            Orders
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
          <Stack
            direction={{ xs: "column", md: "column", lg: "row" }}
            spacing={2}
          >
            <Autocomplete
              multiple
              sx={{ flexGrow: 1 }}
              //size="small"
              //id="tags-standard"
              options={CarIDsOptions}
              value={filterValues?.carIds || []}
              onChange={(event, newValue) => {
                setFilterValues((prev) => ({
                  ...prev,
                  carIds: newValue,
                }));
              }}
              //getOptionLabel={(option) => option.title}
              renderInput={(params) => {
                return (
                  <Stack
                    direction={"row"}
                    position={"relative"}
                    sx={{
                      "& .MuiInputBase-root": {
                        paddingLeft: "40px",
                      },
                    }}
                  >
                    <DirectionsCarIcon
                      sx={{
                        position: "absolute",
                        left: "10px",
                        top: "15px",
                        color: "#656575",
                      }}
                    />
                    <TextField
                      variant="outlined"
                      // label="Car number"
                      placeholder="Car number"
                      // slotProps={{
                      //   input: {
                      //     type: "search",
                      //     startAdornment: (
                      //       <InputAdornment position="start">
                      //         <DirectionsCarIcon />
                      //       </InputAdornment>
                      //     ),
                      //     ...params.InputProps,
                      //   },
                      // }}
                      {...params}
                    />
                  </Stack>
                );
              }}
            />

            <Box display={"flex"} sx={{ marginRight: "16px !important" }}>
              {[
                { label: "Date &time from...", name: "from" },
                { label: "Date & time to...", name: "to" },
              ].map((ele, i) => (
                <LocalizationProvider
                  //size="small"
                  key={i}
                  dateAdapter={AdapterDayjs}
                >
                  <DateTimePicker
                    //size="small"
                    sx={{
                      "& .MuiInputBase-root": {
                        flexFlow: "row-reverse",
                      },
                      // "& .MuiInputBase-input": {
                      //   padding: "9px",
                      // },
                      "& .MuiFormLabel-root": {
                        top: 0, //"-7px",
                        left: "30px",
                      },
                      "& .MuiInputLabel-shrink": {
                        top: "0",
                        left: "0",
                      },
                    }}
                    label={ele.label}
                    value={filterValues[ele.name]}
                    onChange={(newValue) =>
                      setFilterValues((prev) => ({
                        ...prev,
                        [ele.name]: newValue,
                      }))
                    }
                  />
                </LocalizationProvider>
              ))}
            </Box>

            {showCreateBtn && (
              <Button
                variant="contained"
                onClick={() => {
                  navigate("/orders/create");
                }}
                // loading={loading}
                color="secondary"
                //size="small"
                sx={{
                  textTransform: "none",
                  marginLeft: "auto !important",
                  width: "170px",
                }}
              >
                <DvrIcon sx={{ marginRight: "5px" }} />
                &nbsp; Create new
              </Button>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
}

export default Filter;
