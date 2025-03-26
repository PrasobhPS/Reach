import React, { InputHTMLAttributes, useEffect, useState } from 'react';
import { CustomInputProps } from "../../types";
import "./CustomInput.scss";
import { useFormContext, useFormState, useWatch } from "react-hook-form";

const CustomInput: React.FC<CustomInputProps> = ({
  name,
  className,
  placeholder,
  type = "text",
  min = "0",
  rows,
  defaultValue,
  registerConfig,
  disable,
  onClick,
  onFocus,
  onBlur,
}) => {
  const { register, getValues } = useFormContext();
  const { errors } = useFormState();
  // console.log(useFormState());
  const error = errors[name]?.message;
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(defaultValue || '');
  useEffect(() => {
    if (getValues(name) !== '') {
      setInputValue('has-value');
    } else {
      setInputValue('');
    }
  }, [getValues(name)]);
  return (
    <div
      className={`form-group custom-input ${className ? className : ""} ${error ? "has-error" : ""
        } ${onBlur && name !== 'members_email' ? "mb-0" : ""}`}
    >
      {rows ? (
        <div className={`input-box-container ${isFocused ? 'input-focused' : ''} ${getValues(name) ? 'has-value' : ''}`}>
          <textarea
            id={name}
            className="form-control"
            {...register(name, registerConfig)}
            rows={rows}
            value={getValues(name) || ''}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <label>{placeholder}</label>
        </div>
      ) : (
        defaultValue !== '' ? (
          <div
            className={`input-box-container ${isFocused ? 'input-focused' : ''} ${inputValue !== '' ? 'has-value' : ''}`}
          >
            <input
              type={type}
              id={name}
              disabled={disable}
              value={defaultValue}
              min={min}
              autoComplete="new-password"
              className="form-control"
              {...register(name, registerConfig)}
              onClick={onClick}
              onFocus={(e) => {
                setIsFocused(true);
                if (onFocus) onFocus(e);
              }}
              onBlur={(e) => {
                setIsFocused(false);
                if (onBlur) onBlur(e);
              }}
            />
            <label>{placeholder}</label>
          </div>
        ) : (
          <div
            className={`input-box-container ${isFocused ? 'input-focused' : ''} ${inputValue !== '' ? 'has-value' : ''}`}
          >
            <input

              type={type}
              id={name}
              disabled={disable}
              min={min}
              autoComplete="new-password"
              className="form-control"
              {...register(name, registerConfig)}
              onClick={onClick}
              onFocus={(e) => {
                setIsFocused(true);
                if (onFocus) onFocus(e);
              }}
              onBlur={(e) => {
                setIsFocused(false);
                if (onBlur) onBlur(e);
              }}

            />
            {type !== 'hidden' ? (
              <label>{placeholder}</label>
            ) : ""}

          </div>
        )

      )}
      {error && <span className="error">{`${error}`}</span>}
    </div>
  );
};

export default CustomInput;
