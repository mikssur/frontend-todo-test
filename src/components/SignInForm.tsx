import {
  Dialog,
  DialogTitle,
  TextField,
  Button,
  DialogActions,
  DialogContent,
  Alert,
  IconButton,
  Collapse,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import { useState, useContext } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import axios from "axios";
import Cookies from "universal-cookie";
import { AuthContext } from "../contexts/AuthContext";
import { TodoContext } from "../contexts/TodoContext";

const cookies = new Cookies();

interface IFormInputs {
  LoginField: string;
  PassField: string;
}

export const SignInForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<IFormInputs>();

  const [openAlert, setOpenAlert] = useState(false);
  const { openAlertEdit, setOpenAlertEdit } = useContext(TodoContext);
  const { openSignInForm, setIsAdmin, handleCloseSignInForm } = useContext(AuthContext);

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    const response = await axios.post(
      `https://mikssur-test-todo-backend.herokuapp.com/auth/login`,
      {
        login: data.LoginField,
        password: data.PassField,
      }
    );
    const json = await response.data;

    if (json.status === "success") {
      cookies.set("token", json.token, { path: "/" });
      handleCloseSignInForm();
      setIsAdmin(true);
      setOpenAlertEdit(false);
      setOpenAlert(false);
    } else if (json.status === "error") {
      setOpenAlert(true);
    }
  };

  return (
    <StyledDialog fullWidth open={openSignInForm} onClose={handleCloseSignInForm}>
      <Collapse in={openAlert}>
        <Alert
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpenAlert(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          Wrong login or password
        </Alert>
      </Collapse>
      <Collapse in={openAlertEdit}>
        <StyledAlert
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpenAlertEdit(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          Not authorized, please log in
        </StyledAlert>
      </Collapse>
      <DialogTitle>Sign in from</DialogTitle>
      <DialogContent>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <InputSection>
              <Controller
                name="LoginField"
                control={control}
                defaultValue=""
                render={() => (
                  <TextField
                    id="outlined-basic"
                    label="User login"
                    variant="outlined"
                    {...register("LoginField", {
                      required: "Required",
                    })}
                  />
                )}
              />
              {errors?.LoginField?.type === "required" && (
                <ValidationMessage>Login is required</ValidationMessage>
              )}
            </InputSection>
            <InputSection>
              <Controller
                name="PassField"
                control={control}
                rules={{ required: true }}
                render={() => (
                  <TextField
                    id="outlined-basic"
                    label="Password"
                    type="password"
                    {...register("PassField", {
                      required: "Required",
                    })}
                  />
                )}
              />
              {errors?.PassField?.type === "required" && (
                <ValidationMessage>Password is required</ValidationMessage>
              )}
            </InputSection>
          </Row>
          <DialogActions>
            <Button onClick={handleCloseSignInForm}>Cancel</Button>
            <Button type="submit">Sign in</Button>
          </DialogActions>
        </Form>
      </DialogContent>
    </StyledDialog>
  );
};

const Row = styled("div")({
  display: "flex",
  width: "100%",
  justifyContent: "space-between",
  marginTop: 10,
  marginBottom: 20,
});

const Form = styled("form")({
  width: "100%",
});

const ValidationMessage = styled("p")({
  color: "red",
});

const InputSection = styled("div")({
  display: "flex",
  flexDirection: "column",
});

const StyledDialog = styled(Dialog)({
  maxWidth: 600,
  marginLeft: "auto",
  marginRight: "auto",
});

const StyledAlert = styled(Alert)({
  marginBottom: "20px",
});
