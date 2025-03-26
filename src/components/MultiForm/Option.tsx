import React from "react";
import { Card, CardBody } from "reactstrap";

interface OptionProps {
  type?: string;
  optionKey: number | string;
  value: string;
  name: string | undefined;
  checked?: boolean;
  selectedOption?: number | string;
  onOptionChange: (name: string, optionKey: number | string, type: string, isChecked: boolean | undefined) => void;
  register: any;
  disable?: boolean;
}

const Option: React.FC<OptionProps> = ({ type, optionKey, value, name, checked, selectedOption, onOptionChange, register, disable }) => {
  const handleChange = (name?: string, optionKey?: any, type?: string, isChecked?: boolean | undefined) => {
    if (name && type) {
      onOptionChange(name, optionKey, type, isChecked);
    }
  };
  checked = false;
  if (Array.isArray(selectedOption)) {
    checked = selectedOption.some(option => String(option) == optionKey);
  } else {
    if (String(selectedOption) === optionKey) {
      checked = true;
    }
  }
  let disbleRadio = false;
  if (disable) {
    disbleRadio = true;
  }

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };
  let content;
  if (type === 'radio') {
    content = (
      <label htmlFor={value}>
        <input
          type="radio"
          id={value}
          name={name}
          value={optionKey.toString()}
          checked={checked}
          onChange={(e) => handleChange(name, optionKey, type, e.target.checked)}
          disabled={disbleRadio}
        />
        <CardBody><span>{value}</span></CardBody>
      </label>
    );
  } else if (type === 'checkbox') {
    content = (
      <div className="round-checkbox">
        <label htmlFor={value} onClick={handleClick}>
          <input
            type="checkbox"
            id={value}
            name={name}
            value={optionKey.toString()}
            checked={checked}
            onChange={(e) => handleChange(name, optionKey, type, e.target.checked)}
          />
          <div className="card-body">{value}</div>
        </label>
      </div>
    );
  } else {
    content = null;
  }

  return content;
};

export default Option;
