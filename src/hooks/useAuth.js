import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { loadUser, logout } from "../store/authSlice";
import Cookies from "js-cookie";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    const token = Cookies.get("token");
    if (token && !user) {
      dispatch(loadUser());
    }
  }, [dispatch, user]);

  const handleLogout = () => {
    dispatch(logout());
  };

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    logout: handleLogout,
  };
};
