import React from "react";
import {
  Stack,
  Typography,
  Button,
  InputAdornment,
  Card,
  OutlinedInput,
  FormControl,
  IconButton,
  Box,
  Autocomplete,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

function Filter({
  title,
  FilterData,
  setFilterValues,
  filterValues,
  showCreateBtn,
}) {
  const navigate = useNavigate();
  return (
    <Card sx={{ padding: "32px 28px 40px 28px" }}>
      <Grid container spacing={1}>
        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
          <Typography variant="h6" textAlign={"left"}>
            {title ? title : "Vehicles"}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
          <Stack
            direction={{ xs: "column", md: "column", lg: "row" }}
            spacing={2}
          >
            <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
              <OutlinedInput
                // type={"text"}
                placeholder={"Search car ID"}
                //size="small"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      // onClick={handleClickShowPassword}
                      // onMouseDown={handleMouseDownPassword}
                      // onMouseUp={handleMouseUpPassword}
                      edge="end"
                    >
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                }
                // label="Name"
                value={filterValues?.search}
                onChange={(event) => {
                  setFilterValues((prev) => ({
                    ...prev,
                    search: event.target.value,
                  }));
                }}
              />
            </FormControl>
            {[
              {
                label: "Brands",
                name: "brands",
                multiple: true,
                options: FilterData?.Brands?.filter(
                  (ele) => ele !== undefined && ele !== null
                ),
              },
              {
                label: "Models",
                name: "models",
                multiple: true,
                options: FilterData?.Models?.filter(
                  (ele) => ele !== undefined && ele !== null
                ),
              },
              {
                label: "Status",
                name: "status",
                multiple: false,
                options: FilterData?.Status?.filter(
                  (ele) => ele !== undefined && ele !== null
                ),
              },
            ].map((ele, i) => (
              <Autocomplete
                key={i}
                multiple={ele?.multiple}
                sx={{ minWidth: "15%" }}
                //size="small"
                //id="tags-standard"
                options={ele?.options}
                value={filterValues[ele.name] || []}
                onChange={(event, newValue) => {
                  setFilterValues((prev) => ({
                    ...prev,
                    [ele.name]: newValue,
                  }));
                }}
                //getOptionLabel={(option) => option.title}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label={ele.label}
                    placeholder={ele.label}
                  />
                )}
              />
            ))}
            <Box display={"flex"} sx={{ marginRight: "15px !important" }}>
              {[
                { label: "Price min", name: "priceMin" },
                { label: "Price max", name: "priceMax" },
              ].map((ele, i) => (
                <FormControl key={i} variant="outlined">
                  <OutlinedInput
                    placeholder={" " + ele?.label}
                    //size="small"
                    type="number"
                    startAdornment={
                      <img alt="price" src="/hugeicons_money-03.png" />
                    }
                    value={filterValues[ele.name]}
                    onChange={(event) => {
                      setFilterValues((prev) => ({
                        ...prev,
                        [ele.name]: event.target.value,
                      }));
                    }}
                  />
                </FormControl>
              ))}
            </Box>

            {showCreateBtn && (
              <Button
                variant="contained"
                onClick={() => {
                  navigate("/vehicles/add");
                }}
                // loading={loading}
                color="secondary"
                //size="small"
                sx={{
                  textTransform: "none",
                  marginLeft: "auto !important",
                  width: "200px",
                }}
              >
                Add vehicles
              </Button>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
}

export default Filter;
