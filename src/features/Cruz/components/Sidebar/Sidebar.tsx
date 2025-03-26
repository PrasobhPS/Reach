import { NavLink } from 'react-router-dom';
import { Button } from '../../../../components/Button/Button';
import React, { useState, useEffect } from "react";
import ListAccordion from "../../../../components/ListAccordion/ListAccordion";
import './Sidebar.scss';
interface CruzMenuSingle {
  text: string;
  target?: string;
  className?: string;
  count?: number;
}
export interface CruzMenuProps {
  CruzMenu: CruzMenuSingle[];
  pageLink: string;
}

export const Sidebar: React.FC<CruzMenuProps> = ({
  CruzMenu,
  pageLink
}) => {

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  return (
    <div>

      <ListAccordion
        title="Menu"
        list={CruzMenu}
        pageLink={pageLink}
        isOpen={openIndex === 0}
        toggleAccordion={() => toggleAccordion(0)}

      />

    </div>
    // <div className='cruz-sidebar'>
    //     <Button onClick={()=>console.log('Hello')} text='New Campaign' icon={true} theme='light'/>
    //     <ul className="sidebar-navitems">
    //         <li className="active">
    //             <NavLink className="navLink" to={'/'}>All Posts</NavLink>
    //         </li>
    //         <li>
    //             <NavLink className="navLink" to={'/'}>My Posts</NavLink>
    //         </li>
    //         <li>
    //             <NavLink className="navLink" to={'/'}>Drafts</NavLink>
    //         </li>
    //         <li>
    //             <NavLink className="navLink" to={'/'}>Saved</NavLink>
    //         </li>
    //     </ul>
    // </div>
  )
}