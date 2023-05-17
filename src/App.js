import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
} from 'reactstrap';
import {
  Card,
  CardImg,
  CardImgOverlay,
  CardTitle,
  CardText,
} from 'reactstrap';

function App(args) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  return (
    <div className="App">
      <div>
        <Navbar {...args}>
          <NavbarBrand href="/">reactstrap</NavbarBrand>
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="me-auto" navbar>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  Login Option
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem><NavLink to="/admin">Customer</NavLink></DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem>HR</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem>Admin</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              <NavItem>
                <NavLink href="/components/">Instagram</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="https://github.com/reactstrap/reactstrap">
                  Location
                </NavLink>
              </NavItem>
            </Nav>
            <NavbarText>By Ettarra</NavbarText>
          </Collapse>
        </Navbar>
      </div>
      <div>
        <Card className='m-5 '>
          <CardImg
            alt="Card image cap"
            src="https://picsum.photos/900/270?grayscale"
            style={{
              height: 270
            }}
            width="100%"
          />
          <CardImgOverlay>
            <CardTitle tag="h5">
              Card Title
            </CardTitle>
            <CardText>
              This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.
            </CardText>
            <CardText>
              <small className="text-muted">
                Last updated 3 mins ago
              </small>
            </CardText>
          </CardImgOverlay>
        </Card>
      </div>
    </div>
  );
}

export default App;
