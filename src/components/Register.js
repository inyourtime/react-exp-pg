import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";

const Register = ({ setRegister }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [isUserExist, setIsUserExist] = useState(false);

    const AlertUserExist = ({ isUserExist }) => {
        if (isUserExist) {
            return (
                <div className="alert alert-warning" role="alert">
                    Email already exist !
                </div>
            );
        }
        return (
            <div className="alert alert-primary" role="alert">
                Please sign up
            </div>
        );
    };

    const onSubmitForm = async (e) => {
        e.preventDefault();

        try {
            const body = {
                email: email,
                password: password,
                name: name,
            };
            const response = await fetch(
                "http://localhost:5000/auth/register",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                }
            );

            const parseRes = await response.json();
            if (parseRes.token) {
                // localStorage.setItem("token", parseRes.token);
                setRegister(true);
            } else {
                setRegister(false);
                setIsUserExist(true);
            }
        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <Fragment>
            <h1 className="text-center my-5">Register</h1>
            <AlertUserExist isUserExist={isUserExist} />
            <form onSubmit={onSubmitForm}>
                <input
                    type="email"
                    name="email"
                    placeholder="email"
                    className="form-control my-3"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="password"
                    className="form-control my-3"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                />
                <input
                    type="text"
                    name="name"
                    placeholder="name"
                    className="form-control my-3"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                    }}
                />
                <button className="btn btn-success col-12">Submit</button>
            </form>
            <Link to="/login">Login</Link>
        </Fragment>
    );
};

export default Register;
