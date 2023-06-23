import React, { useState, useEffect } from 'react';
import Header from '../Header_Footer/Header';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { RegisterApi } from '../../Services/API';

const Register = () => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [curr_username, setCurrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission
        console.log(firstName, lastName, username, password, email);
        let postData = {
            fname: firstName,
            lname: lastName,
            Choosen_username: username,
            Choosen_password: password,
            myemail: email,
            username: "--"
        }
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,16}$/;
        if(username.length < 3){
            alert("Username should contain atleast 3 characters")
            return;
        }
        else if (!passwordRegex.test(password)) {
            alert('Password should be 8 characters long and contain at least one letter and one number');
            return;
        }

        const result = await RegisterApi(postData);

        if (result) {
            console.log("data got from register request -> ", result)
            if (result.msg === "Correct") {
                console.log("Correct credentials")
                localStorage.setItem("mytoken", result.token);
                const decodedToken = jwt_decode(result.token);
                console.log("token name ", decodedToken)
                navigate('/')
            }
            else {
                alert(result.msg);
                localStorage.setItem("mytoken", "no");
            }
        }
        else {
            console.log("Unable to get HomePageData => ", result)
        }
    };

    useEffect(() => {
        let mytoken = localStorage.getItem('mytoken');
        let username1 = "--";
        if (mytoken != "no" && mytoken != undefined) {
            username1 = jwt_decode(mytoken).username1;
        }
        setCurrUsername(username1)

    }, [])

    return (
        <>
            {/* <Header /> */}
            <Header user={{ username: curr_username, total_profit: 0 }} />

            <section style={{ backgroundColor: '#e4e4e4' }}>
                <div className="container py-5 h-100">
                    <div className="row justify-content-center align-items-center h-100">
                        <div className="col-12 col-lg-9 col-xl-7">
                            <div className="card shadow-2-strong card-registration" style={{ borderRadius: '1rem', backgroundColor: '#131727d9', color: 'white' }}>
                                <div className="card-body p-4 p-md-5" style={{ textAlign: 'center' }}>
                                    <h3 className="mb-4 pb-2 pb-md-0 mb-md-5" style={{ color: 'rgb(238, 88, 88)' }}>New Registration</h3>
                                    <form onSubmit={(e) => handleSubmit(e)}>

                                        <div className="row">
                                            <div className="col-md-6 mb-4">
                                                <div className="form-outline">
                                                    <label className="form-label" htmlFor="firstName">First Name</label>
                                                    <input
                                                        required
                                                        placeholder="Enter first name"
                                                        type="text"
                                                        id="firstName"
                                                        name="fname"
                                                        className="form-control form-control-lg"
                                                        value={firstName}
                                                        onChange={(e) => setFirstName(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6 mb-4">
                                                <div className="form-outline">
                                                    <label className="form-label" htmlFor="lastName">Last Name</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter last name"
                                                        id="lastName"
                                                        name="lname"
                                                        className="form-control form-control-lg"
                                                        value={lastName}
                                                        onChange={(e) => setLastName(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row" style={{ justifyContent: 'center' }}>
                                            <div className="col-md-6 mb-4">
                                                <div className="form-outline">
                                                    <label className="form-label" htmlFor="lastName">Choose User Name :- </label>
                                                    <input
                                                        required
                                                        type="text"
                                                        placeholder="Enter Username"
                                                        id="username"
                                                        name="Choosen_username"
                                                        className="form-control form-control-lg"
                                                        value={username}
                                                        onChange={(e) => setUsername(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6 mb-4">
                                                <div className="form-outline">
                                                    <label className="form-label" htmlFor="phoneNumber">Choose Password</label>
                                                    <input
                                                        required
                                                        type="tel"
                                                        placeholder="Enter password"
                                                        id="phoneNumber"
                                                        name="Choosen_password"
                                                        className="form-control form-control-lg"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-12 mb-4 pb-2">
                                                <div className="form-outline">
                                                    <label className="form-label" htmlFor="emailAddress">Email</label>
                                                    <input
                                                        required
                                                        type="email"
                                                        placeholder="Enter email"
                                                        id="emailAddress"
                                                        name="myemail"
                                                        className="form-control form-control-lg"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-2" style={{ textAlign: 'center', marginBottom: '10px' }}>
                                            <a className="btn btn-danger btn-lg" style={{ backgroundColor: 'rgb(238, 88, 88)', borderColor: 'rgb(238, 88, 88)' }} href="/">Cancel</a>
                                            <input className="btn btn-primary btn-lg" type="submit" value="Create" />
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Register;
