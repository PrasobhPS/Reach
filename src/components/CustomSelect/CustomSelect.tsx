import React, { useEffect, useState } from 'react';
import { CustomSelectProps } from '../../types';
import './CustomSelect.scss';
import { useFormContext, useFormState } from 'react-hook-form';

const CustomSelect: React.FC<CustomSelectProps> = ({ name, options, registerConfig, placeholder, handleChange }) => {
  const { register } = useFormContext();
  const { errors } = useFormState();
  const error = errors[name]?.message;
  const [selectName, setSelectName] = useState<string>('Select');
  useEffect(() => {
    if (placeholder) {
      setSelectName(placeholder);
    }
  }, [placeholder])

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    if (handleChange)
      handleChange(selectedValue);

  };

  return (
    <div className={`form-group custom-select ${error ? 'has-error' : ''}`}>
      <select className='form-control' {...register(name, registerConfig)} defaultValue="" onChange={handleSelectChange}>
        <option value="" disabled>{selectName}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      {error && <span className='error'>{`${error}`}</span>}
    </div>
  );
};

export default CustomSelect;
