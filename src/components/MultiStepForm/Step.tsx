import React, { useState, ChangeEvent } from 'react';
import { Container, Row, Col } from 'reactstrap';
import Option from './Option';
import CustomInput from "../CustomInput/CustomInput";
import { DobPicker } from "../DobPicker/DobPicker";
import CustomSelect from "../CustomSelect/CustomSelect";
import { FileUpload } from "../FileUpload/FileUpload";
interface StepProps {
  title: string;
  name: string | undefined;
  Qsoptions: string[];
  // formfields?: { type: string; placeholder: string }[];
  formfields?: { type: string; name: string; placeholder: string; options?: { value: string; label: string }[] }[];
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  selectedDatas: {
    name: string;
    value: string;
  }[];
  stepIndex: number
}

const Step: React.FC<StepProps> = ({ title, name, selectedDatas, stepIndex, Qsoptions, formfields, onChange, ...rest }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  let currentData = selectedDatas[stepIndex];
  const [originalDate] = useState("0000-00-00");
  const [year, month, day] = originalDate.split("-").map((value) => {
    const parsedValue = parseInt(value, 10);
    return parsedValue < 10 ? parsedValue.toString() : parsedValue;
  }) as [number, number, number];
  const [fileName, setFileName] = useState<string | null>(null);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event);
    if (currentData) {
      currentData.value = event.target.value;
    }
    setActiveIndex(Qsoptions.findIndex(optionss => optionss === event.target.value));
  };
  const getFileName = (name: string | null) => {
    setFileName(name);
  };
  const options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  return (
    <Container {...rest}>
      <Row>
        <Col className="StepQuestion">
          <h2 className="customHeading">{title}</h2>
        </Col>
      </Row>
      <Row>
        {Qsoptions.map((option, index) => (
          <div className="col-md-6 col-6 Question" key={index} onClick={() => { setActiveIndex(index) }}>
            <Option
              active={index === activeIndex}
              onChange={handleChange}
              value={option}
              checked={currentData && currentData.value == option}
              name={name ?? undefined}
            >
              {option}
            </Option>
          </div>
        ))}
      </Row>
      {formfields && (
        <Row>
          {formfields.map((field, index) => (
            <div key={index}>
              {field.type === 'textarea' ? (
                <Col key={index}>
                  <CustomInput
                    type="text"
                    rows={4}
                    name="Describe"
                    placeholder={field.placeholder}
                    registerConfig={{
                      required: { value: true, message: 'Description is required' },
                    }}
                    className='footer-subscription'
                  />
                </Col>
              )
                : field.type === 'text' ? (
                  Qsoptions.length <= 0 && (
                    <Col key={index}>
                      <CustomInput
                        type="text"
                        name="Describe"
                        placeholder={field.placeholder}
                        registerConfig={{
                          required: { value: true, message: 'Description is required' },
                        }}
                        className='footer-subscription'
                      />
                    </Col>
                  )
                )
                  : field.type === 'select' ? (
                    Qsoptions.length <= 0 && (
                      <div className='Qsoptions-select'>
                        <Col key={index}>
                          <CustomSelect
                            name="myoption"
                            options={options}
                            registerConfig={{
                              required: { value: false, message: "Select is required" }
                            }}
                          />
                        </Col>
                      </div>
                      //   <Col key={index}>
                      //   {field.type === 'select' && field.options && (
                      //     <CustomSelect
                      //       name={field.name ?? ""}
                      //       options={field.options}
                      //       registerConfig={{
                      //         required: { value: false, message: "Select is required" }
                      //       }}
                      //     />
                      //   )}
                      // </Col>
                    )
                  ) : field.type === 'image' ? (
                    Qsoptions.length <= 0 && (
                      <Col key={index} className='multistepform-upload'>
                        <div className="Current-Profile">
                          <div className="profile-image">
                            <img src={field.placeholder} alt="" />
                          </div>
                          <div className='Current-Profiletxt'>
                            <span>Use Current Profile image</span>
                          </div>
                        </div>
                        <div className='text-content'>
                          <p>or</p>
                        </div>
                        <FileUpload getFileName={getFileName} folderName="employers" />
                      </Col>
                    )
                  ) :
                    (
                      <Col key={index}>
                        <DobPicker
                          registerConfig={{
                            required: { value: true, message: "DOB is required" },
                          }}
                        // initialValues={{
                        //   dobDay: day,
                        //   dobMonth: month,
                        //   dobYear: year,
                        // }}
                        />
                      </Col>
                    )}
            </div>
          ))}
        </Row>
      )}


    </Container>
  );
};

export default Step;
