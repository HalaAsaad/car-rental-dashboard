import React from "react";
import {
  Stack,
  Typography,
  InputAdornment,
  Card,
  // OutlinedInput,
  // FormControl,
  IconButton,
  Autocomplete,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import SearchIcon from "@mui/icons-material/Search";

function Filter({ setFilterValues, filterValues, CarIDsOptions }) {
  return (
    <Card sx={{ padding: "32px 28px 40px 28px" }}>
      <Grid container spacing={1}>
        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
          <Typography variant="h6" textAlign={"left"}>
            Vehicles calendar
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
          <Stack
            direction={{ xs: "column", md: "column", lg: "row" }}
            spacing={2}
          >
            <Autocomplete
              sx={{ width: "25ch" }}
              id="tags-standard"
              options={CarIDsOptions?.filter(
                (ele) => ele !== undefined || ele !== null
              )}
              value={filterValues?.carId}
              onChange={(event, newInputValue) => {
                setFilterValues((prev) => ({
                  ...prev,
                  carId: newInputValue,
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Search car ID"
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      type: "search",
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton edge="end">
                            <SearchIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}
            />
            {/* <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
              <OutlinedInput
                placeholder={"Search car ID"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      edge="end"
                    >
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                }
                value={filterValues?.carId}
                onChange={(event) => {
                  setFilterValues((prev) => ({
                    ...prev,
                    carId: event.target.value,
                  }));
                }}
              />
            </FormControl> */}
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
}

export default Filter;
