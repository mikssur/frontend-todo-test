import {
  useState,
  createContext,
  useEffect,
  ReactNode,
  FC,
  useCallback,
  ChangeEvent,
} from "react";
import axios from "axios";

interface Todo {
  _id: string;
  userName: string;
  userEmail: string;
  content: string;
  status: boolean;
  edit: boolean;
}

interface TodoContextInterface {
  list: Todo[];
  openForm: boolean;
  setOpenForm: (value: boolean) => void;
  pageNumber: number;
  todoListRefresh: boolean;
  setTodoListRefresh: (value: boolean) => void;
  currentPage: number;
  totalPagesNumber: number;
  sort: string;
  checked: boolean;
  setChecked: (value: boolean) => void;
  handleClickOpenAddForm: () => void;
  handleCloseAddForm: () => void;
  setSort: (value: string) => void;
  handleChangePage: (_: ChangeEvent<unknown>, value: number) => void;
  openAlertEdit: boolean;
  setOpenAlertEdit: (value: boolean) => void;
}

export const TodoContext = createContext<TodoContextInterface>({
  list: [],
  openForm: false,
  setOpenForm: () => {},
  pageNumber: 1,
  todoListRefresh: false,
  setTodoListRefresh: () => {},
  currentPage: 0,
  totalPagesNumber: 0,
  sort: "",
  checked: false,
  setChecked: () => {},
  handleClickOpenAddForm: () => {},
  handleCloseAddForm: () => {},
  setSort: () => {},
  handleChangePage: () => {},
  openAlertEdit: false,
  setOpenAlertEdit: () => {},
});

interface ProviderProps {
  children: ReactNode;
}

export const TodoProvider: FC<ProviderProps> = ({ children }) => {
  const [list, setList] = useState<Array<Todo>>([]);
  const [openForm, setOpenForm] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [todoListRefresh, setTodoListRefresh] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPagesNumber, setTotalPagesNumber] = useState(0);
  const [sort, setSort] = useState("");
  const [openAlertEdit, setOpenAlertEdit] = useState(false);
  const [checked, setChecked] = useState(false);

  const handleClickOpenAddForm = () => {
    setOpenForm(true);
  };

  const handleCloseAddForm = () => {
    setOpenForm(false);
  };

  const handleChangePage = (_: ChangeEvent<unknown>, value: number) => {
    setPageNumber(value);
    setCurrentPage(value - 1);
  };

  const getTodos = useCallback(async () => {
    const response = await axios.get(
      `http://3.253.4.69:5000/todo/allTodos/?page=${currentPage}&sort=${sort}&checked=${checked}`
    );
    const json = await response.data;

    return json;
  }, [currentPage, sort, checked]);

  useEffect(() => {
    getTodos().then((result) => {
      setList(result.todos);
      setTotalPagesNumber(Math.ceil(result.total / 3));
    });
  }, [todoListRefresh, currentPage, sort, checked, getTodos]);

  return (
    <TodoContext.Provider
      value={{
        list,
        openForm,
        setOpenForm,
        pageNumber,
        todoListRefresh,
        setTodoListRefresh,
        currentPage,
        totalPagesNumber,
        sort,
        checked,
        setChecked,
        handleClickOpenAddForm,
        handleCloseAddForm,
        setSort,
        handleChangePage,
        openAlertEdit,
        setOpenAlertEdit,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};
