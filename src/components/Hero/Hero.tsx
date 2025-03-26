import { HeroProps } from '../../types';
import { Heading } from '../Heading/Heading';
import './Hero.scss';

export const Hero = (props: HeroProps) => {
    const backgroundStyle = {
        backgroundImage: `url(${props.source})`
    };
    return (
        <section className={`hero-section ${props.className ? props.className : ''}`} style={backgroundStyle}>
            <div className='container'>
                <div className="hero-section-heading">
                    <div className='row'>
                        <div className='col-12'>
                            {props.from === 'join' ? (
                                <div className="inner-content">
                                    <div className="inner-child">
                                        <div className="w-100">
                                            {props.title &&
                                                <h2 className="customHeading text-white">{props.title}</h2>
                                            }
                                            {
                                                props.children && (
                                                    <div className="subtext">{props.children}</div>
                                                )
                                            }

                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="heading-width">
                                        {props.title && <Heading className="hero-heading" tag='h1'>
                                            {props.title}
                                        </Heading>}
                                    </div>
                                    {
                                        props.children && (
                                            <div className='inner-content'>
                                                {props.children}
                                            </div>
                                        )
                                    }
                                </>
                            )}



                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}