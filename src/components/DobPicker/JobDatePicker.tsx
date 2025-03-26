import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import "../../components/DobPicker/JobDatePicker.scss";
import CustomInput from "../CustomInput/CustomInput";
import ReactDatePicker from "../ReactDatePicker/ReactDatePicker";

interface FormValues {
    [key: string]: any;
}

export const JobDatePicker: React.FC<{
    initialValues?: string;
    name?: string;
    yearCurrent?: string;
    formValues: FormValues;
    disable: boolean;
    maxDate?: Date | null;
    minDate?: Date | null;
    inline?: boolean;
    startDate: Date | null | undefined;
    handleDateSelect: (date: Date | null) => void;
}> = ({
    initialValues = "",
    name = "dob",
    yearCurrent = "no",
    formValues,
    disable = false,
    inline,
    maxDate,
    minDate,
    startDate,
    handleDateSelect,
}) => {
        const { register } = useFormContext();
        const [showDatePicker, setShowDatePicker] = useState(false);
        const [selectedDate, setSelectedDate] = useState<Date | null>(null);


        const handleFieldClick = () => {
            if (!disable) {
                setShowDatePicker(true);
            }
        };

        const handleDateChange = (date: Date | null) => {
            setSelectedDate(date);
            handleDateSelect(date);
            setShowDatePicker(false);
        };

        return (
            <div className="row jobDatePicker">
                <div className="col">
                    <label className="formcontrol-label">Day</label>
                    <CustomInput
                        type="number"
                        name={`${name}.dobDay`}
                        placeholder="Day"
                        registerConfig={{
                            required: { value: false, message: "Day is required" },
                        }}
                        defaultValue={formValues[name]?.dobDay || ""}
                        className="footer-subscription react-datepicker-ignore-onclickoutside"
                        disable={disable}
                        onClick={handleFieldClick}
                    />
                </div>
                <div className="col">
                    <label className="formcontrol-label">Month</label>
                    <CustomInput
                        type="number"
                        name={`${name}.dobMonth`}
                        placeholder="Month"
                        registerConfig={{
                            required: { value: false, message: "Month is required" },
                        }}
                        defaultValue={formValues[name]?.dobMonth || ""}
                        className="footer-subscription"
                        disable={disable}
                        onClick={handleFieldClick}
                    />
                </div>
                <div className="col">
                    <label className="formcontrol-label">Year</label>
                    <CustomInput
                        type="number"
                        name={`${name}.dobYear`}
                        placeholder="Year"
                        registerConfig={{
                            required: { value: false, message: "Year is required" },
                        }}
                        defaultValue={formValues[name]?.dobYear || ""}
                        className="footer-subscription"
                        disable={disable}
                        onClick={handleFieldClick}
                    />
                </div>
                {showDatePicker && (
                    <div className="custom-datePicker">
                        <ReactDatePicker
                            selected={startDate}
                            onChange={handleDateChange}
                            inline={inline}
                            maxDate={maxDate}
                            minDate={minDate}
                        />
                    </div>
                )}
            </div>
        );
    };
