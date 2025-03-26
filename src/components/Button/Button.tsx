import { ButtonProps } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight } from "@fortawesome/free-solid-svg-icons"
import './Button.scss';

export const Button = (props: ButtonProps) => {
    const { onClick, text, icon, theme, width, className, iconname, children, disabled, img, id, form } = props;
    return <button onClick={onClick} form={form} className={`button-style ${className ? className : ''} ${theme ? 'btn-' + theme : ''} ${width ? 'btn-' + width : ''}`} disabled={disabled}>
        <span>{text ? text : ''}</span>
        {img && <span className="btn-icon"><img src={img} /></span>}
        {icon && <span className="btn-icon"><FontAwesomeIcon icon={iconname ? iconname : faAngleRight} /></span>}
        {children}
    </button>


}

