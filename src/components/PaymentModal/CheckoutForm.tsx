import React, { useEffect, useState } from 'react';
import './CheckoutForm.scss';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useElements, useStripe, PaymentRequestButtonElement } from '@stripe/react-stripe-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAppleAlt } from "@fortawesome/free-solid-svg-icons";

const stripePromise = loadStripe('YOUR_PUBLIC_STRIPE_KEY');

interface CheckoutProps {
    stripeTokenHandler: (token: string) => void;
    onTokenGenerated: () => void;
    from?: string;
    currency: string;
    amount: number;
    country?: string;
    isValid?: boolean;
}

const cardBrandIcons: { [key: string]: string } = {
    visa: require("../../assets/images/payment/cards/visa.png"),
    mastercard: require("../../assets/images/payment/cards/master.png"),
    amex: require("../../assets/images/payment/cards/American_Express.png"),
    discover: require("../../assets/images/payment/cards/discover.png"),
    unionpay: require("../../assets/images/payment/cards/unionpay.png"),
};

export const CheckoutForm: React.FC<CheckoutProps> = ({ stripeTokenHandler, onTokenGenerated, from, currency, amount, country, isValid }) => {

    const currencySymbols: { [key: string]: string } = {
        "$": "usd",
        "€": "eur",
        "£": "gbp",
    };
    const stripe = useStripe();
    const elements = useElements();

    const [cardBrand, setCardBrand] = useState('unknown');
    const [cardNumberError, setCardNumberError] = useState('');
    const [cardExpiryError, setCardExpiryError] = useState('');
    const [cardCvcError, setCardCvcError] = useState('');
    const [countryError, setCountryError] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [paymentRequest, setPaymentRequest] = useState<any>(null);
    const [canMakePayment, setCanMakePayment] = useState(false);


    let color = '#ffffff';
    if (from === 'modal') {
        color = '#141414'
    }
    const style = {
        base: {
            color: color,
            fontFamily: '"Public Sans", sans-serif"',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
                color: '#9d9c9c',
            },

        },
        invalid: {
            color: '#fa755a',
            iconColor: '#fa755a',
        },
    };

    const handleCardNumberChange = (event: any) => {
        setCardBrand(event.brand);
        setCardNumberError(event.error ? event.error.message : '');
    };

    const handleCardExpiryChange = (event: any) => {
        setCardExpiryError(event.error ? event.error.message : '');
    };

    const handleCardCvcChange = (event: any) => {
        setCardCvcError(event.error ? event.error.message : '');
    };

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const cardElement = elements.getElement(CardNumberElement);

        if (cardElement) {
            const { token, error } = await stripe.createToken(cardElement);
            if (error) {
                stripeTokenHandler('Error');
                setCardNumberError(error.message ? error.message : '');
            } else {
                stripeTokenHandler(token.id);
                onTokenGenerated();
            }
        }
    };

    useEffect(() => {
        if (!stripe) return;

        const supportedCountries = [
            "AE", "AT", "AU", "BE", "BG", "BR", "CA", "CH", "CI", "CR", "CY", "CZ", "DE", "DK", "DO", "EE", "ES",
            "FI", "FR", "GB", "GI", "GR", "GT", "HK", "HR", "HU", "ID", "IE", "IN", "IT", "JP", "LI", "LT", "LU", "LV",
            "MT", "MX", "MY", "NL", "NO", "NZ", "PE", "PH", "PL", "PT", "RO", "SE", "SG", "SI", "SK", "SN", "TH", "TT",
            "US", "UY"
        ];

        if (!country || !supportedCountries.includes(country)) {
            setCanMakePayment(false);
            setPaymentRequest(null);
            setCountryError('Country not supporeted for apple pay');
            return;
        }
        setCountryError('');
        const pr = stripe.paymentRequest({
            country: country || 'GB',
            currency: currencySymbols[currency],
            total: {
                label: "Reach",
                amount: Math.round(amount * 100),
            },
            requestPayerName: true,
            requestPayerEmail: true,
            // disableWallets: ['link'],
        });
        console.log('paymentrequest', pr);
        pr.canMakePayment().then((result) => {
            if (result) {
                setCanMakePayment(true);
                setPaymentRequest(pr);
            }
        });
        pr.on('token', ({ complete, token }) => {
            console.log('Apple Pay Token:', token);
            stripeTokenHandler(token.id); // Send token to backend
            onTokenGenerated();
            complete('success'); // Mark transaction as successful
        });
    }, [stripe, currency, amount, country]);
    return (
        <div className='checkoutForm-page'>
            <div className='payment-options'>
                <label className="radio-label">
                    <input
                        type='radio'
                        name='paymentMethod'
                        value='card'
                        checked={paymentMethod === 'card' && isValid !== false}
                        onChange={() => { setPaymentMethod('card'); stripeTokenHandler('Error'); }}
                        className='radio-input'
                    />
                    <span className="custom-radio"></span>
                    Pay with Card
                </label>
            </div>
            {paymentMethod === 'card' && isValid !== false && (
                <form id="checkout-form" onSubmit={handleSubmit}>
                    <div className="form-group cardInputHolder">
                        <label htmlFor="card-number">Card Number</label>
                        <CardNumberElement id="card-number" options={{ style }} onChange={handleCardNumberChange} />
                        {cardBrandIcons[cardBrand] && (
                            <div className='cardIcon'>
                                <img src={cardBrandIcons[cardBrand]} alt="Card Brand" style={{ width: '40px', height: 'auto' }} />
                            </div>
                        )}
                        {cardNumberError && <div className="error" style={{ color: '#FF0075' }}>{cardNumberError}</div>}
                    </div>
                    <div className='row'>
                        <div className='col-md-6 col-sm-6'>
                            <div className="form-group">
                                <label htmlFor="card-expiry">Expiration Date</label>
                                <CardExpiryElement id="card-expiry" options={{ style }} onChange={handleCardExpiryChange} />
                                {cardExpiryError && <div className="error" style={{ color: '#FF0075' }}>{cardExpiryError}</div>}
                            </div>
                        </div>
                        <div className='col-md-6 col-sm-6'>
                            <div className="form-group">
                                <label htmlFor="card-cvc">CVC</label>
                                <CardCvcElement id="card-cvc" options={{ style }} onChange={handleCardCvcChange} />
                                {cardCvcError && <div className="error" style={{ color: '#FF0075' }}>{cardCvcError}</div>}
                            </div>
                        </div>
                    </div>
                </form>
            )}
            <div className='payment-options'>
                <label className="radio-label">
                    <input
                        type='radio'
                        name='paymentMethod'
                        value='applePay'
                        checked={paymentMethod === 'applePay' && isValid !== false}
                        onChange={() => { setPaymentMethod('applePay'); stripeTokenHandler('Error'); }}
                        className='radio-input'
                    />
                    <span className="custom-radio"></span>
                    Pay with Wallet
                </label>
            </div>
            {paymentMethod === 'applePay' && isValid !== false && (
                canMakePayment && paymentRequest && (
                    <>
                        {/* <PaymentElement id="payment-element" /> */}
                        <PaymentRequestButtonElement
                            options={{ paymentRequest }}

                        />

                    </>
                )
            )}
            {countryError && <div className="error" style={{ color: '#FF0075' }}>{countryError}</div>}
        </div>

    );
};
