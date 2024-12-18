import React from "react";
import {
  Stack,
  Typography,
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

function Filter({ setFilterValues, filterValues, FilterData, showCreateBtn }) {
  const navigate = useNavigate();
  const handleChangeMultiSelect = (event) => {
    const {
      target: { value, name },
    } = event;
    setFilterValues((prev) => ({
      ...prev,
      [name]: typeof value === "string" ? value.split(",") : value,
    }));
  };

  return (
    <Card sx={{ padding: "32px 28px 40px 28px" }}>
      <Grid container spacing={1}>
        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
          <Typography variant="h6" textAlign={"left"}>
            Users
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
          <Stack
            direction={{ xs: "column", md: "column", lg: "row" }}
            spacing={2}
          >
            <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
              <OutlinedInput
                placeholder="Search users"
                //size="small"
                endAdornment={
                  <InputAdornment>
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                }
                // label="Name"
                value={filterValues?.name}
                onChange={(event) => {
                  setFilterValues((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }));
                }}
              />
            </FormControl>
            {[
              {
                label: "Status",
                name: "status",
                options: FilterData?.status || [],
              },
            ].map((ele, i) => (
              <FormControl
                //size="small"
                key={i}
              >
                <InputLabel id={`${ele.label}-label`}>{ele.label}</InputLabel>
                <Select
                  labelId={`${ele.label}-label`}
                  id={ele.label}
                  // multiple
                  value={filterValues[ele.name] || ""}
                  onChange={handleChangeMultiSelect}
                  name={ele.name}
                  placeholder={ele.label}
                  sx={{ minWidth: "150px" }}
                  input={<OutlinedInput label={ele?.label} />}
                >
                  {ele?.options?.map((name) => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ))}

            {showCreateBtn && (
              <Button
                variant="contained"
                onClick={() => {
                  navigate("/management/users/add");
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
                Add user
              </Button>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
}

export default Filter;
