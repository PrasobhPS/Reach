import { Navigate, useRoutes } from "react-router-dom";
import { publicRoutes } from "./public";
import { protectedRoutes } from "./protected";
import { memberRoutes } from "./member";
import { MainLayout } from "../components/Layout/MainLayout";
import { getUserData } from "../utils/Utils";

export const AppRoutes = () => {
  const userData = getUserData("userData");
  let auth = false;
  let member = true;
  if (userData !== null) {
    auth = true;
  }
  if (userData?.Member_type === "M") {
    member = true;
  }

  const commonRoutes = publicRoutes;

  const routes = auth
    ? protectedRoutes
    : [{ path: "*", element: <Navigate to="/" replace /> }];
  const memberPages = member ? memberRoutes : [{ path: "*", element: "" }];

  const element = useRoutes([...routes, ...memberPages, ...commonRoutes]);
  return <MainLayout>{element}</MainLayout>;
};
