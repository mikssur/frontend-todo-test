import { useState, useContext } from "react";
import { Container, Card, Pagination, Typography } from "@mui/material";
import { HeaderBar } from "./components/HeaderBar";
import { TodoForm } from "./components/TodoForm";
import { TodoItem } from "./components/TodoItem";
import { SignInForm } from "./components/SignInForm";
import { TodoContext } from "./contexts/TodoContext";
import { styled } from "@mui/material/styles";

export const App = () => {
  const [openForm, setOpenForm] = useState(false);

  const { totalPagesNumber, handleChangePage, pageNumber, list } =
    useContext(TodoContext);

  return (
    <div className="App">
      <StyledContainer maxWidth="lg">
        <StyledCard>
          <HeaderBar handleClickOpenForm={() => setOpenForm(true)} />
          <TodoForm
            openForm={openForm}
            handleCloseAddForm={() => setOpenForm(false)}
            todo={null}
            edit={false}
          />
          <SignInForm />
          {list.length ? (
            list.map((todo) => {
              return <TodoItem key={todo._id} todo={todo} />;
            })
          ) : (
            <StyledTypography color={"primary"} variant="h5">
              No todos yet
            </StyledTypography>
          )}
          <StyledPagination
            count={totalPagesNumber}
            page={pageNumber}
            onChange={handleChangePage}
          />
        </StyledCard>
      </StyledContainer>
    </div>
  );
};

const StyledCard = styled(Card)({
  margin: "auto",
  minHeight: "400px",
  width: 800,
  height: "100%",
  display: "flex",
  alignContent: "center",
  flexDirection: "column",
});

const StyledPagination = styled(Pagination)({
  marginTop: "auto",
  paddingTop: "20px",
  marginBottom: "20px",
  marginLeft: "auto",
  marginRight: "auto",
});

const StyledTypography = styled(Typography)({
  margin: "auto",
});

const StyledContainer = styled(Container)({
  minHeight: "100vh",
  display: "flex",
  alignContent: "center",
  justifyContent: "center",
});
