import React, { useState } from 'react';
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBBtn,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBCollapse,
} from 'mdb-react-ui-kit';

export default function App() {
  const [showBasic, setShowBasic] = useState(false);
  const header_Username = props.user.username; // Replace with your header_Username value
  const total_profit = props.user.total_profit; // Replace with your header_Username value
  console.log("Header = ", props)
  const logout = () => {
    localStorage.setItem("mytoken", "no");
    window.location.reload();

  }
  return (
    <MDBNavbar expand='lg' light bgColor='light'>
      <MDBContainer fluid>
        <MDBNavbarBrand href='#'>Brand</MDBNavbarBrand>

        <MDBNavbarToggler
          aria-controls='navbarSupportedContent'
          aria-expanded='false'
          aria-label='Toggle navigation'
          onClick={() => setShowBasic(!showBasic)}
        >
          <MDBIcon icon='bars' fas />
        </MDBNavbarToggler>

        <MDBCollapse navbar show={showBasic}>
          <MDBNavbarNav className='mr-auto mb-2 mb-lg-0'>
            <MDBNavbarItem>
              <MDBNavbarLink active aria-current='page' href='#'>
                <MDBNavbarLink href='/'>Home</MDBNavbarLink>
              </MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink href='/History'>History</MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink href='/Contest'>Global</MDBNavbarLink>
            </MDBNavbarItem>

            <MDBNavbarItem>
              <MDBDropdown>
                <MDBDropdownToggle tag='a' className='nav-link' role='button'>
                  Dropdown
                </MDBDropdownToggle>
                <MDBDropdownMenu>
                  <MDBDropdownItem link>Action</MDBDropdownItem>
                  <MDBDropdownItem link>Another action</MDBDropdownItem>
                  <MDBDropdownItem link>Something else here</MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBNavbarItem>

            <MDBNavbarItem>
              <MDBNavbarLink disabled href='#' tabIndex={-1} aria-disabled='true'>
                Disabled
              </MDBNavbarLink>
            </MDBNavbarItem>
          </MDBNavbarNav>

          {/* <form className='d-flex input-group w-auto'>
            <input type='search' className='form-control' placeholder='Type query' aria-label='Search' />
            <MDBBtn color='primary'>Search</MDBBtn>
          </form> */}
          <div className="d-flex align-items-center">
            <div title=" 0 stars :- if profit < 0
                        1 stars :- if profit >= 0  
                        2 stars :- if profit >= 100  
                        3 stars :- if profit >= 200  
                        4 stars :- if profit >= 300  
                        5 stars :- if profit >= 400 " style={{ textDecoration: "none" }}>
              {header_Username === "--" ? (
                <li className="nav-item" style={{ listStyle: "none" }}>
                  <AiOutlineStar style={{ color: "white", fontSize: "1.5rem" }} />
                  <AiOutlineStar style={{ color: "white", fontSize: "1.5rem" }} />
                  <AiOutlineStar style={{ color: "white", fontSize: "1.5rem" }} />
                  <AiOutlineStar style={{ color: "white", fontSize: "1.5rem" }} />
                  <AiOutlineStar style={{ color: "white", fontSize: "1.5rem" }} />
                </li>
              ) : (
                <>
                  {total_profit <= 0 ? (
                    <li className="nav-item" style={{ listStyle: "none" }}>
                      <AiTwotoneStar style={{ color: "orange", fontSize: "1.5rem" }} />
                      <AiOutlineStar style={{ color: "white", fontSize: "1.5rem" }} />
                      <AiOutlineStar style={{ color: "white", fontSize: "1.5rem" }} />
                      <AiOutlineStar style={{ color: "white", fontSize: "1.5rem" }} />
                      <AiOutlineStar style={{ color: "white", fontSize: "1.5rem" }} />
                    </li>
                  ) : total_profit > 0 ? (
                    <li className="nav-item" style={{ listStyle: "none" }}>
                      <AiTwotoneStar style={{ color: "orange", fontSize: "1.5rem" }} />
                      <AiTwotoneStar style={{ color: "orange", fontSize: "1.5rem" }} />
                      <AiOutlineStar style={{ color: "white", fontSize: "1.5rem" }} />
                      <AiOutlineStar style={{ color: "white", fontSize: "1.5rem" }} />
                      <AiOutlineStar style={{ color: "white", fontSize: "1.5rem" }} />
                    </li>
                  ) : total_profit >= 100 ? (
                    <li className="nav-item" style={{ listStyle: "none" }}>
                      <AiTwotoneStar style={{ color: "orange", fontSize: "1.5rem" }} />
                      <AiTwotoneStar style={{ color: "orange", fontSize: "1.5rem" }} />
                      <AiTwotoneStar style={{ color: "orange", fontSize: "1.5rem" }} />
                      <AiOutlineStar style={{ color: "white", fontSize: "1.5rem" }} />
                      <AiOutlineStar style={{ color: "white", fontSize: "1.5rem" }} />
                    </li>
                  ) : total_profit >= 200 ? (
                    <li className="nav-item" style={{ listStyle: "none" }}>
                      <AiTwotoneStar style={{ color: "orange", fontSize: "1.5rem" }} />
                      <AiTwotoneStar style={{ color: "orange", fontSize: "1.5rem" }} />
                      <AiTwotoneStar style={{ color: "orange", fontSize: "1.5rem" }} />
                      <AiTwotoneStar style={{ color: "orange", fontSize: "1.5rem" }} />
                      <AiOutlineStar style={{ color: "white", fontSize: "1.5rem" }} />
                    </li>
                  ) : (
                    <li className="nav-item" style={{ listStyle: "none" }}>
                      <AiTwotoneStar style={{ color: "orange", fontSize: "1.5rem" }} />
                      <AiTwotoneStar style={{ color: "orange", fontSize: "1.5rem" }} />
                      <AiTwotoneStar style={{ color: "orange", fontSize: "1.5rem" }} />
                      <AiTwotoneStar style={{ color: "orange", fontSize: "1.5rem" }} />
                      <AiTwotoneStar style={{ color: "orange", fontSize: "1.5rem" }} />
                    </li>
                  )}
                </>
              )}
            </div>
            {header_Username === "--" ? (
              <li className="nav-item" style={{ listStyle: "none" }}>

                <div className="col text-center d-sm-flex justify-content-sm-center align-items-sm-center">
                  <button className="btn btn-danger" style={{ margin: "0px 10px", backgroundColor: "rgb(255, 255, 255)", color: "black", padding: "7px 9px" }}>
                  <a className="nav-link" style={{ color: "rgb(0, 0, 0)" }} href="/Login">Login</a>
                  </button>
                </div>
                
              </li>

            ) : (
              <li className="nav-item" style={{ listStyle: "none" }}>
                <div className="col text-center d-sm-flex justify-content-sm-center align-items-sm-center">
                  <button onClick={logout} className="btn btn-danger" style={{ margin: "0px 10px", backgroundColor: "rgb(255, 255, 255)", color: "black", padding: "7px 9px" }}>
                    Logout
                  </button>
                </div>
              </li>
            )}
            <li className="nav-item" style={{ listStyle: "none" }}>
              <div className="col text-center d-sm-flex justify-content-sm-center align-items-sm-center">
                  <button className="btn btn-danger" style={{ margin: "0px 10px", backgroundColor: "rgb(255, 255, 255)", color: "black", padding: "7px 9px" }}>
                  <a className="nav-link" style={{ color: "rgb(0, 0, 0)" }} href="/Register">New Account</a>
                  </button>
                </div>
            </li>
          </div>

        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
}