import React, { useState } from "react";
import { useForm } from "react-hook-form";
import api from "../api";
import { useHistory, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-regular-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
library.add(faUserCircle);

const Register = () => {
  const [hidePassword, setHidePassword] = useState<boolean>(true);

  const history = useHistory();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (registerData: {
    email: string;
    password: string;
    firstname: string;
    lastName: string;
  }) => {
    await api.register(registerData);
    history.push("/");
  };

  return (
    <div className="card w-25 mx-auto m-3 shadow-lg">
      <FontAwesomeIcon
        icon={["far", "user-circle"]}
        size="9x"
        className="mx-auto mt-4"
      />
      <h1 className="m-auto text mb-4">Register</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input-group m-auto">
          <span className="input-group-text">Name</span>
          <input
            type="text"
            aria-label="First name"
            className="form-control"
            placeholder="First name"
            {...register("firstName", {
              required: "required",
              minLength: {
                value: 3,
                message: "Must containt at list 3 character",
              },
            })}
          />

          <input
            type="text"
            aria-label="Last name"
            className="form-control"
            placeholder="Last name"
            {...register("lastName", {
              required: "required",
              minLength: {
                value: 3,
                message: "Must containt at list 3 character",
              },
            })}
          />
        </div>
        <div className="container">
          <div className="row">
            {errors?.lastName && (
              <p className="form-text col-6 text-end text-danger">
                {errors.lastName.message}
              </p>
            )}
            {errors?.firstName && (
              <p className="form-text col-6 text-center text-danger">
                {errors.firstName.message}
              </p>
            )}
          </div>
        </div>
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
                onClick={() => setHidePassword(!hidePassword)}
                color="white"
              />
            </div>
          </div>
          {errors?.password && (
            <p className="form-text text-danger"> {errors.password.message} </p>
          )}
        </div>
        <div className="d-flex justify-content-center my-2">
          <button type="submit" className="btn btn-secondary">
            Register
          </button>
        </div>
      </form>
      <div className="d-flex justify-content-center my-3">
        Already have an account?
        <Link to="/login" style={{ textDecoration: "none", color: "gray" }}>
          Login
        </Link>
      </div>
    </div>
  );
};

export default Register;
