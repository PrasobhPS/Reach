import React, { useState, useEffect } from "react";
import { DialCode } from "../../types";
import { useGetCountryMutation } from "./CountryApiSlice";
import "./CountryPicker.scss";
import { useFormContext, useFormState } from "react-hook-form";
import { CountryPickerProps } from "../../types";

const CountryPicker: React.FC<CountryPickerProps> = ({
  name,
  registerConfig,
  handleChange,
}) => {
  const { register, setError, clearErrors } = useFormContext();
  const { errors } = useFormState();
  const error = errors[name]?.message;
  const [countries, setCountries] = useState<DialCode[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [countryMutation, { isLoading }] = useGetCountryMutation();
  // const [error, setError] = useState<string | null>(null);
  const [isDataFetched, setIsDataFetched] = useState(false);

  useEffect(() => {
    if (!isDataFetched) {
      fetchCountriesFromAPI()
        .then((data) => {
          if (!data || data.length === 0) {
            // setError("Required");
          } else {
            setCountries(data);

            // const defaultCountry = initialValue
            //   ? initialValue
            //   : data.length > 0
            //   ? data[0].code
            //   : "";
            // setSelectedCountry(defaultCountry);
            // onSelect(defaultCountry);
          }
        })
        .catch((error) => {
          console.error("Error fetching dial codes:", error);
        });
    }
  }, []);

  const fetchCountriesFromAPI = async () => {
    const response = await countryMutation({});
    if ("error" in response) {
      throw new Error("Failed to fetch dial codes");
    }
    const data = await response.data.data;
    return data;
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    clearErrors(name);
    const selectedValue = event.target.value;

    const selectedCountry = countries.find(
      (country) => country.country_name === selectedValue
    );

    if (selectedCountry && handleChange) {
      handleChange({
        name: selectedCountry.country_name,
        iso: selectedCountry.country_iso,
      });
    }

    setSelectedCountry(selectedValue);
    // onSelect(selectedValue);
  };

  return (
    <div className="form-group dial-code-picker">
      {countries.length > 0 && (
        <div className="row">
          <div className="col">
            <select
              className="form-control"
              {...register(name, registerConfig)}
              onChange={handleSelectChange}
            >
              <option value="" >Country</option>
              {countries.map((country) => (
                <option key={country.id} value={country.country_name}>
                  {country.country_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
      {error && <span className="error">{`${error}`}</span>}
    </div>
  );
};

export default CountryPicker;
