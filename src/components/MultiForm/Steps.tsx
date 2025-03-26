import React, { useEffect, useRef, useState } from "react";
import { CardBody, Col, Container, Row } from "reactstrap";
import Option from "./Option";
import { JobDatePicker } from "../DobPicker/JobDatePicker";
import { useFormContext } from "react-hook-form";
import CustomInput from "../CustomInput/CustomInput";
import { FileUpload } from "../FileUpload/FileUpload";
import { ReactDatePicker } from "../../components/ReactDatePicker/ReactDatePicker";
import MultiSelect from "../Multiselect/Multiselect";
import "../../components/Multiselect/multiselect.scss";
import SalaryPicker from "./SalaryPicker";
import ShowImages from "./ShowImages";
import { Control } from "react-hook-form";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import MultiUploads from "./MultiUploads";
import DynamicTextFields from "./DynamicTextFields";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MyPicker from "../CustomPickerDate/CustomModalDate";
interface SubQuestion {
  title: string;
  type: string;
  name: string;
  options: Record<string, string>;
  multiple: boolean;
}
interface FormValues {
  [key: string]: any;
}
interface StepsProps {
  title: string;
  subtitle?: string;
  placeholder?: string;
  type: string;
  name: string;
  multiple: boolean;
  theme?: string;
  Qoptions?: Record<number, string>;
  getFileName?: (name: string | null) => void;
  onOptionChange: (
    name: string,
    optionKey: number | string,
    type: string,
    isChecked: boolean | undefined
  ) => void;
  sub_questions?: SubQuestion[];
  formValues: FormValues;
  startDate: Date | null;
  handleDateSelect: (date: Date | null) => void;
  setValue: (name: string, value: any) => void;
  control: Control;
  search?: boolean;
  datepicker?: boolean;
  handleDatePickerSelect?: (date: Date | null) => void;
  datepickerDate?: Date | null;
  isDateSelected?: boolean;
  exclude_jobrole?: Record<number, string>;
  jobRole?: string;
}

const Steps: React.FC<StepsProps> = ({
  title,
  subtitle,
  placeholder,
  type,
  name,
  multiple,
  theme,
  Qoptions,
  getFileName = () => { },
  onOptionChange,
  sub_questions = [],
  formValues,
  startDate,
  handleDateSelect,
  setValue,
  control,
  search,
  datepicker,
  handleDatePickerSelect = () => { },
  datepickerDate,
  isDateSelected,
  exclude_jobrole,
  jobRole,
  ...rest
}) => {
  const [isClassAdded, setIsClassAdded] = useState(false);
  useEffect(() => {
    const checkQuestionCheckboxLength = () => {
      const questionCheckboxes = document.querySelectorAll(".QuestionCheckbox");
      if (questionCheckboxes.length === 2) {
        setIsClassAdded(true);
      } else {
        setIsClassAdded(false);
      }
    };
    checkQuestionCheckboxLength();
  });
  const convertOptions = (
    options: Record<string, string>
  ): { value: string; label: string }[] => {
    return Object.entries(options).map(([key, value]) => ({
      value: key,
      label: value,
    }));
  };

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSearchQuery(event.target.value);
  };

  const { register } = useFormContext();

  let maxDate = null;
  let minDate = null;
  if (name === "employee_dob") {
    maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 18);
  }
  if (name === "job_start_date" || name === "employee_avilable") {
    const today = new Date();
    minDate = new Date(today);
    minDate.setDate(today.getDate() + 1);
  }

  let content;
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setSearchQuery("");
  }, [name]);

  const handleSalaryChange = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    setValue('salary_type', '');
  }

  if (type === "radio" && Qoptions) {
    let colClass =
      Object.keys(Qoptions).length > 6 ? "col-6" : "col-12 fullwidth";

    const excludedValues = exclude_jobrole
      ? Object.values(exclude_jobrole)
      : [];
    const excludedKeys = exclude_jobrole ? Object.keys(exclude_jobrole) : [];
    const filteredOptions = searchQuery
      ? Object.entries(Qoptions).filter(([key, value]) =>
        value.toLowerCase().includes(searchQuery.toLowerCase())
      )
      : Object.entries(Qoptions);

    content = filteredOptions.map(([key, value]) => {
      let disable = false;
      if (
        exclude_jobrole &&
        excludedValues.includes(value) &&
        String(jobRole) !== String(key)
      ) {
        disable = true;
      }
      return (
        <div className={`col-md-6 ${colClass} Question`} key={key}>
          <Option
            type={type}
            optionKey={key}
            name={name}
            value={value}
            selectedOption={formValues[name]}
            onOptionChange={onOptionChange}
            register={register}
            disable={disable}
          />
        </div>
      );
    });
  } else if (type === "date") {
    content = (
      <div className="multistep-datepicker">
        <JobDatePicker
          formValues={formValues}
          disable={false}
          maxDate={maxDate}
          minDate={minDate}
          inline={true}
          startDate={startDate}
          handleDateSelect={handleDateSelect}
        />

        <MyPicker
          formValues={formValues}
          name={name}
          setValue={setValue}
          startDate={startDate}
        />
      </div>
    );
  } else if (type === "textarea") {
    content = (
      <CustomInput
        type="text"
        rows={4}
        name={name}
        placeholder={placeholder}
        registerConfig={{
          required: { value: false, message: "" },
        }}
        className="footer-subscription"
      />
    );
  } else if (type === "text" && multiple != true) {
    content = (
      <CustomInput
        type="text"
        name={name}
        placeholder={placeholder}
        registerConfig={{
          required: { value: false, message: "" },
        }}
        className="footer-subscription vessel-size-input"
      />
    );
  } else if (type === "text" && multiple === true) {
    content = (
      <DynamicTextFields
        name={name}
        placeholder={placeholder}
        control={control}
        registerConfig={{
          required: { value: false, message: "Description is required" },
        }}
      />
    );
  } else if (type === "number") {
    content = (
      <CustomInput
        type="number"
        name={name}
        placeholder={placeholder}
        registerConfig={{
          required: { value: false, message: "" },
        }}
        className="footer-subscription vessel-size-input"
      />
    );
  } else if (type === "select" && Qoptions && !multiple) {
    content = (
      <div className="form-group custom-select">
        <select className="form-control" {...register(name)} defaultValue="">
          <option value="" disabled>
            Select
          </option>
          {Object.entries(Qoptions).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
      </div>
    );
  } else if (type === "dropdown" && Qoptions && multiple) {
    content = (
      <div className="form-group custom-select Reference-section">
        <MultiSelect
          formValues={formValues}
          onOptionChange={onOptionChange}
          name={name}
          title={title}
          options={convertOptions(Qoptions)}
        />
      </div>
    );
  } else if (type === "file" && multiple === false) {
    content = (
      <>
        <FileUpload
          folderName="job-images"
          getFileName={getFileName}
          from={"multiform"}
        />

        <ShowImages
          formValues={formValues}
          folderName={"job-images"}
          setValue={setValue}
          imageKey={name}
        />
      </>
    );
  } else if (type === "file" && multiple === true) {
    content = (
      <>
        <MultiUploads
          getFileName={getFileName}
          setValue={setValue}
          formValues={formValues}
          folderName="employee"
          name={name}
        />
      </>
    );
  } else if (type === "checkbox" && Qoptions) {
    const filteredOptions = searchQuery
      ? Object.entries(Qoptions).filter(([key, value]) =>
        value.toLowerCase().includes(searchQuery.toLowerCase())
      )
      : Object.entries(Qoptions);
    content = filteredOptions.map(([key, value]) => (
      <div
        className={`Question QuestionCheckbox  col-xl-4 col-6 ${theme} ${isClassAdded ? "TwoOptions" : ""
          }  `}
        key={key}
      >
        <Option
          type={type}
          optionKey={parseInt(key)}
          name={name}
          value={value}
          selectedOption={formValues[name]}
          onOptionChange={onOptionChange}
          register={register}
        />
      </div>
    ));
  } else {
    content = null;
  }
  if (sub_questions.length != 0) {
    content = sub_questions.map((sub_question, index) => {

      return (
        <React.Fragment key={index}>
          {sub_question.type === "select" && sub_question.multiple && (
            <div className="multiple-selectOption">
              <div className="subcaptiontext">
                <p>{sub_question.title}</p>
              </div>
              <div
                style={{ flex: "0.5", flexWrap: "wrap" }}
                className={`search-multiselect ${index === 0 ? "firstSelect-child" : ""
                  }`}
              >
                <div className="form-group custom-select">
                  <MultiSelect
                    formValues={formValues}
                    onOptionChange={onOptionChange}
                    name={sub_question.name}
                    title={sub_question.title}
                    options={convertOptions(sub_question.options)}
                  />
                </div>
              </div>
            </div>
          )}
          {sub_question.type === "radio" && sub_question.name === 'job_salary_type' && (
            <>
              <div
                className="row col-md-12 col-12 options-box"
                key={sub_question.name}
              >
                {Object.entries(sub_question.options).map(([key, value]) => (
                  <div className="col-md-4 col-4 salary-pickerOption" key={key}>
                    <Option
                      type={sub_question.type}
                      optionKey={key}
                      name={sub_question.name}
                      value={value}
                      selectedOption={formValues[sub_question.name]}
                      onOptionChange={onOptionChange}
                      register={register}
                    />
                  </div>
                ))}
              </div>
            </>
          )
          }
          {sub_question.type === "radio" && sub_question.name === 'salary_type' && (
            <>
              <div className="Salary_questionsoption">
                {Object.entries(sub_question.options).map(([key, value]) => (

                  <div className={`col-md-5 col-6 Question mx-2`} key={key}>
                    <Option
                      type={sub_question.type}
                      optionKey={key}
                      name={sub_question.name}
                      value={value}
                      selectedOption={formValues[sub_question.name]}
                      onOptionChange={onOptionChange}
                      register={register}
                    />
                  </div>

                ))}
              </div>

              <div className="text-white mb-2">OR</div>
            </>
          )
          }
          {
            sub_question.type === "salary_picker" && (
              <>
                <SalaryPicker
                  id={sub_question.name}
                  currencyName="currency"
                  options={sub_question.options}
                  salaryName={sub_question.name}
                  defaultValue={"£"}
                  onchange={(e) => handleSalaryChange(e)}
                />
              </>
            )
          }
        </React.Fragment >
      );
    });
  }

  return (
    <Container>
      <Row>
        <Col className="StepQuestion">
          <h2 className="customHeading text-initial">{title}</h2>
        </Col>
      </Row>
      <Row>
        <Col className="stepQuestion-subTitle">
          <h4 className="customHeading text-initial">{subtitle}</h4>
        </Col>
      </Row>
      <Row>
        {search && Qoptions && (
          <div className="Steppersearch-box">
            <input
              placeholder="Search"
              type="text"
              name="search"
              className="form-control"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <div className="searchicon">
              <FontAwesomeIcon icon={faSearch} />
            </div>
          </div>
        )}
        {content}

        {datepicker && (
          <div
            className={`custom-datePicker col-md-6 col-12 ${isDateSelected ? "date-selected" : ""
              }`}
          >
            <ReactDatePicker
              selected={datepickerDate}
              onChange={handleDatePickerSelect}
              maxDate={maxDate}
              minDate={minDate}
              inline={false}
              placeholder={placeholder}
            />
          </div>
        )}
      </Row>
    </Container>
  );
};

export default Steps;
