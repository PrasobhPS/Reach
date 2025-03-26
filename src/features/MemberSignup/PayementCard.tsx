import React, { useEffect, useState } from "react";
import "./Membersignup.scss";
import { loadStripe, Token } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CheckoutForm } from "../../components/PaymentModal/CheckoutForm";

interface PaymentCardProps {
  stripeTokenHandler: (token: string) => void;
  currency: string;
  amount: number;
  country: string;
  isValid?: boolean;

}
const stripe_key = process.env.REACT_APP_STRIPE_PUBLIC_KEY;
const stripePromise = loadStripe(`${stripe_key}`);
export const PaymentCard: React.FC<PaymentCardProps> = ({
  stripeTokenHandler,
  currency,
  amount,
  country,
  isValid
}) => {
  const [isTokenGenerated, setIsTokenGenerated] = useState(false);

  const handleTokenGenerated = () => {
    setIsTokenGenerated(true);
  };

  return (
    <div className="payment-formcard">
      <Elements stripe={stripePromise}>
        <CheckoutForm
          stripeTokenHandler={stripeTokenHandler}
          onTokenGenerated={handleTokenGenerated}
          currency={currency}
          amount={amount}
          country={country}
          isValid={isValid}
        />
      </Elements>
    </div>
  );
};

export default PaymentCard;
