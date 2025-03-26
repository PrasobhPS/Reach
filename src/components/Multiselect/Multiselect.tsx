import React, { useEffect, useRef, useState } from "react";
import Select from 'react-select';
import './multiselect.scss';
import { useController, useFormContext, useFormState } from 'react-hook-form';
import { useGlobalModalContext } from "../../utils/GlobalModal";
import { Modal, ModalHeader, ModalBody, NavLink } from "reactstrap";
import { Button } from "../Button/Button";
import Option from "../MultiForm/Option";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
export interface Option {
    label: string;
    value: string;
}
interface FormValues {
    [key: string]: any;
}
interface MultiSelectProps {
    name: string;
    title: string;
    options: Option[];
    rules?: object;
    formValues: FormValues;
    onOptionChange: (name: string, optionKey: number | string, type: string, isChecked: boolean | undefined) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ name, title, options, rules = {}, formValues, onOptionChange }) => {
    const { control, setValue } = useFormContext();
    const { field } = useController({ name, control, rules });
    const { register } = useFormContext();
    const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
    // Update react-hook-form value when the selected options change
    useEffect(() => {
        if (!field.value) {
            setValue(name, {});

        }
    }, [field.value, setValue, name]);
    
    const isMobile = () => window.innerWidth < 768;
    const [modalOpen, setModalOpen] = useState(false);
    const toggleModal = () => {
        if (isMobile()) {
            setModalOpen(!modalOpen);
        }
    }
    const handleClose = () => {
        setModalOpen(false);
    }
    return (
        <div className="position-relative">
         
             <a className="MultiselectModalMobile" onClick={toggleModal}>
                <div  onClick={toggleModal} className="arrow-right">
                     <FontAwesomeIcon icon={faAngleRight} />
                </div>
                <Select
                    {...field}
                    placeholder="Select"
                    options={options}
                    isMulti
                    onChange={(selectedOptions: any) => {
                        const value = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
                        setValue(name, value);
                    }}

                    value={
                        Array.isArray(field.value)
                            ? field.value.map((key: any) => {
                                const option = options.find((option: any) => option.value === String(key));
                                return option ? { label: option.label, value: option.value } : null;
                            }).filter(Boolean)
                            : []
                    }
                />
            </a>
          <Modal
                isOpen={modalOpen}
                className="sidebar-modal MultiselectMobilemodal"
                fade={false}
            >
                <ModalBody>
                    <h3 className="customHeading text-center pb-4">{title}</h3>
                    <div className="modal-checkbox">
                        {options.map(option => (
                            <div className="option-item" key={option.value}>
                                <Option
                                    type={"checkbox"}
                                    optionKey={option.value}
                                    name={name}
                                    value={option.label}
                                    selectedOption={formValues[name]}
                                    onOptionChange={onOptionChange}
                                    register={register}
                                />
                            </div>
                        ))}
                    </div>
                    <Button
                        onClick={() => handleClose()}
                        text="Done"
                        icon={true}
                        theme="dark"
                        className="btn-done"
                    />
                </ModalBody>
            </Modal>
        </div>
       
          
        
    );
};

export default MultiSelect;