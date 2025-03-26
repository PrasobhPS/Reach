import { IconProp } from "@fortawesome/fontawesome-svg-core";
import React from "react";
import { RegisterOptions } from "react-hook-form";
import { ReactNode } from "react";
export interface ButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  text?: string;
  icon?: boolean;
  theme?: "dark" | "light" | "grey";
  width?: string;
  className?: string;
  iconname?: IconProp;
  children?: ReactNode;
  disabled?: boolean;
  img?: string;
  id?: string;
  form?: string;
}

export interface HeadingProps {
  children: React.ReactNode;
  tag?: keyof JSX.IntrinsicElements;
  className?: string;
}

// Input Interfaces
interface PatternConfig {
  value: RegExp;
  message: string;
}

export interface RequiredConfig {
  value: boolean;
  message: string;
}

export interface CustomInputProps {
  name: string;
  type?: "text" | "number" | "email" | "password" | "hidden";
  min?: number;
  rows?: number;
  defaultValue?: string;
  registerConfig: RegisterOptions & {
    required?: RequiredConfig | boolean;
    pattern?: PatternConfig;
  };
  placeholder?: string;
  className?: string;
  disable?: boolean;
  onClick?: () => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

// Select Box interface
interface Option {
  value: string;
  label: string;
}
export interface CustomSelectProps {
  name: string;
  options: Option[];
  registerConfig: RegisterOptions & {
    required?: RequiredConfig | boolean;
    pattern?: PatternConfig;
  };
  placeholder?: string;
  handleChange?: (select: string) => void;
}

// DOB Picker Interface
export interface DobPickerProps {
  registerConfig: RegisterOptions & {
    required?: RequiredConfig | boolean;
    pattern?: PatternConfig;
  };

}

//Telephone picker interface
export interface TelephoneFieldProps {
  name: string;
  defaultValue?: string;
  registerConfig: RegisterOptions & {
    required?: RequiredConfig | boolean;
    pattern?: PatternConfig;
  };
  initialValue?: string;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

//FullWindowImageBox Interface
export interface FullWindowImageBoxProps {
  isVideo?: boolean;
  source: string;
  children: React.ReactNode;
  className?: string;
}

//HalfWindowImageBox Interface
export interface HalfWindowImageBoxProps {
  isVideo?: boolean;
  sources: string[];
  children: React.ReactNode[];
  className?: string;
  url?: string[] | undefined;
  navigateTo?: boolean;
  id?: number;
}

//TwoColumnImageBox interface
export interface TwoColumnImageBoxProps {
  swapColumn?: boolean;
  children?: React.ReactNode;
  source: string;
  logo?: string;
  isBackground?: boolean;
}

//Hero Interface
export interface HeroProps {
  source: string;
  title: string;
  children?: React.ReactNode;
  className?: string;
  from?: string;
}

//FeaturesCard interface
interface FeaturesOptions {
  title: string;
  content: string;
  link: string;
  membership: boolean;
  free: boolean;
  open: boolean;
}

export interface FeaturesCardProps {
  options: FeaturesOptions;
}

//Card Props
export interface CardProps {
  source?: string;
  children?: React.ReactNode;
  classname?: string;
  theme?: "primary" | "secondary";
}

// Select Box interface
export interface VideoCardProps {
  data: {
    id: string | number;
    image: string;
    title: string;
    subtitle: string;
    bio?: string;
    videos: number | "";
    location: string | "";
    videoUrl: string | "";
  };
  onClick?: (videoSource: string) => void; // Change the type of onClick
  target: string | "";
}
// Select Box interface
interface profiledatas {
  id: string | number;
  specialist_profile_picture: string;
  specialist_title: string;
  specialist_biography: string;
  total_videos: string;
}
//Videocard Props
export interface profileDataProps {
  data: profiledatas[];
  path: string;
  target: string;
}

//List Accordion Interfaces
interface ListAccordionSingle {
  text: string;
  target?: string;
  className?: string;
  count?: number;
  button?: boolean;
  label?: boolean;
}
export interface ListAccordionProps {
  title: string;
  list: ListAccordionSingle[];
}

//Videoplayer interface
interface VideoChapter {
  title: string;
  time: number;
  active: boolean;
}
export interface VideoPlayerProps {
  videoId: string;
  source: string;
  chapters?: VideoChapter[];
  autoPlay?: boolean;
}

//Custom SLider props
interface singleSliderItem {
  image?: string;
  alt?: string;
  text?: string;
  video?: string;
  title?: string;
  details?: string;
  url?: string;
  fileType?: string;
  thumbnail?: string;
  active?: boolean;
  isLink?: boolean;
  room_id?: string;
  partner_id?: string;
}
export interface CustomSliderProps {
  settings: {};
  items: singleSliderItem[];
  className?: string;
  isVideo?: boolean;
  clickCallback?: (room_id: string) => void;
}
export interface DialCode {
  id: number;
  country_phonecode: string;
  country_name: string;
  country_iso: string;
}
export interface CountryPickerProps {
  name: string;
  registerConfig: RegisterOptions & {
    required?: RequiredConfig | boolean;
    pattern?: PatternConfig;
  };
  handleChange?: (country: { name: string; iso: string }) => void;
}
export interface CmsPage {
  pageHeader: string;
  pageDetails: string;
  pageImage: string;
  pageSlug: string;
  leftsidecontent?: string;
}
