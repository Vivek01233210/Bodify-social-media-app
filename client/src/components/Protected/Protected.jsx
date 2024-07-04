import { useQuery } from "@tanstack/react-query";
import { checkAuthStatusAPI } from "../../APIServices/userAPI";
import { Navigate } from "react-router-dom";
import LoadingAuth from "./LoadingAuth";

const Protected = ({ children }) => {

  const { data, isLoading } = useQuery({
    queryKey: ["user-auth"],
    queryFn: checkAuthStatusAPI,
  });


  if (isLoading) return <LoadingAuth/>

  if (!data) return <Navigate to='/login' />

  return children;
};

export default Protected;