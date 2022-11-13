import {
  AppBar,
  Container,
  Typography,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
} from "@mui/material";
import Select from "@mui/material/Select";
import { styled } from "@mui/material/styles";
import { useContext } from "react";
import { TodoContext } from "../contexts/TodoContext";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

interface Props {
  handleClickOpenForm: () => void;
}

export const HeaderBar = ({ handleClickOpenForm }: Props) => {
  const { isAdmin, setIsAdmin, handleOpenSignInForm } = useContext(AuthContext);
  const { checked, setChecked, sort, setSort, todoListRefresh, setTodoListRefresh } =
    useContext(TodoContext);

  const handleLogOut = async () => {
    cookies.set("token", "", { path: "/" });
    await axios.put("http://3.253.4.69:5000/auth/logout", { login: "admin" });
    setIsAdmin(false);
    setTodoListRefresh(!todoListRefresh);
  };

  return (
    <AppBar position="static">
      <StyledContainer maxWidth="xl">
        <BarLeftSection>
          <StyledButton onClick={handleClickOpenForm}>Add todo</StyledButton>
          <StyledFormControl>
            <StyledInputLabel>Sort by</StyledInputLabel>
            <Select
              value={sort}
              sx={{
                "&:hover": {
                  "&& fieldset": {
                    borderColor: "transparent",
                  },
                },
                color: "#ffffff",
                fontWeight: 500,
                fontSize: "14px",
                textTransform: "upperCase",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "transparent",
                },
                "& .MuiSelect-icon": {
                  fill: "#ffffff",
                },
                "&:active": {
                  "&& fieldset": {
                    borderColor: "transparent",
                  },
                },
                borderColor: "transparent",
              }}
              label="Sort by"
              onChange={(event) => setSort(event.target.value)}
            >
              <MenuItem value={"userName"}>Name</MenuItem>
              <MenuItem value={"userEmail"}>Email</MenuItem>
              <MenuItem value={"status"}>Status</MenuItem>
              <MenuItem value={""}>None</MenuItem>
            </Select>
          </StyledFormControl>
          <FormControlLabel
            label="Reverse sort"
            control={
              <Switch
                checked={checked}
                onChange={(event) => setChecked(event.target.checked)}
                color="secondary"
                inputProps={{ "aria-label": "controlled" }}
              />
            }
          ></FormControlLabel>
        </BarLeftSection>

        {isAdmin ? (
          <StyledTypography onClick={handleLogOut} variant="h6">
            Sign out
          </StyledTypography>
        ) : (
          <StyledTypography onClick={handleOpenSignInForm} variant="h6">
            Sign In
          </StyledTypography>
        )}
      </StyledContainer>
    </AppBar>
  );
};

const BarLeftSection = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
}));

const StyledContainer = styled(Container)({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: "10px",
  marginBottom: "10px",
});

const StyledButton = styled(Button)({
  color: "white",
  marginRight: "40px",
  minWidth: 93,
});

const StyledFormControl = styled(FormControl)({
  minWidth: 100,
});

const StyledInputLabel = styled(InputLabel)({
  color: "white",
});

const StyledTypography = styled(Typography)({
  cursor: "pointer",
  marginTop: "auto",
  marginBottom: "auto",
});
