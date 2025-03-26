import { useFormContext, useFormState } from "react-hook-form";
import { TelephoneFieldProps } from "../../types";
import "./TelephoneField.scss";
import { useEffect, useState } from "react";
import { useGetCountryMutation } from "../CountryPicker/CountryApiSlice";
import { DialCode } from "../../types";

export const TelephoneField: React.FC<TelephoneFieldProps> = ({
  name,
  registerConfig,
  initialValue,
  defaultValue,
  onFocus,
  onBlur,
}) => {
  const { register, setValue, getValues } = useFormContext();
  const { errors } = useFormState();
  const error = errors[name]?.message;
  const [dialCodes, setDialCodes] = useState<DialCode[]>([]);
  const [dialcodeMutation, { isLoading }] = useGetCountryMutation();
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(defaultValue || '');
  useEffect(() => {
    if (getValues(name) !== '') {
      setInputValue('has-value');
    } else {
      setInputValue('');
    }
  }, [getValues(name)])
  // Function to fetch dial codes from the API

  const fetchDialCodesFromAPI = async () => {
    try {
      const response = await dialcodeMutation({});
      if ("error" in response) {
        throw new Error("Failed to fetch dial codes");
      }
      const data = await response.data.data;
      setDialCodes(data); // Update state with fetched data
    } catch (error) {
      console.error("Failed to fetch dial codes:", error);
    }
  };
  // if (initialValue) setValue("phone_code", initialValue);
  // console.log(initialValue, "initialValue");

  // Fetch dial codes when the component mounts
  useEffect(() => {
    fetchDialCodesFromAPI();
  }, []);
  useEffect(() => {
    if (dialCodes?.length > 0) {
      // console.log(initialValue, "initialValue");
      setValue("phone_code", initialValue);
    }
  }, [initialValue, setValue, dialCodes]);

  const validatePhoneNumber = (value: string) => {
    if (!value) {
      return true; // No validation needed if the field is empty
    }

    const phoneNumber = value.replace(/\D/g, ""); // Remove non-digit characters
    if (phoneNumber.length < 5) {
      return "Phone number must be at least 5 digits";
    }
    if (phoneNumber.length > 15) {
      return "Phone number cannot exceed 15 digits";
    }
    return true; // Validation passed
  };

  return (
    <div
      className={`form-group input-block custom-input custom-phone-input ${error ? "has-error" : ""
        }`}
    >
      <div className="row">
        <div className="col dialcode">
          <select
            className="form-control"
            {...register("phone_code", {
              required: "Dialcode is required",
            })}
          >
            <option value="">+44</option>
            {dialCodes.map((code, index) => (
              <option key={index} value={code.id}>
                {code.country_phonecode} ({code.country_name})
              </option>
            ))}
          </select>
          {errors["phone_code"] && (
            <span className="error">Dialcode is required</span>
          )}
        </div>
        <div className="col">
          <div
            className={`input-box-container ${isFocused ? 'input-focused' : ''} ${inputValue !== '' ? 'has-value' : ''}`}
          >
            <input
              type="number"
              className="form-control"
              {...register(name, {
                ...registerConfig,
                validate: validatePhoneNumber,
              })}

              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            <label>Phone</label>
            {error && <span className="error">{`${error}`}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};
