import { apiSlice } from "../../app/apiSlice";

export const fileUploadApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation<FileUploadResponse, FormData>({
      query: (data) => ({
        url: "/member/addProfilePicture",
        method: "POST",
        headers: {
          // "Content-Type": "multipart/form-data; boundary=---BOUNDARY",
        },
        body: data,
        formData: true,
      }),
    }),
  }),
});

export const { useUploadFileMutation } = fileUploadApiSlice;

interface FileUploadResponse {
  finalFilename: string;
}
