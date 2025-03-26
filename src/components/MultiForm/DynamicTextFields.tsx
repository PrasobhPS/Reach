import React, { useEffect } from 'react';
import { useFieldArray, Controller, Control, FieldValues, RegisterOptions, useFormContext } from 'react-hook-form';
import CustomInput from '../CustomInput/CustomInput';

interface PatternConfig {
    value: RegExp;
    message: string;
}

export interface RequiredConfig {
    value: boolean;
    message: string;
}

interface DynamicInputProps {
    name: string;
    control: Control<FieldValues>;
    placeholder?: string;
    registerConfig: RegisterOptions & {
        required?: RequiredConfig | boolean;
        pattern?: PatternConfig;
    };
}

const DynamicTextFields: React.FC<DynamicInputProps> = ({ name, placeholder, control, registerConfig }) => {
    const { fields, append, remove } = useFieldArray({
        name,
        control,
    });
    const { register } = useFormContext();

    useEffect(() => {
        if (fields.length === 0) {
            append({ value: '' });
        }
    }, [fields, append]);

    return (
        <div className="inputHolder-parent">
            {fields.map((field, index) => (
                <div className="inputHolder" key={field.id}>
                    <div className="inputWrapper">
                        <Controller
                            name={`${name}[${index}].value`}
                            control={control}
                            render={({ field }) => (
                                <input
                                    type="text"
                                    {...field}
                                    placeholder={placeholder}
                                    {...register(`${name}[${index}].value`, registerConfig)}
                                    className="footer-subscription vessel-size-input"
                                />
                            )}
                        />
                    </div>
                    {index > 0 && (
                        <button className="closeBtn" onClick={() => remove(index)}>
                            <img src={require("../../assets/images/cruz/close.png")} className="removeIcon" alt="remove" />
                        </button>
                    )}
                </div>
            ))}
            <div className="addBtnHolder">
                <button type="button" onClick={() => append({ value: '' })}>
                    + Add another
                </button>
            </div>
        </div>
    );
};

export default DynamicTextFields;
