import { useFormContext, useFormState } from "react-hook-form";
import { DobPickerProps } from "../../types";
import "./DobPicker.scss";
import { ChangeEvent, useEffect } from "react";
interface DobErrors {
  dobDay?: { message: string };
  dobMonth?: { message: string };
  dobYear?: { message: string };
}

export const DobPicker: React.FC<
  DobPickerProps & {
    // initialValues?: { dobDay: number; dobMonth: number; dobYear: number };
    initialValues?: string;
    name?: string;
    yearCurrent?: string;
    handleDateChange?: (day: string, month: string, year: string) => void;
  }
> = ({
  registerConfig,
  // initialValues = { dobDay: "", dobMonth: "", dobYear: "" },
  initialValues = "",
  name = "dob",
  yearCurrent = 'no',
  handleDateChange,
}) => {
    const { register, setValue, getValues } = useFormContext();
    const { errors } = useFormState();
    const getError = (field: keyof DobErrors) => {
      const fieldErrors = errors?.[name] as DobErrors | undefined;
      return fieldErrors?.[field]?.message || null;
    };

    const dayOptions = Array.from({ length: 31 }, (_, index) => (
      <option key={index + 1} value={index + 1}>
        {index + 1}
      </option>
    ));
    const monthOptions = Array.from({ length: 12 }, (_, index) => (
      <option key={index + 1} value={index + 1}>
        {index + 1}
      </option>
    ));
    const currentYear = new Date().getFullYear();
    let fromyear: number;
    let endyear: number;
    if (yearCurrent == 'yes') {
      fromyear = currentYear;
      endyear = 2050;
    } else {
      fromyear = 1925;
      endyear = currentYear - 18;
    }

    const years = [];
    for (let year = fromyear; year <= endyear; year++) {
      years.push(year);
    }

    // useEffect(() => {
    //   setValue(`${name}.dobDay`, initialValues.dobDay);
    //   setValue(`${name}.dobMonth`, initialValues.dobMonth);
    //   setValue(`${name}.dobYear`, initialValues.dobYear);
    // }, [initialValues, setValue, name]);

    // Get the value of members_dob
    const dobValues = getValues(name);

    if (dobValues?.dobDay || dobValues?.dobMonth || dobValues?.dobYear) {
      setValue(`${name}.dobDay`, dobValues.dobDay);
      setValue(`${name}.dobMonth`, dobValues.dobMonth);
      setValue(`${name}.dobYear`, dobValues.dobYear);
    } else {
      if (initialValues) {
        const [year, month, day] = initialValues.split("-").map(Number);
        setValue(`${name}.dobDay`, day);
        setValue(`${name}.dobMonth`, month);
        setValue(`${name}.dobYear`, year);
      }
      // setValue(`${name}.dobDay`, initialValues.dobDay);
      // setValue(`${name}.dobMonth`, initialValues.dobMonth);
      // setValue(`${name}.dobYear`, initialValues.dobYear);
    }
    useEffect(() => {
      const selectedDay = getValues(`${name}.dobDay`);
      const selectedMonth = getValues(`${name}.dobMonth`);
      const selectedYear = getValues(`${name}.dobYear`);
      if (selectedDay && selectedMonth && selectedYear && handleDateChange) {
        handleDateChange(selectedDay, selectedMonth, selectedYear);
      }
    }, [`${name}.dobDay`, `${name}.dobMonth`, `${name}.dobYear`, handleDateChange]);


    return (
      <div
        className={`form-group custom-dob-select ${getError("dobDay") || getError("dobMonth") || getError("dobYear")
          ? "has-error"
          : ""
          }`}
      >
        <div className="row">
          <div className={`col ${getError("dobDay") ? "has-select-error" : ""}`}>
            <select
              className="form-control"
              {...register(`${name}.dobDay`, {
                ...registerConfig,
                validate: (value) => value !== false || "Day is required",
              })}
              defaultValue=""
            >
              <option value="">Day</option>
              {dayOptions}
            </select>
            {getError("dobDay") && (
              <span className="error">{`Day ${getError("dobDay")}`}</span>
            )}
          </div>
          <div
            className={`col ${getError("dobMonth") ? "has-select-error" : ""}`}
          >
            <select
              className="form-control"
              {...register(`${name}.dobMonth`, {
                ...registerConfig,
                validate: (value) => value !== false || "Month is required",
              })}
              defaultValue=""
            >
              <option value="">Month</option>
              {monthOptions}
            </select>
            {getError("dobMonth") && (
              <span className="error">{`Month ${getError("dobMonth")}`}</span>
            )}
          </div>
          <div className={`col ${getError("dobYear") ? "has-select-error" : ""}`}>
            <select
              className="form-control"
              {...register(`${name}.dobYear`, {
                ...registerConfig,
                validate: (value) => value !== false || "Year is required",
              })}
              defaultValue=""
            >
              <option value="">Year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            {getError("dobYear") && (
              <span className="error">{`Year ${getError("dobYear")}`}</span>
            )}
          </div>
        </div>
      </div>
    );
  };
