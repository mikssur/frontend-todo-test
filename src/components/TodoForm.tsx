import {
  Dialog,
  DialogTitle,
  TextField,
  Button,
  DialogActions,
  DialogContent,
} from "@mui/material";
import axios from "axios";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { styled } from "@mui/material/styles";
import { useContext } from "react";
import { TodoContext } from "../contexts/TodoContext";
import { AuthContext } from "../contexts/AuthContext";
import Cookies from "universal-cookie";
import { Todo } from "./TodoItem";

const cookies = new Cookies();

interface IFormInputs {
  TextField: string;
  EmailField: string;
  ContentField: string;
}

interface Props {
  openForm: boolean;
  handleCloseAddForm: () => void;
  todo: Todo | null;
  edit: boolean;
}

export const TodoForm = ({ openForm, handleCloseAddForm, todo, edit }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<IFormInputs>();

  const { setOpenAlertEdit, todoListRefresh, setTodoListRefresh } =
    useContext(TodoContext);
  const { setIsAdmin, handleOpenSignInForm } = useContext(AuthContext);

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    const config = {
      headers: {
        authorization: `Bearer ${cookies.get("token")}`,
      },
    };
    if (edit) {
      const response = await axios.put(
        `https://3.253.4.69:5000/todo/updateTodoContent`,
        {
          content: data.ContentField,
          id: todo?._id,
          login: "admin",
        },
        config
      );
      const json = await response.data;

      if (json.status === "success") {
        handleCloseAddForm();
        setTodoListRefresh(!todoListRefresh);
      } else if (json.status === "token expired" || json.status === "Not authorized") {
        setIsAdmin(false);
        handleCloseAddForm();
        handleOpenSignInForm();
        setOpenAlertEdit(true);
      }
    } else {
      const response = await axios.post(`https://3.253.4.69:5000/todo/createTodo`, {
        content: data.ContentField,
        userName: data.TextField,
        userEmail: data.EmailField,
        status: false,
        edit: false,
      });
      const json = await response.data;
      if (json.status === "success") {
        handleCloseAddForm();
        setTodoListRefresh(!todoListRefresh);
      }
    }
  };

  return (
    <StyledDialog fullWidth open={openForm} onClose={handleCloseAddForm}>
      <DialogTitle>Fill the form</DialogTitle>
      <DialogContent>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <InputSection>
              <Controller
                name="TextField"
                control={control}
                defaultValue={edit ? todo?.userName : ""}
                render={() => (
                  <TextField
                    disabled={edit}
                    id="outlined-basic"
                    label="User login"
                    variant="outlined"
                    {...register("TextField", {
                      required: "Required",
                      maxLength: 10,
                    })}
                  />
                )}
              />
              {errors?.TextField?.type === "required" && (
                <ValidationMessage>User name is required</ValidationMessage>
              )}
              {errors?.TextField?.type === "maxLength" && (
                <ValidationMessage>Max 10 characters</ValidationMessage>
              )}
            </InputSection>
            <InputSection>
              <Controller
                name="EmailField"
                control={control}
                rules={{ required: true }}
                defaultValue={edit ? todo?.userEmail : ""}
                render={() => (
                  <TextField
                    disabled={edit}
                    id="outlined-basic"
                    label="Email"
                    type="email"
                    {...register("EmailField", {
                      required: "Required",
                    })}
                  />
                )}
              />
              {errors?.EmailField?.type === "required" && (
                <ValidationMessage>Email is required</ValidationMessage>
              )}
            </InputSection>
          </Row>
          <InputSection>
            <Controller
              name="ContentField"
              control={control}
              defaultValue={edit ? todo?.content : ""}
              rules={{ required: true }}
              render={() => (
                <StyledTextField
                  id="standard-multiline-static"
                  multiline
                  rows={4}
                  label="Content"
                  {...register("ContentField", {
                    required: "Required",
                  })}
                />
              )}
            />
            {errors?.ContentField?.type === "required" && (
              <ValidationMessage>Cannot be empty</ValidationMessage>
            )}
          </InputSection>
          <DialogActions>
            <Button onClick={handleCloseAddForm}>Cancel</Button>
            <Button type="submit">{edit ? "Edit" : "Add"}</Button>
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

const StyledTextField = styled(TextField)({
  width: "100%",
});
