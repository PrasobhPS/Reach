export interface DobValues {
  dobDay: string;
  dobMonth: string;
  dobYear: string;
}
export interface SignupInterface {
  members_email: string;
  members_name_title: string;
  members_fname: string;
  members_lname: string;
  members_phone_code: string;
  members_phone: string;
  members_address: string;
  members_town: string;
  members_street: string;
  members_country: string;
  members_region: string;
  members_postcode: string;
  members_dob_day: string;
  members_dob_month: string;
  Members_dob_year: string;
  members_dob: string;
  members_dob_data: DobValues;
  members_password: string;
  members_password_confirmation: string;
  dobYear: string;
  dobMonth: string;
  dobDay: string;
  is_logedin: number;
  phone_code: string;
  stripeToken?: string;
  currency?: "USD" | "GBP" | "EUR";
  ios_payment_token?: string;
}
export const initialSignupInterface: SignupInterface = {
  members_email: "",
  members_name_title: "",
  members_fname: "",
  members_lname: "",
  members_phone_code: "",
  members_phone: "",
  members_address: "",
  members_town: "",
  members_street: "",
  members_country: "",
  members_region: "",
  members_postcode: "",
  members_dob_day: "",
  members_dob_month: "",
  Members_dob_year: "",
  members_dob: "",
  members_dob_data: {
    dobDay: "",
    dobMonth: "",
    dobYear: "",
  },
  members_password: "",
  members_password_confirmation: "",
  dobYear: "",
  dobMonth: "",
  dobDay: "",
  is_logedin: 0,
  phone_code: "",
};
