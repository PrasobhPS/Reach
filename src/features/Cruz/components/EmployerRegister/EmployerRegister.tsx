import { FormProvider, useForm } from "react-hook-form";
import { Heading } from "../../../../components/Heading/Heading";
import "./EmployerRegister.scss";
import CustomInput from "../../../../components/CustomInput/CustomInput";
import { Button } from "../../../../components/Button/Button";
import { FileUpload } from "../../../../components/FileUpload/FileUpload";
import CountryPicker from "../../../../components/CountryPicker/CountryPicker";
import { Hero } from "../../../../components/Hero/Hero";
import { TelephoneField } from "../../../../components/TelephoneField/TelephoneField";
import { Employer } from "../../../../types";
import { useState } from "react";
import { useEmployeeRegisterMutation } from "./EmployerRegisterApiSlice";
import { setItem } from "../../../../utils/Utils";

export const EmployerRegister = () => {
  const [employeeRegister] = useEmployeeRegisterMutation();
  const form = useForm<Employer>();
  const { register, control, handleSubmit, formState } = form;
  const { errors } = formState;
  const [fileName, setFileName] = useState<string | null>(null);
  const onSubmit = async (data: Employer) => {
    data.employer_phone_code = data.phone_code;
    data.employer_profile_picture = fileName;
    const userData = await employeeRegister(data);
    if ("error" in userData) {
      console.error("Error logging in:", userData.error);
    } else {
      setItem("employer", userData.data.data);
    }
  };
  const getFileName = (name: string | null) => {
    setFileName(name);
  };

  return (
    <div className="employer-register">
      <Heading>register and VERIFY AS AN EMPLOYER</Heading>
      <p className="text-para">
        To post job opportunities we require all employers to verify their
      </p>
      <div className="registration-form">
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <h2 className="customHeading">Proof of Position</h2>
            <div className="description-text">
              <p>In order to post a job we need to know you have the ability to employ others. therefore we need evidence...</p>
            </div>
            <div className="proofUpload">
              <FileUpload getFileName={getFileName} folderName="employers" />
            </div>
            <div className="identity-verification">
              <h2 className="customHeading">identity verification</h2>
              <CustomInput
                name="members_fname"
                placeholder="AUTOMATED VERIFICATION STAGE HERE"
                type="text"
                rows={3}
                registerConfig={{
                  required: {
                    value: true,
                    message: "First Name is required",
                  },
                }}
                className="input-block"
              />
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};
