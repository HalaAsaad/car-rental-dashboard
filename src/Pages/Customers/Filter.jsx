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
  Autocomplete,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { EmailOutlined, Phone } from "@mui/icons-material";

function Filter({
  title,
  setFilterValues,
  filterValues,
  showCreateBtn,
  onClickAdd,
  AllCustomers,
}) {
  const navigate = useNavigate();

  return (
    <Card sx={{ padding: "32px 28px 40px 28px" }}>
      <Grid container spacing={1}>
        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
          <Typography variant="h6" textAlign={"left"}>
            {title ? title : "Customers"}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
          <Stack
            direction={{ xs: "column", md: "column", lg: "row" }}
            spacing={2}
          >
            <Autocomplete
              sx={{ m: 1, width: "25ch" }}
              //size="small"
              freeSolo
              disableClearable
              options={AllCustomers?.map((option) => option.name)}
              value={filterValues?.name}
              onInputChange={(event, newInputValue) => {
                setFilterValues((prev) => ({
                  ...prev,
                  name: newInputValue,
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search input"
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      type: "search",
                      endAdornment: (
                        <InputAdornment position="end">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}
            />

            <Autocomplete
              sx={{ m: 1, width: "25ch" }}
              //size="small"
              freeSolo
              disableClearable
              options={AllCustomers?.map((option) => option.phoneNumber)}
              value={filterValues?.phoneNumber}
              onInputChange={(event, newInputValue) => {
                setFilterValues((prev) => ({
                  ...prev,
                  phoneNumber: newInputValue,
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search phone number..."
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      type: "search",
                      endAdornment: (
                        <InputAdornment position="end">
                          <Phone />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}
            />
            <Autocomplete
              sx={{ m: 1, width: "25ch" }}
              //size="small"
              freeSolo
              disableClearable
              options={AllCustomers?.map((option) => option.email)}
              value={filterValues?.email}
              onInputChange={(event, newInputValue) => {
                setFilterValues((prev) => ({
                  ...prev,
                  email: newInputValue,
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search email..."
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      type: "search",
                      endAdornment: (
                        <InputAdornment position="end">
                          <EmailOutlined />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}
            />

            {/* <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
              <OutlinedInput
                placeholder="Search email"
                //size="small"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      edge="end"
                    >
                      <EmailOutlined />
                    </IconButton>
                  </InputAdornment>
                }
                // label="email"
                value={filterValues?.email}
                onChange={(event) => {
                  setFilterValues((prev) => ({
                    ...prev,
                    email: event.target.value,
                  }));
                }}
              />
            </FormControl> */}

            {showCreateBtn && (
              <Button
                variant="contained"
                onClick={() => {
                  if (typeof onClickAdd === "function") {
                    onClickAdd();
                  } else {
                    navigate("/customers/add");
                  }
                }}
                // loading={loading}
                color="secondary"
                //size="small"
                sx={{ textTransform: "none", marginLeft: "auto !important" }}
              >
                Add Customer
              </Button>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
}

export default Filter;
