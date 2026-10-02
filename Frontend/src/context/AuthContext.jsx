import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getCurrentUser,
  loginUser,
  logoutUser,
} from "../services/authService";


const AuthContext = createContext(null);


export const AuthProvider = ({ children }) => {

  const [token, setToken] = useState(
    localStorage.getItem("access_token")
  );

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(
    Boolean(token)
  );


  // LOAD CURRENT USER

  useEffect(() => {

    const loadCurrentUser = async () => {

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }


      try {

        setLoading(true);

        const currentUser =
          await getCurrentUser();

        setUser(currentUser);

      } catch (error) {

        console.error(
          "Unable to load current user:",
          error
        );

        logoutUser();

        setToken(null);
        setUser(null);

      } finally {

        setLoading(false);

      }

    };


    loadCurrentUser();

  }, [token]);


  // LOGIN

  const login = async (
    email,
    password
  ) => {

    const data = await loginUser(
      email,
      password
    );


    localStorage.setItem(
      "access_token",
      data.access_token
    );


    setToken(
      data.access_token
    );


    return data;

  };


  // LOGOUT

  const logout = () => {

    logoutUser();

    setToken(null);
    setUser(null);

  };


  const isAuthenticated =
    Boolean(token && user);


  const isAdmin =
    user?.role === "ADMIN";


  return (

    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        logout,
      }}
    >

      {children}

    </AuthContext.Provider>

  );

};


export const useAuth = () => {

  const context = useContext(
    AuthContext
  );


  if (!context) {

    throw new Error(
      "useAuth must be used inside AuthProvider"
    );

  }


  return context;

};