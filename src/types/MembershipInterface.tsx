interface fetaures {
    feature: string;
}
interface MembershipFees {
    full_membership_fee: string;
    monthly_membership_fee: string;
    referal_percentage: string;
}
interface paymentFee {
    currency: string;
    fee: string;
    yearly: string;
}
export interface MemebershipProps {
    heading: string;
    plusNote?: string;
    membershipFee?: number;
    yearlyFee?: number;
    type: string;
    showButton: boolean;
    referral_code?: string;
    offerPrice?: MembershipFees | null;
    currency?: "USD" | "GBP" | "EUR";
    setPaymentFee?: (code: paymentFee) => void;
    setCardCurrency?: (currency: "USD" | "GBP" | "EUR") => void;
}

