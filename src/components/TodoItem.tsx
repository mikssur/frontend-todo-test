import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Checkbox,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { TodoForm } from "./TodoForm";
import { useContext, useState } from "react";
import Cookies from "universal-cookie";
import { TodoContext } from "../contexts/TodoContext";
import { AuthContext } from "../contexts/AuthContext";

const cookies = new Cookies();

export interface Todo {
  _id: string;
  userName: string;
  userEmail: string;
  content: string;
  status: boolean;
  edit: boolean;
}
interface Props {
  todo: Todo;
}

export const TodoItem = ({ todo }: Props) => {
  const [openForm, setOpenForm] = useState(false);
  const { todoListRefresh, setTodoListRefresh, setOpenAlertEdit } =
    useContext(TodoContext);
  const { isAdmin, setIsAdmin, handleOpenSignInForm } = useContext(AuthContext);
  const { userName, userEmail, content, status, _id } = todo;

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    let config = {
      headers: {
        authorization: `Bearer ${cookies.get("token")}`,
      },
    };
    const response = await axios.put(
      `https://mikssur-test-todo-backend.herokuapp.com/todo/updateTodoStatus`,
      {
        id: _id,
        login: "admin",
        status: !status,
      },
      config
    );
    const json = await response.data;

    if (json.status === "success") {
      setTodoListRefresh(!todoListRefresh);
    } else if (json.status === "token expired" || json.status === "Not authorized") {
      setIsAdmin(false);
      handleOpenSignInForm();
      setOpenAlertEdit(true);
    }
  };

  return (
    <Accordion>
      <StyledAccordionSummary
        aria-controls="panel1bh-content"
        id="panel1bh-header"
        expandIcon={<ExpandMoreIcon />}
      >
        <StyledTypography>
          {content.length > 10 ? content.slice(0, 10) + "..." : content}
        </StyledTypography>
        <StyledTypography>{userName}</StyledTypography>
        <StyledTypography>{userEmail}</StyledTypography>
        <DoneSection>
          <Typography>Done:&nbsp;</Typography>
          <StyledCheckbox
            sx={{
              color: "green",
              "&.Mui-checked": {
                color: "green",
              },
              textAlign: "center",
            }}
            onChange={handleChange}
            onClick={(e) => {
              e.stopPropagation();
            }}
            disabled={!isAdmin}
            checked={status}
          />
        </DoneSection>
      </StyledAccordionSummary>
      <TodoForm
        openForm={openForm}
        handleCloseAddForm={() => setOpenForm(false)}
        todo={todo}
        edit={true}
      />
      <StyledAccordionDetails>
        <StyledTypographyContent>{content}</StyledTypographyContent>
        <ContentLowerRow>
          {isAdmin && (
            <StyledEditButton onClick={() => setOpenForm(true)}>Edit</StyledEditButton>
          )}
          {todo?.edit && (
            <StyledTypographySecondary color={"text.secondary"}>
              Edited by admin
            </StyledTypographySecondary>
          )}
        </ContentLowerRow>
      </StyledAccordionDetails>
    </Accordion>
  );
};

const DoneSection = styled("div")({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
});

const ContentLowerRow = styled("div")({
  display: "flex",
  flexDirection: "row-reverse",
  justifyContent: "space-between",
});

const StyledTypography = styled(Typography)({
  display: "flex",
  alignItems: "center",
  width: "100%",
});

const StyledTypographySecondary = styled(Typography)({
  display: "flex",
  alignItems: "center",
  width: "100%",
});

const StyledTypographyContent = styled(Typography)({
  wordBreak: "break-word",
});

const StyledEditButton = styled(Button)({
  alignSelf: "flex-end",
});

const StyledAccordionDetails = styled(AccordionDetails)({
  borderTop: "1px solid rgba(0, 0, 0, 0.1)",
  display: "flex",
  flexDirection: "column",
});

const StyledCheckbox = styled(Checkbox)({
  color: "green",
  "&.Mui-checked": {
    color: "green",
  },
  textAlign: "center",
});

const StyledAccordionSummary = styled(AccordionSummary)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
});
