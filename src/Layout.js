import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Outlet} from "react-router-dom";
import {
    Navbar,
    NavbarBrand,
    NavItem,
    Dropdown,
    DropdownItem,
    DropdownToggle,
    DropdownMenu,
    NavLink,
    Nav,
} from 'reactstrap';

function Layout(props) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggle = () => setDropdownOpen(!dropdownOpen);

    return (
        <>
            <Navbar className="my-2"  >
                <NavbarBrand href="/">
                    <img
                        alt="logo"
                        src="/logo-white.svg"
                        style={{
                            height: 40,
                            width: 40
                        }}
                    />
                    Ettarra
                </NavbarBrand>
                <Nav>
                    <Dropdown nav isOpen={dropdownOpen} toggle={toggle}>
                        <DropdownToggle nav caret>
                            Login
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem><NavLink href="/Customer">Customer</NavLink></DropdownItem>
                            <DropdownItem divider />
                            <DropdownItem><NavLink href="/Admin">Admin</NavLink></DropdownItem>
                            <DropdownItem divider />
                            <DropdownItem><NavLink href="/Cafe">Cafe</NavLink></DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <NavItem>
                        <NavLink href="#">Website</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="#">Instagram</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink disabled href="#">
                            Maps
                        </NavLink>
                    </NavItem>
                </Nav>
            </Navbar>

            <Outlet />
        </>
    )
};

export default Layout;