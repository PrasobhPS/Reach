import React from "react";
import { Card, CardBody } from "reactstrap";

interface Props {
  children: string;
  checked?: boolean;
  value: string
  active: boolean;
  name: string | undefined;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const MyCheckbox: React.FC<Props> = ({ active, value, children, checked, onChange, name }) => (
  <label>
    <input
      type="radio"
      className="Question-checkbox"
      checked={checked}
      value={children}
      onChange={onChange}
      name={name ?? undefined}
    />
    <CardBody>{children}</CardBody>
  </label>
);

export default MyCheckbox;
