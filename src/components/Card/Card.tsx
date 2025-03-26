import { CardProps } from '../../types';
import './Card.scss'

export const Card = (props: CardProps) => {
    const { source, children, classname, theme } = props;
    return (
        <div className={`custom-card-box membership-cardbox ${classname ? classname : ''} ${theme ? theme : 'primary'}`}>
            {source && <div className='card-image'>
                <img src={source} alt="" className="img-fluid setHeight" />
            </div>}
            {
                children && <div className='content-box membership-heighlight'>
                    {children}
                </div>
            }
        </div>
    )
}