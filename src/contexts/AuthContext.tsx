import { useState, createContext, useEffect, ReactNode, FC, useCallback } from "react";
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

interface AuthContextInterface {
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
  handleOpenSignInForm: () => void;
  handleCloseSignInForm: () => void;
  handleLogOut: () => void;
  openSignInForm: boolean;
}

interface ProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextInterface>({
  isAdmin: false,
  setIsAdmin: () => {},
  handleOpenSignInForm: () => {},
  handleCloseSignInForm: () => {},
  handleLogOut: () => {},
  openSignInForm: false,
});

export const AuthProvider: FC<ProviderProps> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [openSignInForm, setOpenSignInForm] = useState(false);

  const handleLogOut = async () => {
    cookies.set("token", "", { path: "/" });
    await axios.put("https://3.253.4.69:5000/auth/logout", { login: "admin" });
    setIsAdmin(false);
  };

  const handleOpenSignInForm = () => {
    setOpenSignInForm(true);
  };

  const handleCloseSignInForm = () => {
    setOpenSignInForm(false);
  };

  const checkToken = useCallback(async () => {
    const config = {
      headers: {
        authorization: `Bearer ${cookies.get("token")}`,
      },
    };
    const response = await axios.post(
      "https://3.253.4.69:5000/auth/checkToken",
      {
        login: "admin",
      },
      config
    );
    const json = await response.data;

    return json;
  }, []);

  useEffect(() => {
    const token = cookies.get("token");

    if (token !== "") {
      checkToken().then((result) => {
        if (result.status === "success") {
          setIsAdmin(true);
        } else {
          cookies.set("token", "", { path: "/" });
          setIsAdmin(false);
        }
      });
    } else {
      setIsAdmin(false);
    }
  }, [checkToken]);

  return (
    <AuthContext.Provider
      value={{
        isAdmin,
        setIsAdmin,
        handleOpenSignInForm,
        handleCloseSignInForm,
        handleLogOut,
        openSignInForm,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
