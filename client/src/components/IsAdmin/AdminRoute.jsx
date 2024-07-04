import { useQuery } from "@tanstack/react-query";
import { checkAuthStatusAPI } from "../../APIServices/userAPI";
import { Navigate, useNavigate } from "react-router-dom";
import LoadingAuth from "./LoadingAuth";
import AlertMessage from "../Alert/AlertMessage";

const Admin = ({ children }) => {

  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["user-auth"],
    queryFn: checkAuthStatusAPI,
  });

  if (isLoading) return <LoadingAuth />

  if (!data) return <Navigate to='/login' />

  if (data?.isAdmin === true) return children;

  return (
    <>
      <AlertMessage type="error" message="Access Denied! Route only for Admins" />
      <button
      onClick={() => navigate(-1)} 
      className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded">
        Go Back
      </button>
    </>
  )

};

export default Admin;