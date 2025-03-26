import React, { useState } from 'react';
import { Container, Row, Col, Progress } from 'reactstrap';
import Step from "./Step";
import "./MultiStepForm.scss";
import { Button } from "../../components/Button/Button";
import { MultiStepFormProps } from "../../types/MultiStepFormInterface";
import { FormProvider, useForm } from "react-hook-form";
import { getUserData } from '../../utils/Utils';
interface FormData {
  [key: string]: string;
}
interface formValues {
  Question: string;
  answers: string;
  Describe: string;
  name: string;
  myoption: string;
}

export const MultiStepForm = (props: MultiStepFormProps) => {

  const userData = getUserData("userData");
  let memberdp = "";
  try {
    if (userData !== null) {
      memberdp = userData.members_profile_picture;
    } else {
      console.error("User data not found in local storage");
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
  }

  const steps = [
    {
      title: ' JOB DETAILS',
      questions: [
        {
          title: 'What’s the main job role?',
          name: 'jobRoles',
          options: ['Chief Engineer / month', 'Deck Hand', '2nd Engineer', 'Captain', 'Head Chef', 'First Officer', 'Sous Chef', 'Second Officer', 'Boson', 'Chief Steward / Stewardess', 'Purser', 'Steward / Stewardess']

        },
        {
          title: 'TYPE OF BOAT',
          name: 'boatType',
          options: ['Private', 'Charter', 'Other']
        },
        {
          title: 'duration',
          name: 'jobDuration',
          options: ['Permanent', 'Seasonal', 'Temporary']
        },
        {
          title: 'start date',
          formfields: [
            { label: '', type: '', name: '', placeholder: '', required: false }
          ]
        },
      ]
    },
    {
      title: 'Summary',
      questions: [
        {
          title: 'Summary of the role',
          formfields: [
            { label: '', type: 'textarea', name: 'Describe', placeholder: "Type details of the job here, dates, responsibilities, salary, location, experience required etc.", required: false }
          ]
        },
        {
          title: 'image',
          formfields: [
            { label: '', type: 'image', name: 'Describe', placeholder: memberdp, required: false }
          ]
        },
        {
          title: 'Search parameters',
          formfields: [
            { label: '', type: 'select', name: 'myoption1', placeholder: "", required: false, },
            { label: '', type: 'select', name: 'myoption2', placeholder: "", required: false },
            { label: '', type: 'select', name: 'myoption3', placeholder: "", required: false },
            { label: '', type: 'select', name: 'myoption4', placeholder: "", required: false },
          ]
        },
      ]
    },
    {
      title: 'The Boat',
      questions: [
        {
          title: 'Vessel',
          formfields: [
            { label: '', type: 'textarea', name: 'Describe', placeholder: "Describe the boat here.", required: false }
          ]
        },
        {
          title: 'Location',
          name: 'boatLocation',
          options: ['Mediterranean', 'North America', 'Caribbean', 'Northern Europe', 'Africa', 'Australia', 'Asia', 'South America']
        },
        {
          title: 'Motor or sail',
          name: 'boat',
          options: ['Motor', 'sail']
        },
        {
          title: 'vessel Size',
          name: 'vessel',
          options: ['M'],
        }
      ]
    }
  ];


  const form = useForm<formValues>();
  const [stepIndex, setStepIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [formErrors, setFormErrors] = useState({});
  const [selectedOption, setSelectedOption] = useState<string>('');
  const { register, control, handleSubmit, formState, watch } = form;
  const { errors } = formState;
  const [errorMessage, setErrorMsg] = useState("");
  const [formDataByStep, setFormDataByStep] = useState<Array<FormData>>(Array(steps.length).fill({}));
  const [datas, setDatas] = useState<{ name: string; value: string; }[]>([]);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    form.setValue(name as "Question" | "name", value);
    const updatedFormData = { ...formDataByStep };
    updatedFormData[stepIndex] = { ...updatedFormData[stepIndex], [name]: value };
    setFormDataByStep(updatedFormData);
    setFormErrors({ ...formErrors, [name]: '' });
    setSelectedOption(value);
    setDatas(prevState => [...prevState, { name: name, value: value }]);
  };
  const toggleStep = () => {
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      if (questionIndex < steps[stepIndex].questions.length - 1) {
        setQuestionIndex(questionIndex + 1);
      } else if (stepIndex < steps.length - 1) {
        setStepIndex(stepIndex + 1);
        setQuestionIndex(0);
      }
    } else {
      setFormErrors(errors);
    }
  };
  const goBack = () => {
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
    } else {
      if (stepIndex > 0) {
        setStepIndex(stepIndex - 1);
        setFormDataByStep({ ...formDataByStep, [stepIndex]: formData });
        setQuestionIndex(steps[stepIndex - 1].questions.length - 1);
      }
    }
  };
  const BtnSave = async () => {
    let answeredQuestionsCount = 0;
    const answeredQuestionsDetails: { [key: string]: string }[] = [];
    Object.keys(formDataByStep[stepIndex]).forEach(key => {
      const question = steps[stepIndex].questions.find(question => {
        if (question.options) {
          return question.options.includes(formDataByStep[stepIndex][key]);
        } else if (question.formfields) {
          return question.formfields.some(field => field.name === key);
        }
        return false;
      });
      if (question) {
        answeredQuestionsCount++;
        answeredQuestionsDetails.push({ [question.title]: formDataByStep[stepIndex][key] });
      }
    });
  };

  const resetStep = () => {
    setStepIndex(0);
    setQuestionIndex(0);
    setFormData({});
    setFormErrors({});
    setSelectedOption('');
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    const currentQuestion = steps[stepIndex].questions[questionIndex];
    if (currentQuestion.formfields) {
      currentQuestion.formfields.forEach((field) => {
        if (field.required && !formData[field.name]) {
          errors[field.name] = `${field.label} is required`;
        }
      });
    }
    return errors;
  };

  return (
    <div className="multistepForm">
      <Container className="text-center multistepForm-parent">
        <Row>
          <FormProvider {...form}>
            <form
              className="MultiQuestionForm"
              onSubmit={handleSubmit(BtnSave)}
              noValidate
            >
              <Col className="col-lg-7 col-12">
                <div className="step-count">
                  <p>
                    Step {stepIndex + 1}  <span className="Caption"> - {steps[stepIndex].title}</span>
                  </p>
                </div>
                <Progress value={((questionIndex + 1) / steps[stepIndex].questions.length) * 100} />
                <div className="Stepper">
                  <Step
                    title={steps[stepIndex].questions[questionIndex].title}
                    name={steps[stepIndex].questions[questionIndex].name ?? undefined}
                    Qsoptions={steps[stepIndex].questions[questionIndex].options || []}
                    formfields={steps[stepIndex].questions[questionIndex].formfields}
                    onChange={(event: any) => handleInputChange(event)}
                    selectedDatas={datas}
                    stepIndex={questionIndex}
                  />
                </div>
              </Col>
              <Col className="action-groups col-lg-5 col-12">
                <div className="action-steps">
                  <div className="continue-action">
                    <Button
                      text={stepIndex === steps.length - 1 ? 'Continue' : 'Continue'}
                      icon={true}
                      theme="light"
                      className="btn-continue"
                      onClick={toggleStep}
                      disabled={!formData || (stepIndex === steps.length - 1 && questionIndex === steps[stepIndex].questions.length - 1)}
                    />
                  </div>
                  <div className="prev-action">
                    <Button
                      text="Go back"
                      icon={false}
                      className="btn-prev"
                      onClick={goBack}
                      disabled={stepIndex === 0 && questionIndex === 0}
                    />
                    <Button
                      onClick={BtnSave}
                      text="Save and exit"
                      icon={false}
                      className="btn-save"
                    />
                  </div>
                  {stepIndex === steps.length - 1 && questionIndex === steps[stepIndex].questions.length - 1 && (
                    <Button onClick={resetStep} className='d-none'>Reset</Button>
                  )}
                </div>
              </Col>
            </form>
          </FormProvider>
        </Row>
      </Container>
    </div>
  );
};
