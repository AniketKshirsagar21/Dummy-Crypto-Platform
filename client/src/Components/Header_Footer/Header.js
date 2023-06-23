import React from 'react';
import { AiOutlineStar, AiTwotoneStar } from 'react-icons/ai';
import "./loader-animation.css"
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

// import { Link} from 'react-router-dom'
const Header = (props) => {
  const header_Username = props.user.username; // Replace with your header_Username value
  const total_profit = props.user.total_profit; // Replace with your header_Username value
  console.log("Header = ", props)
  const logout = () => {
    localStorage.setItem("mytoken", "no");
    window.location.reload();
  }
  return (
    <Navbar expand="lg" className="bg-body-tertiary" style={{ backgroundColor: "#262626" }}>
        <span className="navbar-brand" style={{
          color: "white",
          border: "2px solid",
          padding: "6px 12px",
          borderRadius: "12px",
          fontSize: "1.1rem"
        }}>
          Dummy Crypto

        </span>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="me-auto">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item" style={{ listStyle: "none", marginLeft: "15px", fontSize: "1.3rem" }}>
                <a style={{ color: "white" }} className="nav-link active" aria-current="page" href="/">Home</a>
              </li>
              <li className="nav-item" style={{ listStyle: "none", marginLeft: "15px", fontSize: "1.3rem" }}>
                <a style={{ color: "white" }} className="nav-link active" aria-current="page" href="/History">History</a>
              </li>
              <li className="nav-item" style={{ listStyle: "none", marginLeft: "15px", fontSize: "1.3rem" }}>
                <a style={{ color: "white" }} className="nav-link active" aria-current="page" href="/Contest">Global</a>
              </li>
            </ul>
            </Nav>
            <Nav className="" >
            <li className="nav-item" style={{ listStyle: "none", marginLeft: "15px", fontSize: "1.5rem" }}>
              <a className="nav-link active" aria-current="page" href="/" style={{ color: "white" }}>
                <strong>{header_Username}</strong>
              </a>
            </li>
            <div className="d-flex align-items-center justify-content-end">
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
                      <a className="nav-link" style={{ color: "rgb(0, 0, 0)" ,padding :"0px"}} href="/Login">Login</a>
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
                    <a className="nav-link" style={{ color: "rgb(0, 0, 0)" , padding :"0px"}} href="/Register">New Account</a>
                  </button>
                </div>
              </li>
            </div>
          </Nav >
        </Navbar.Collapse >
    </Navbar >
  );
};

export default Header;