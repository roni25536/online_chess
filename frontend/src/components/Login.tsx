import React, { useState } from "react";
import { useForm } from "react-hook-form";
import api from "../api";
import { useHistory, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faEye,
  faEyeSlash,
  faHandRock,
} from "@fortawesome/free-regular-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
library.add(faUserCircle);
library.add(faEye);
library.add(faEyeSlash);
library.add(faHandRock);

const Login = () => {
  const [hidePassword, setHidePassword] = useState<boolean>(true);
  const history = useHistory();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (loginData: { email: string; password: string }) => {
    await api.login(loginData);
    history.push("/");
  };

  return (
    <div className="card w-25 h-25 mx-auto mt-3 my-2 shadow-lg">
      <FontAwesomeIcon
        icon={["far", "user-circle"]}
        size="9x"
        className="mx-auto mt-5"
      />

      <h1 className="m-auto text mb-1">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="card-body">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            placeholder="Email"
            aria-describedby="emailHelp"
            {...register("email", {
              required: "required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Must be a valid email",
              },
            })}
          />
          {errors?.email && (
            <p className="form-text text-danger"> {errors.email.message} </p>
          )}
        </div>
        <div className="card-body">
          <label htmlFor="exampleInputPassword1">Password</label>
          <div className="input-group">
            <input
              type={hidePassword ? "password" : "text"}
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Password"
              {...register("password", {
                required: "required",
                pattern: {
                  value:
                    /^(?=.*?[A-Z])(?=.*?\d)(?=.*?[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/g,
                  message:
                    "the password must contain capital letter, number, and special character",
                },
              })}
            />
            <div className="input-group-text bg-secondary">
              <FontAwesomeIcon
                icon={hidePassword ? ["far", "eye-slash"] : ["far", "eye"]}
                color="white"
                onClick={() => setHidePassword(!hidePassword)}
              />
            </div>
          </div>
          {errors?.password && (
            <p className="form-text text-danger"> {errors.password.message} </p>
          )}
        </div>
        <div className="d-flex justify-content-center my-2">
          <button type="submit" className="btn btn-secondary">
            Submit
          </button>
        </div>
      </form>
      <div className="d-flex justify-content-center my-3">
        Don't have an account?
        <Link to="/register" style={{ textDecoration: "none", color: "gray" }}>
          Register
        </Link>
      </div>
    </div>
  );
};

export default Login;
