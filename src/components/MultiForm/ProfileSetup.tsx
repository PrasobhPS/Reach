import React, { useEffect, useState } from "react";
import { Container, Row, Col, Progress } from "reactstrap";
import "./MultiStepForm.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../../components/Button/Button";
import { MultiStepFormProps } from "../../types/MultiStepFormInterface";
import {
  useGetProfileQuestionsQuery,
  useSaveProfileMutation,
} from "../../features/Cruz/Api/CruzMainApiSlice";
import Steps from "./Steps";
import { FormProvider, useForm } from "react-hook-form";
import moment from "moment";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { generateDefaultValues, getUserData } from "../../utils/Utils";
import { useGetProfileDetailsMutation } from "../../features/Cruz/Api/CruzMainApiSlice";
import { setUserData } from "../../utils/Utils";
import { Breadcrumbs } from "../../features/Cruz/components/Breadcrumbs/Breadcrumbs";

interface Step {
  title: string;
  questions: any[];
}
interface Media {
  id: number;
  media_file: string;
}
interface FormValues {
  [key: string]: any;
}
interface UserData {
  Member_fullname: string;
  Member_type: string;
  Token: string;
  members_profile_picture: string;
  Member_id: string;
  IsEmployer: string;
  IsEmployee: string;
  is_specialist: string;
}
interface FetchBaseQueryError {
  status: number;
  data: {
    errors: {
      employee_role: string[];
    };
  };
}

export const ProfileSetup = (props: MultiStepFormProps) => {
  const [initialValue, setInitialValue] = useState({});
  const [datepickerDate, setDatepickerDate] = useState<Date | null>(null);
  const form = useForm<FormValues>({
    defaultValues: initialValue,
  });
  const { data, error, isLoading, isSuccess } = useGetProfileQuestionsQuery({});
  const steps = data?.data?.steps || [];
  const [stepIndex, setStepIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const { register, control, handleSubmit, formState, watch, setValue, reset } =
    form;
  const currentStep = steps[stepIndex];
  const currentTitle = currentStep ? currentStep.title : "";
  const [disError, setDisError] = useState(0);
  const [checkQuestion, setCheckQuestion] = useState(1);
  const [validationName, setValidationName] = useState("");
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [isReview, setIsReview] = useState<boolean>(false);
  const [isProfileDetailsFetched, setIsProfileDetailsFetched] = useState(false);
  // Watch all form values
  const formValues = watch();
  const navigate = useNavigate();
  const { firstIndex = "", secondIndex = "" } = location.state || {};
  let redirect = "/cruz/";
  if (id) {
    redirect = "/cruz/employeedashboard";
  }

  useEffect(() => {
    if (!id) {
      const initvalue = generateDefaultValues(steps);
      setInitialValue(initvalue);
      reset(initialValue);
    }
  }, [isSuccess, steps, reset, id]);

  const userData = getUserData("userData");

  const [
    getProfileDetails,
    { data: jobData, error: jobError, isLoading: jobLoading },
  ] = useGetProfileDetailsMutation();
  const [isLoadings, setIsLoading] = useState(false);

  const fetchJobDetails = async () => {
    setIsLoading(true);
    try {
      const response = await getProfileDetails({ id: id });
      if ("data" in response) {
        const profileDetails = response.data.data;
        // Use reset instead of setting values one by one
        reset({
          ...profileDetails,
          employee_dob: profileDetails.employee_dob
            ? moment(profileDetails.employee_dob).format("YYYY-MM-DD")
            : "",
          employee_avilable_date: profileDetails.employee_avilable_date
            ? moment(profileDetails.employee_avilable_date).format("YYYY-MM-DD")
            : "",
        });
        // console.log("Form reset with", {
        //   ...profileDetails,
        //   employee_dob: profileDetails.employee_dob
        //     ? moment(profileDetails.employee_dob).format("YYYY-MM-DD")
        //     : "",
        //   employee_avilable_date: profileDetails.employee_avilable_date
        //     ? moment(profileDetails.employee_avilable_date).format("YYYY-MM-DD")
        //     : "",
        // });
        if (profileDetails.employee_dob) {
          const editdate = moment(profileDetails.employee_dob);
          const formattedDate = editdate.format(
            "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ "
          );
          const dateObject = new Date(formattedDate);
          const year = moment(dateObject).format("YYYY");
          const month = moment(dateObject).format("MM");
          const day = moment(dateObject).format("DD");
          setValue("dob['dobDay']", day);
          setValue("dob['dobMonth']", month);
          setValue("dob['dobYear']", year);
        }
        if (profileDetails.employee_avilable_date != null) {
          const editdate = moment(profileDetails.employee_avilable_date);
          const formattedDate = editdate.format(
            "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ "
          );
          const dateObject = new Date(formattedDate);
          handleDatePickerSelect(dateObject);
        }
        setIsProfileDetailsFetched(true);
      } else if ("error" in response) {
        // Handle the error case
        console.error("Error response received:", response.error);
      }
    } catch (error) {
      console.error("Failed to fetch specialist list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchJobDetails();
    } else {
      setIsProfileDetailsFetched(true);
    }
    if (firstIndex !== "") {
      setStepIndex(firstIndex);
      setIsReview(true);
    }
    if (secondIndex !== "") {
      setQuestionIndex(secondIndex);
      setIsReview(true);
    }
  }, [id, firstIndex, secondIndex]);

  const handleContinue = () => {
    let allNames = [];
    let currentQuestion = steps[stepIndex].questions[questionIndex];
    let currentName = currentQuestion.name;
    if (currentName) {
      allNames.push(currentName);
    }
    if (currentQuestion.sub_questions) {
      const subQuestionNames = currentQuestion.sub_questions.map(
        (subQuestion: any) => subQuestion.name
      );
      allNames = allNames.concat(subQuestionNames);
    }
    let isValid = allNames.every((name) => {
      if (currentQuestion.type === "checkbox") {
        const checkvalues = formValues[name];
        if (Array.isArray(checkvalues)) {
          return checkvalues.some((someValue) => someValue.value !== "");
        }
        return false;
      }
      if (name === "upload_media") {
        return true;
      }
      if (name === "employee_avilable") {
        const employeeAvailable = formValues["employee_avilable"];
        const employeeAvailableDate = formValues["employee_avilable_date"];
        return (
          (employeeAvailable !== "" && employeeAvailable !== undefined) ||
          (employeeAvailableDate !== "" && employeeAvailableDate !== undefined)
        );
      }
      if (name === "employee_interest") {
        const employeeInterest = formValues["employee_interest"];
        if (Array.isArray(employeeInterest)) {
          return employeeInterest.some((interest) => interest.value !== "");
        }
        return false;
      }
      return (
        formValues[name] !== "" &&
        formValues[name] !== undefined &&
        formValues[name] !== null
      );
    });
    if (
      (stepIndex + 1) / steps.length === 1 &&
      steps[stepIndex].questions.length === questionIndex + 1
    ) {
      SaveReview();
    } else {
      if (isValid) {
        setCheckQuestion((prevCheckQuestion) => prevCheckQuestion + 1);
        setDisError(0);
        setQuestionIndex((prevQuestionIndex) => prevQuestionIndex + 1);
        if (steps[stepIndex].questions.length - 1 === questionIndex) {
          setStepIndex((prevStepIndex) => prevStepIndex + 1);
          setQuestionIndex(0);
        }
      } else {
        setValidationName(currentQuestion.validation);
        setDisError(1);
      }
    }
  };

  const handleGoBack = () => {
    setDisError(0);
    setQuestionIndex((prevQuestionIndex) => prevQuestionIndex - 1);
    if (questionIndex === 0 && stepIndex > 0) {
      setQuestionIndex(steps[stepIndex - 1].questions.length - 1);
      setStepIndex((prevStepIndex) => prevStepIndex - 1);
    }
    if (stepIndex <= 0 && questionIndex === 0) {
      navigate(redirect);
    }
  };

  const handleReset = () => {
    setStepIndex(0);
    setQuestionIndex(0);
  };

  const handleOptionChange = (
    name: string,
    optionKey: any,
    type: string,
    isChecked: boolean | undefined
  ) => {
    if (type === "radio") {
      if (name === "employee_avilable") {
        setIsDateSelected(false);
        setDatepickerDate(null);
        setValue("employee_avilable_date", "");
      }
      setValue(name, optionKey);
    } else if (type === "checkbox") {
      const currentValue = Array.isArray(formValues[name])
        ? formValues[name]
        : [];
      let updatedValue;
      if (isChecked) {
        updatedValue = [...currentValue, String(optionKey)];
      } else {
        updatedValue = currentValue.filter(
          (value: any) => String(value) !== String(optionKey)
        );
      }
      setValue(name, updatedValue);
    }
  };

  const [startDate, setSelectedDate] = useState<Date | null>(null);
  const handleDateSelect = (date: Date | null) => {
    setSelectedDate(date);
    setValue("employee_dob", moment(date).format("YYYY-MM-DD"));

    const year = moment(date).format("YYYY");
    const month = moment(date).format("MM");
    const day = moment(date).format("DD");
    setValue("dob['dobDay']", day);
    setValue("dob['dobMonth']", month);
    setValue("dob['dobYear']", year);
  };
  const [isDateSelected, setIsDateSelected] = useState(false);
  const handleDatePickerSelect = (date: Date | null) => {
    setDatepickerDate(date);
    setValue("employee_avilable", "");
    delete formValues.employee_avilable;
    setValue("employee_avilable_date", moment(date).format("YYYY-MM-DD"));
    setIsDateSelected(!!date);
  };
  const getFileName = (name: string | null) => {
    if (name) {
      const currentImages = formValues.upload_media || [];
      const updatedImages = [...currentImages, name];
      setValue("upload_media", updatedImages);
    }
  };

  function isFetchBaseQueryError(error: any): error is FetchBaseQueryError {
    return (
      error &&
      typeof error.status === "number" &&
      error.data &&
      error.data.errors
    );
  }

  const [saveProfile] = useSaveProfileMutation();

  const SaveReview = async () => {
    try {
      if (Object.keys(formValues).length != 0) {
        delete formValues.dob;
        delete formValues.employee_video;
        delete formValues.interests;
        if (formValues["employee_avilable_date"]) {
          delete formValues.employee_avilable;
        }
        const response = await saveProfile(formValues);
        if ("data" in response) {
          if (userData != null) {
            userData.IsEmployee = "Y";
            userData.employeeId = response.data.data.employeeId;
            setUserData(userData);
          }
          navigate("/cruz/employeejobpoststatus");
        } else {
          console.error("Error saving job:", response.error);
        }
      } else {
        let firstQuestion = steps[stepIndex].questions[questionIndex];
        setValidationName(firstQuestion.validation);
        setDisError(1);
      }
    } catch (error) {
      // Handle error response here
      console.error("Error saving job:", error);
    }
  };

  const BtnSave = async () => {
    try {
      if (Object.keys(formValues).length != 0) {
        delete formValues.dob;
        delete formValues.employee_video;
        if (formValues["employee_avilable_date"]) {
          delete formValues.employee_avilable;
        }
        const response = await saveProfile(formValues);
        if ("data" in response) {
          if (userData != null) {
            userData.IsEmployee = "Y";
            userData.employeeId = response.data.data.employeeId;
            setUserData(userData);
          }
          if (isReview || id) {
            navigate("/cruz/reviewemployeeprofile");
          } else {
            navigate("/cruz/employeedashboard");
          }
        } else if (
          "error" in response &&
          isFetchBaseQueryError(response.error)
        ) {
          const errorMessage = response.error.data.errors.employee_role[0];
          setValidationName(errorMessage);
          setDisError(1);
        } else {
          console.error("Unexpected response format", response);
        }
      } else {
        let firstQuestion = steps[stepIndex].questions[questionIndex];
        setValidationName(firstQuestion.validation);
        setDisError(1);
      }
    } catch (error) {
      // Handle error response here
      console.error("Error saving job:", error);
    }
  };

  const handleFormSubmit = (data: FormValues) => {
    // Handle form submission logic here
  };
  if (!isProfileDetailsFetched) {
    // Render a loading spinner or some placeholder while fetching job details
    return (
      <div className="page-loader">
        <div className="page-innerLoader">
          <div className="spinner-border" role="status">
            <img
              src={require("../../assets/images/cruz/Frame.png")}
              alt=""
              className="img-fluid"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="row multiform-parent-section">
      <div className="multistepForm">
        <Container className="text-center multistepForm-parent">
          <Row>
            <FormProvider {...form}>
              <form
                className="MultiQuestionForm"
                onSubmit={handleSubmit(handleFormSubmit)}
                noValidate
              >
                {data && steps && currentStep && (
                  <Col className="col-lg-7 col-12 steps-option-section">
                    <div className="step-count">
                      <p>
                        <span className="Caption">{currentTitle}</span>
                      </p>
                    </div>
                    <Progress value={((stepIndex + 1) / steps.length) * 100} />
                    <div className="Stepper">
                      <Steps
                        title={steps[stepIndex].questions[questionIndex].title}
                        subtitle={
                          steps[stepIndex].questions[questionIndex].sub_title
                        }
                        placeholder={
                          steps[stepIndex].questions[questionIndex].placeholder
                        }
                        type={steps[stepIndex].questions[questionIndex].type}
                        name={steps[stepIndex].questions[questionIndex].name}
                        multiple={
                          steps[stepIndex].questions[questionIndex].multiple
                        }
                        theme={steps[stepIndex].questions[questionIndex].theme}
                        Qoptions={
                          steps[stepIndex].questions[questionIndex].options
                        }
                        onOptionChange={handleOptionChange}
                        getFileName={getFileName}
                        sub_questions={
                          steps[stepIndex].questions[questionIndex]
                            .sub_questions
                        }
                        formValues={formValues}
                        setValue={setValue}
                        control={control}
                        startDate={startDate}
                        handleDateSelect={handleDateSelect}
                        search={
                          steps[stepIndex].questions[questionIndex].search
                        }
                        datepicker={
                          steps[stepIndex].questions[questionIndex].datepicker
                        }
                        handleDatePickerSelect={handleDatePickerSelect}
                        datepickerDate={datepickerDate}
                        isDateSelected={isDateSelected}
                      />
                    </div>
                  </Col>
                )}

                <Col className="action-groups col-lg-5 col-12">
                  <div
                    className={`action-steps ${disError === 1 ? "error-active" : ""
                      }`}
                  >
                    {disError === 1 && (
                      <div className="error-alert">
                        <span>
                          <FontAwesomeIcon icon={faInfoCircle} />
                          <span className="mx-2">{validationName}</span>
                        </span>
                      </div>
                    )}
                    <div className="continue-action">
                      <Button
                        text={"Continue"}
                        icon={true}
                        theme="light"
                        className="btn-continue"
                        onClick={handleContinue}
                      />
                    </div>
                    <div className="prev-action">
                      <Button
                        text="Go back"
                        icon={false}
                        className="btn-prev"
                        onClick={handleGoBack}
                      />
                      <Button
                        text="Save and exit"
                        icon={false}
                        className="btn-save"
                        onClick={BtnSave}
                      />
                    </div>
                    {stepIndex === steps.length - 1 &&
                      questionIndex ===
                      steps[stepIndex].questions.length - 1 && (
                        <Button className="d-none" onClick={handleReset}>
                          Reset
                        </Button>
                      )}
                  </div>
                </Col>
              </form>
            </FormProvider>
          </Row>
        </Container>
      </div>
    </div>
  );
};
