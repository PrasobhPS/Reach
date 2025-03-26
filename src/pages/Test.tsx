import React from "react";
import { Hero } from "../components/Hero/Hero";
import CustomInput from "../components/CustomInput/CustomInput";
import CustomSelect from "../components/CustomSelect/CustomSelect";
import { DevTool } from "@hookform/devtools";
import { DobPicker } from "../components/DobPicker/DobPicker";
import { TelephoneField } from "../components/TelephoneField/TelephoneField";
import { FullWindowImageBox } from "../components/FullWindowImageBox/FullWindowImageBox";
import { TwoColumnImageBox } from "../components/TwoColumnImageBox/TwoColumnImageBox";
import { FeaturesCard } from "../components/FeaturesCard/FeaturesCard";
import { Card } from "../components/Card/Card";
import { Button } from "../components/Button/Button";
import { Heading } from "../components/Heading/Heading";
import { FormProvider, useForm } from "react-hook-form";

let counter = 0;

interface formValues {
  username: string;
  email: string;
}

function Test() {
  const form = useForm<formValues>();
  const { handleSubmit } = form;

  const options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  const featuresOptions = {
    title: "Weather",
    content: "Sample membership text",
    link: "https://www.google.com",
    membership: true,
    free: false,
    open: false,
  };

  counter++;

  const onSubmit = (data: formValues) => {
    console.log("Form Submitted", data);
  };
  return (
    <div className="App">
      <Hero
        source="https://images.pexels.com/photos/36717/amazing-animal-beautiful-beautifull.jpg"
        title="Welcome to hero component"
      >
        <div className='inner-child'>
          <p className="subtext">Lorem ipsum dolor sit amet consectetur. Scelerisque interdum in sapien sed ultricies</p>
        </div>
      </Hero>
      <div className="container">
        <div className="row">
          <div className="col-6 offset-3">
            <h1>{counter / 2}</h1>
            <Button
              onClick={() => console.log("Hello")}
              text="Click me"
              icon={true}
              theme="light"
            />
            <Heading className="customHeading">
              Placeholder <span className="red-color">Test</span>
            </Heading>
            <FormProvider {...form}>
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <CustomInput
                  name="username"
                  placeholder="Username"
                  registerConfig={{
                    required: { value: true, message: "Username is required" }, // Specify required as an object with value and message
                  }}
                />
                <CustomInput
                  name="email"
                  type="email"
                  placeholder="Email"
                  registerConfig={{
                    required: {
                      value: true,
                      message: "Email is required",
                    },
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: "Invalid email address",
                    },
                  }}
                />
                <CustomSelect
                  name="myoption"
                  options={options}
                  registerConfig={{
                    required: { value: true, message: "Select is required" }, // Specify required as an object with value and message
                  }}
                />
                <DobPicker
                  registerConfig={{
                    required: { value: true, message: "is required" }, // Specify required as an object with value and message
                  }}
                />
                <TelephoneField
                  name="phone"
                  registerConfig={{
                    required: { value: true, message: "Phone is required" }, // Specify required as an object with value and message
                  }}
                />
                <button>Submit</button>
              </form>
              <DevTool control={form.control} />
            </FormProvider>
          </div>
        </div>
      </div>
      <FullWindowImageBox
        isVideo={true}
        // source={'https://images.pexels.com/photos/36717/amazing-animal-beautiful-beautifull.jpg'}
        source={require("../assets/videos/banner.mp4")}
      >
        <Heading tag="h2">
          THE ONLINE YACHT CLUB
          <br />
          OPEN ALL YEAR ROUND
        </Heading>
        <p className="text-white">Sub Text</p>
        <div className="button-group">
          <Button
            onClick={() => console.log("Hello")}
            text="Click me"
            icon={true}
            theme="light"
          />
          <Button
            onClick={() => console.log("Hello")}
            text="Click me"
            icon={true}
            theme="light"
          />
        </div>
      </FullWindowImageBox>
      <TwoColumnImageBox
        source="https://images.pexels.com/photos/36717/amazing-animal-beautiful-beautifull.jpg"
        swapColumn={true}
      >
        <Heading>I am Bad</Heading>
        <p>Sub Text</p>
        <Button
          onClick={() => console.log("Hello")}
          text="Click me"
          icon={true}
          theme="light"
        />
      </TwoColumnImageBox>
      <div className="container">
        <FeaturesCard options={featuresOptions} />
        <Card
          source="https://images.pexels.com/photos/36717/amazing-animal-beautiful-beautifull.jpg"
          classname="card-theme"
        >
          <Heading>NAUTICAL GEAR DISCOUNTS</Heading>
          <p>Lorem ipsum dolor sit amet consectetur. Nunc lectus turpis tempor vitae gravida. Rhoncus nisi nulla morbi.</p>
          <Button onClick={() => console.log('Hello')} text='Click me' icon={true} theme='light' />
        </Card>
      </div>
    </div>
  );
}

export default Test;
