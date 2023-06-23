import React, { useEffect, useState } from 'react';
// import Header from '../HomePage/Header';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import Header from '../Header_Footer/Header';
import { LoginApi } from '../../Services/API';
function Login() {
    const navigate = useNavigate();
    const [data, setData] = useState({
        username: "--",
        invalid_msg: "no",
        loggedin: false,
        enterUsername: "",
        enterPassword: ""
    })

    useEffect(() => {
        let mytoken = localStorage.getItem('mytoken');
        let username1 = "--";
        if (mytoken != "no" && mytoken != undefined) {
            username1 = jwt_decode(mytoken).username1;
        }
        setData({ ...data, username: username1 })

        if (data.loggedin)
            navigate('/');
    }, [])


    // const updateUsername = (e) => {
    //     setData({
    //         ...data,
    //         enterUsername: e.target.value
    //     })
    // }

    // const updatePassword = (e) => {
    //     setData({
    //         ...data,
    //         enterPassword: e.target.value
    //     })
    // }

    const handleSubmit = async (e) => {
        e.preventDefault();

        let postData = {
            entered_username: data.enterUsername,
            entered_password: data.enterPassword
        }


        const result = await LoginApi(postData);

        if (result) {
            console.log("data got from post request -> ", result)
            if (result.invalid_msg === "Correct") {
                console.log("Correct credentials = ", result)
                localStorage.setItem("mytoken", result.token);
                const decodedToken = jwt_decode(result.token);
                console.log("token name ", decodedToken)

                setData({
                    ...data,
                    loggedin: true
                })

                navigate('/')
            }
            else if (result.invalid_msg === "Invalid Username" || result.invalid_msg === "Invalid Password") {
                console.log(result.invalid_msg);
                localStorage.setItem("mytoken", "no");
                setData({
                    ...data,
                    invalid_msg: result.invalid_msg
                })
            }
        }
        else {
            console.log("Unable to get HomePageData => ", result)
        }
    }

    if (data.loggedin === true)
        return (
            <>
                correct
            </>
        )


    return (
        <>
            <Header user={{ username: data.username, total_profit: 0 }} />

            <section>
                <div className="container py-5 h-100">
                    <div className="row  justify-content-center align-items-center h-100">
                        <div className="card" style={{
                            borderadius: "1rem",
                            backgroundColor: "#131727d9",
                            color: "white",
                            maxWidth: "375px"
                        }}>
                            {data.invalid_msg === "Invalid Username" || data.invalid_msg === "Invalid Password" ?
                                <h3> {data.invalid_msg}</h3>
                                :
                                null
                            }
                            <div className="card-body p-4 p-lg-5 text-black" style={{ textAlign: "center" }}>

                                <form onSubmit={(e) => handleSubmit(e)}>

                                    <div className=" align-items-center mb-3 pb-1">

                                        <span className="h1 fw-bold mb-0" style={{ color: "red" }}>Login</span>
                                    </div>



                                    <div className="row">

                                        <label className="form-label" for="lastName" style={{ color: "white" }}>Username
                                            :-
                                            <input type="text" value={data.enterUsername} onChange={(e) => {
                                                setData({
                                                    ...data,
                                                    enterUsername: e.target.value
                                                })
                                            }} id="lastName" name="entered_username"
                                                className="form-control form-control-lg" placeholder="Username"
                                            />
                                        </label>

                                    </div>

                                    <div className="form-outline mb-4">
                                        <label className="form-label" for="form2Example27"
                                            style={{ color: "white" }}>Password</label>
                                        <input type="password" value={data.enterPassword} onChange={(e) => {
                                            setData({
                                                ...data,
                                                enterPassword: e.target.value
                                            })
                                        }} id="myInput" className="form-control form-control-lg"
                                            placeholder="Password" name="entered_password" />

                                        <div style={{ marginTop: "10px", color: "white" }}>

                                            <input type="checkbox" onClick="myFunction()" />
                                            <span>
                                                Show Password
                                            </span>

                                        </div>
                                    </div>

                                    <div className="pt-1 mb-4">
                                        <a className="btn btn-danger btn-lg" style={{ margin: "10px" }} href="/">Cancel </a>
                                        <button className="btn btn-primary btn-lg btn-block"
                                            type="submit">Login</button>
                                    </div>


                                </form>


                            </div>
                        </div>
                    </div>
                </div>

            </section>


        </>
    )


}





export default Login;