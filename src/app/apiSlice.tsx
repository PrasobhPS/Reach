import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logOut } from "./authSlice";
import { RootState } from "./Store";
import { clearUserData } from "../utils/Utils";
const baseUrl = process.env.REACT_APP_API_BASE_URL;
const baseQuery = fetchBaseQuery({
  // baseUrl: "http://192.168.1.157:80/api",
  baseUrl,
  // credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    headers.set("Accept", "*/*");
    // headers.set("Content-Type", "application/json");
    headers.set("X-API-KEY", "493d25ea-24d9-4662-ae7b-c96255ecbbe6");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },

});
const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result: any = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401 && result?.error?.data?.error === 'Session expired, please log in again') {

    clearUserData();
  }

  return result;
};
export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'SideMenu',
  ],
  endpoints: (builder) => ({}),
});
// export const apiSlice = createApi({
//   baseQuery: fetchBaseQuery({
//     baseUrl: "http://192.168.1.146/api",
//     // credentials: "include",
//   }),
//   endpoints: () => ({}),
// });
