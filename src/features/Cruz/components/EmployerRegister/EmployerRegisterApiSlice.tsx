import { apiSlice } from "../../../../app/apiSlice";

export const employeeRegisterApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    employeeRegister: builder.mutation({
      query: (userData) => ({
        url: "/employer/registration",
        method: "POST",
        body: { ...userData },
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useEmployeeRegisterMutation } = employeeRegisterApiSlice;
