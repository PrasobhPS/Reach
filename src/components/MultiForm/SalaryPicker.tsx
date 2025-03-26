import React from "react";
import { useFormContext } from "react-hook-form";
import './SalaryPicker.scss';
interface SalaryProps {
    id: string;
    currencyName: string;
    salaryName: string;
    options?: Record<string, string>;
    defaultValue?: string;
    onchange?: (event: React.MouseEvent<HTMLInputElement>) => void;
}

const SalaryPicker: React.FC<SalaryProps> = ({ id, currencyName, salaryName, options = {}, defaultValue, onchange }) => {
    const { register } = useFormContext();
    return (
        <>
            <div className="salary-picker-form row">
                <div className="col-md-3 col-3 salary-pickeroption">
                    <div className="salary-picker currency-type">
                        <select className="form-control" {...register(`${salaryName}.currency`)} defaultValue={defaultValue}>
                            <option value="" disabled>Select Currency</option>
                            {Object.entries(options).map(([key, value]) => (
                                <option key={key} value={key}>{value}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="col-md-9 col-9 salary-pickeroption">
                    <div className="salary-text">
                        <input
                            type="number"
                            id={id}
                            {...register(`${salaryName}.amount`)}
                            min="0"
                            className="form-control"
                            defaultValue=""
                            onMouseDown={onchange ? (e) => onchange(e) : undefined}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default SalaryPicker;
