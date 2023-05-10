import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import Image from "../../images/register.jpg";
import "bootstrap/dist/css/bootstrap.min.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: email,
          password: password,
        }
      );
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        // Redirect to home page on successful login
        navigate("/dashboard");
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  return (
    <>
      <div className="login__header">
        <div className="logo">
          <p>
            One <span>Cloud.</span>
          </p>
        </div>
      </div>
      <div className="login__content">
        <div className="login__image">
          <img src={Image} alt="" />
        </div>
        <div className="login__formpage">
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
            <h3 className="text-dark fw-bolder fs-4 mb-2">
              Login to your Account
            </h3>
            <div className="fw-normal text-muted mb-3">
              Don't have an account? &nbsp;
              <Link
                to="/register"
                className="text-primary fw-bold text-decoration-none"
              >
                Register
              </Link>
            </div>

            <div className="text-center text-muted text-uppercase mb-3">or</div>
            {/* <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="floatingFirstName"
                placeholder="name@example.com"
              />
              <label htmlFor="floatingFirstName">Name</label>
            </div> */}
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
              Login
            </button>
            {error && <p>{error}</p>}
          </form>
        </div>
      </div>
      <div>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
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
          {error && <p>{error}</p>}
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account? <Link to="/register">Register here.</Link>
        </p>
      </div>
    </>
  );
};

export default LoginForm;
