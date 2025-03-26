import React from 'react';
import { HeadingProps } from '../../types';
import "./Heading.scss";

export const Heading: React.FC<HeadingProps> = (props) => {
  const Tag = props.tag || 'h1';

  return (
    <Tag className={`customHeading ${props.className ? props.className : ''}`}>{props.children}</Tag>
  );
};
