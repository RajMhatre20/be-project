import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";
import Image from "../../images/register.jpg";
import "bootstrap/dist/css/bootstrap.min.css";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name: name,
          email: email,
          password: password,
        }
      );
      console.log(response);
      if (response.data.success) {
        // Redirect to login page on successful registration
        setError(`${response.data.message}, redirecting to login page`);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setError(response.data.error);
      }
    } catch (error) {
      setError(error.response.data.error);
    }
  };
  return (
    <>
      <div className="register__header">
        <div className="logo">
          <p>
            One <span>Cloud.</span>
          </p>
        </div>
      </div>
      <div className="register__content">
        <div className="register__image">
          <img src={Image} alt="" />
        </div>
        <div className="register__formpage">
          {/* <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            
            <button type="submit">Create an account</button>
          </form> */}
          <form onSubmit={handleSubmit} className="rounded bg-white shadow p-5">
            <h3 className="text-dark fw-bolder fs-4 mb-2">Create a Account</h3>
            <div className="fw-normal text-muted mb-3">
              Already have a account? &nbsp;
              <Link
                to="/login"
                className="text-primary fw-bold text-decoration-none"
              >
                Sign in
              </Link>
            </div>

            <div className="text-center text-muted text-uppercase mb-3">or</div>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="floatingFirstName"
                placeholder="name@example.com"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label htmlFor="floatingFirstName">Name</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="floatingInput"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="floatingInput">Email address</label>
            </div>

            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control"
                id="floatingPassword"
                placeholder="Password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="floatingPassword">Password</label>
              {/* <span className="password-info mt-2">
                Use 8 or more character with a mix of letters, numbers &
                symbols.
              </span> */}
            </div>

            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control"
                id="floatingConfirmPassword"
                placeholder="Password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <label htmlFor="floatingConfirmPassword">Confirm Password</label>
            </div>

            {/* <div className="col-12 d-flex align-items-center">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="gridCheck"
                />
                <label className="form-check-label ms-2" htmlFor="gridCheck">
                  I agree <a href="#"> Terms and conditions</a>
                </label>
              </div>
            </div> */}
            <button
              type="submit"
              className="btn btn-primary submit_btn w-100 my-4"
            >
              Register
            </button>
            {error && <p>{error}</p>}
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterForm;
