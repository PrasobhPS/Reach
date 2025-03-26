import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./customDatePicker.scss";
interface ReactDatePickerProps {
    selected: Date | null | undefined;
    onChange: (date: Date | null) => void;
    maxDate?: Date | null;
    minDate?: Date | null;
    inline?: boolean;
    placeholder?: string;
}

export const ReactDatePicker: React.FC<ReactDatePickerProps> = ({ selected, onChange, maxDate, minDate, inline, placeholder }) => {
    return (
        <div>
            {inline ? (
                <DatePicker
                    selected={selected}
                    onChange={onChange}
                    maxDate={maxDate}
                    minDate={minDate}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    inline
                    dateFormat="dd/MM/YYYY"
                />
            ) : (
                <DatePicker
                    selected={selected}
                    onChange={onChange}
                    maxDate={maxDate}
                    minDate={minDate}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    placeholderText={placeholder}
                    dateFormat="dd/MM/YYYY"

                />
            )}
        </div>
    );
}

export default ReactDatePicker;
