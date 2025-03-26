import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import CustomInput from "../../components/CustomInput/CustomInput";
import { Button } from "../../components/Button/Button";
import { Heading } from "../../components/Heading/Heading";
import "../../assets/scss/contact.scss";
import { ContactInterface } from "../../types";
import { useContactMutation } from "./ContactSlice";
import DialCodePicker from "../../components/CountryPicker/DialcodePicker";
import { TelephoneField } from "../../components/TelephoneField/TelephoneField";

function ContactForm() {
  const form = useForm<ContactInterface>();
  const { register, control, handleSubmit, formState } = form;
  const { errors } = formState;
  const [sendStatus, setSendStatus] = useState(false);
  const [contactMutation, { isLoading }] = useContactMutation();
  const [dialcode, setDialcode] = useState("");
  const onSubmit = async (data: ContactInterface) => {
    data.members_phone_code = data.phone_code;

    const userData = await contactMutation(data);
    if ("error" in userData) {
      console.error("Error logging in:", userData.error);
    } else {
      if (userData.data.success) setSendStatus(true);
    }
  };
  const handleDialCodeSelect = (dialCode: string) => {
    setDialcode(dialCode);
  };
  return (
    <div className="contact-details form-details">
      {sendStatus ? (
        <div>
          <Heading tag="h3">
            <p className="success-line">Thank you</p>
          </Heading>
          <div className="enquiry col-md-10">
            <Heading tag="h4">Your message has been sent successfully</Heading>
          </div>
        </div>
      ) : (
        <div className="contact-form">

          <div className="row mx-0">
            <FormProvider {...form}>
              <form onSubmit={handleSubmit(onSubmit)} noValidate
                className={Object.keys(errors).length ? 'invalid' : ''}
              >
                <Heading tag="h3">
                  <p className="top-line">Send a Message</p>
                </Heading>
                <div className="row small-gutters px-2">
                  {/* <div className="col-md-3">
                    <CustomInput
                      name="members_name_title"
                      placeholder="Title"
                      type="text"
                      registerConfig={{
                        required: {
                          value: true,
                          message: "Title is required",
                        },
                      }}
                      className="input-block"
                    />
                  </div> */}
                  <div className="col-md-6">
                    <CustomInput
                      name="members_fname"
                      placeholder="First Name"
                      type="text"
                      registerConfig={{
                        required: {
                          value: true,
                          message: "First Name is required",
                        },
                      }}
                      className="input-block"
                    />
                  </div>
                  <div className="col-md-6">
                    <CustomInput
                      name="members_lname"
                      placeholder="Surname"
                      type="text"
                      registerConfig={{
                        required: {
                          value: true,
                          message: "Surname is required",
                        },
                      }}
                      className="input-block"
                    />
                  </div>

                  <div className="col-md-12">
                    {/* <CustomInput
                      name="members_phone_code"
                      placeholder="+44"
                      type="text"
                      registerConfig={{
                        required: {
                          value: true,
                          message: "Dialcodes  is required",
                        },
                      }}
                      className="input-block"
                    /> */}
                    {/* <DialCodePicker
                      name="members_phone_code"
                      onSelect={handleDialCodeSelect}
                      initialValue={dialcode}
                    /> */}
                    {/* <TelephoneField
                      name="members_phone_number"
                      registerConfig={{
                        required: { value: true, message: " Phone number is required" },
                      }}
                    /> */}
                  </div>
                  {/* <div className="col-md-10">
                    <CustomInput
                      name="members_phone_number"
                      placeholder="Phone Number"
                      type="text"
                      registerConfig={{
                        required: {
                          value: true,
                          message: "Phone Number is required",
                        },
                      }}
                      className="input-block"
                    />
                  </div> */}

                  <div className="col-md-12">
                    <CustomInput
                      name="members_email"
                      placeholder="Email Address"
                      type="text"
                      registerConfig={{
                        required: {
                          value: true,
                          message: "Email is required",
                        },
                      }}
                      className="input-block"
                    />
                  </div>
                  <div className="col-md-12">
                    <CustomInput
                      name="message"
                      placeholder="Message"
                      type="text"
                      registerConfig={{
                        required: {
                          value: true,
                          message: "Message is required",
                        },
                      }}
                      className="input-block"
                    />

                  </div>
                </div>
                <div className="send-btn">
                  <Button
                    onClick={() => console.log('')}
                    text="Send Message"
                    icon={true}
                    theme="light"
                    className="w-100"
                  />
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContactForm;
