import "./Navbar.scss";
import { NavLink } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
} from "reactstrap";
export const NavbarMenu = () => {
  return (
    <div>
      <Navbar className="navbar-menu navbar-expand-md">
        <Nav className="me-auto" navbar>

          <NavItem>
            <NavLink to="/partners">Partners</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/chandlery">Chandlery</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/experts">Experts</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/club-house">ClubHouse</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/charter">Charter</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/weather">Weather</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/cruz">CRUZ</NavLink>
          </NavItem>
          {/* <UncontrolledDropdown nav inNavbar>
                        <DropdownToggle nav caret>
                            Members Area
                        </DropdownToggle>
                        <DropdownMenu right>
                                
                                
                                
                                <NavLink to="/chandlery">Notice Board</NavLink>
                        </DropdownMenu>
                    </UncontrolledDropdown> */}
        </Nav>
      </Navbar>
    </div>
  );
};
