export interface DobValues {
  dobDay: string;
  dobMonth: string;
  dobYear: string;
}
export interface StatusValues {
  members_name: string;
  members_email: string;
  members_phone: string;
  members_dob: string;
  members_address: string;
  members_country: string;
  members_region: string;
  members_biography: string;
  members_about_me: string;
  members_interest: string;
}
export interface ProfileData {
  members_name_title: string;
  members_fname: string;
  members_lname: string;
  members_email: string;
  members_status: string;
  members_payment_status: string;
  members_dob: string;
  members_dob_data: DobValues;
  members_phone_code: string;
  members_phone: string;
  members_address: string;
  members_country: string;
  members_region: string;
  members_employment: string;
  members_employment_history: string;
  members_biography: string;
  members_interest: string;
  members_about_me: string;
  members_type: string;
  dobYear: string;
  dobMonth: string;
  dobDay: string;
  members_profile_picture: string;
  phone_code: string;
  members_town: string;
  members_street: string;
  members_postcode: string;
  members_dial_code: string;
  displayStatus: StatusValues;
  google_token?: string;
  referral_code?: string;
  members_subscription_end_date?: string;
  members_subscription_plan?: string;
  discount_amount?: string;
}
export const initialProfileData: ProfileData = {
  members_name_title: "",
  members_fname: "",
  members_lname: "",
  members_email: "",
  members_status: "",
  members_payment_status: "",
  members_dob: "",
  members_dob_data: {
    dobDay: "",
    dobMonth: "",
    dobYear: "",
  },
  members_phone_code: "",
  members_phone: "",
  members_address: "",
  members_country: "",
  members_region: "",
  members_employment: "",
  members_employment_history: "",
  members_biography: "",
  members_interest: "",
  members_about_me: "",
  members_type: "",
  dobYear: "",
  dobMonth: "",
  dobDay: "",
  members_profile_picture: "",
  phone_code: "",
  members_town: "",
  members_street: "",
  members_postcode: "",
  members_dial_code: "",
  displayStatus: {
    members_name: "",
    members_email: "",
    members_phone: "",
    members_dob: "",
    members_address: "",
    members_country: "",
    members_region: "",
    members_biography: "",
    members_about_me: "",
    members_interest: "",
  },
};
