import React from "react";
import {
  Stack,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Card,
  InputLabel,
  OutlinedInput,
  FormControl,
  IconButton,
  Select,
  MenuItem,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

function Filter({ setFilterValues, filterValues }) {
  const navigate = useNavigate();
  return (
    <Card sx={{ padding: "32px 28px 40px 28px" }}>
      <Grid container spacing={1}>
        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
          <Typography variant="h6" textAlign={"left"}>
            Roles
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
          <Stack
            direction={{ xs: "column", md: "column", lg: "row" }}
            spacing={2}
          >
            <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
              <OutlinedInput
                placeholder="Search roles"
                //size="small"
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
                value={filterValues?.name}
                onChange={(event) => {
                  setFilterValues((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }));
                }}
              />
            </FormControl>

            <Button
              variant="contained"
              onClick={() => {
                navigate("/management/roles/add");
              }}
              // loading={loading}
              color="secondary"
              //size="small"
              sx={{
                textTransform: "none",
                marginLeft: "auto !important",
                width: "120px",
              }}
            >
              Add role
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
}

export default Filter;
