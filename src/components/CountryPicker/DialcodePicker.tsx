import React, { useState, useEffect } from "react";
import { DialCode } from "../../types";
import { useGetCountryMutation } from "./CountryApiSlice";
import "./CountryPicker.scss";

interface DialCodePickerProps {
  name: string; // Name to access in the main page
  onSelect: (dialCode: string) => void;
  initialValue?: string; // Initial value for the dial code
}

const DialCodePicker: React.FC<DialCodePickerProps> = ({
  name,
  onSelect,
  initialValue,
}) => {
  const [dialCodes, setDialCodes] = useState<DialCode[]>([]);
  const [selectedDialCode, setSelectedDialCode] = useState<string>("");
  const [dialcodeMutation, { isLoading }] = useGetCountryMutation();
  const [error, setError] = useState<string | null>(null);
  const [isDataFetched, setIsDataFetched] = useState(false);

  useEffect(() => {
    // Fetch dial codes from your API endpoint if data hasn't been fetched yet
    if (!isDataFetched) {

      fetchDialCodesFromAPI()
        .then((data) => {
          if (!data || data.length === 0) {
            setError("Required");
          } else {
            setDialCodes(data);
            const defaultDialCode = initialValue
              ? initialValue
              : data.length > 0
                ? data[0].code
                : "";
            setSelectedDialCode(defaultDialCode);
            onSelect(defaultDialCode);
          }
          setIsDataFetched(true); // Set to true after fetching data
        })
        .catch((error) => {
          console.error("Error fetching dial codes:", error);
          setError("Failed to fetch dial codes");
        });
    }
  }, [initialValue, onSelect, isDataFetched]);
  const fetchDialCodesFromAPI = async () => {
    const response = await dialcodeMutation({});
    if ("error" in response) {
      throw new Error("Failed to fetch dial codes");
    }
    const data = await response.data.data;
    return data;
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedDialCode(selectedValue);
    onSelect(selectedValue);
  };

  return (
    <div className="form-group dial-code-picker">
      {dialCodes.length > 0 && (
        <div className="row">
          <div className="col">
            <select
              className="form-control"
              name={name}
              value={selectedDialCode}
              onChange={handleSelectChange}
            >
              <option value="">+44</option>
              {dialCodes.map((dialCode) => (
                <option key={dialCode.id} value={dialCode.id}>
                  {dialCode.country_phonecode} ({dialCode.country_name})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default DialCodePicker;
