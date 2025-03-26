import React, { useState } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { useGlobalModalContext } from "../../utils/GlobalModal";
import { Heading } from "../../components/Heading/Heading";
import CustomInput from "../../components/CustomInput/CustomInput";
import { FormProvider, useForm } from "react-hook-form";
import "./ChangePassword.scss";
import { Button } from "../../components/Button/Button";
import { useChangePasswordMutation } from "./ChangePasswordApiSlice";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { useNavigate } from "react-router-dom";
import { clearUserData } from "../../utils/Utils";
interface formValues {
  old_password: string;
  new_password: string;
  new_password_confirmation: string;
}

function ChangePassword() {
  const navigate = useNavigate();
  const { hideModal, store } = useGlobalModalContext();
  const { modalProps } = store || {};
  const { title, confirmBtn } = modalProps || {};
  const handleModalToggle = () => {
    hideModal();
  };
  const form = useForm<formValues>();
  const { register, control, handleSubmit, formState, watch } = form;
  const { errors } = formState;
  const [errorMessage, setErrorMsg] = useState("");
  const [changePassword] = useChangePasswordMutation();
  const onSubmit = async (data: formValues) => {
    const userData = await changePassword(data);
    // let errorMessage: string = "";
    if ("error" in userData) {
      console.error("Error logging in:", userData.error);
      if (typeof userData.error === "string") {
        setErrorMsg(userData.error); // Assign the error message if it's already a string
      } else {
        const fetchError = userData.error as FetchBaseQueryError; // Type assertion
        if (
          fetchError.data &&
          typeof fetchError.data === "object" &&
          "error" in fetchError.data &&
          typeof fetchError.data.error === "string"
        ) {
          setErrorMsg(fetchError.data.error);
        } else {
          setErrorMsg("An error occurred"); // Handle cases where error property doesn't exist
        }
      }
    } else {
      setErrorMsg("");
      hideModal();
      clearUserData();
      navigate("/");
    }
  };
  const password = watch("new_password");
  const validatePasswordMatch = (value: string) => {
    return value === password || "Passwords do not match";
  };
  return (
    <div className="profile-box">
      <div className="profile-box-inner">
        <Modal
          title={title || "Sign In"}
          isOpen={true}
          onClose={handleModalToggle}
          centered
          className="Profilebox-modal changePassword-modal"
        >
          <ModalBody>
            <ModalHeader toggle={handleModalToggle}>
              <Heading tag="h3" className="text-center">
                Change Password
              </Heading>
            </ModalHeader>
            <div className="row  mx-0 profile-form">
              {/* <div className="col-md-3"></div> */}
              <div className="content-box">
                <FormProvider {...form}>
                  <form
                    className="login-field"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                  >
                    <CustomInput
                      name="old_password"
                      placeholder="Old Password"
                      type="password"
                      registerConfig={{
                        required: {
                          value: true,
                          message: "Old password is required",
                        },
                      }}
                      className="input-block"
                    />
                    <CustomInput
                      name="new_password"
                      placeholder="New Password"
                      type="password"
                      registerConfig={{
                        required: {
                          value: true,
                          message: "New password is required",
                        },
                      }}
                      className="input-block"
                    />
                    <CustomInput
                      name="new_password_confirmation"
                      placeholder="Confirm Password"
                      type="password"
                      registerConfig={{
                        required: {
                          value: true,
                          message: "Confirm password is required",
                        },
                        validate: validatePasswordMatch,
                      }}
                      className="input-block"
                    />
                    <div className="error">{errorMessage}</div>
                    <Button
                      onClick={() => console.log("Hello")}
                      text="Update Password"
                      icon={true}
                      theme="light"
                      className="w-100"
                    />
                  </form>
                </FormProvider>
              </div>
              {/* <div className="col-md-3"></div> */}
            </div>
          </ModalBody>
        </Modal>
      </div>
    </div>
  );
}

export default ChangePassword;
