import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import { useCookies } from "react-cookie";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import api from "../api";
import { useForm } from "react-hook-form";

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
export const HomePage = () => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "accessToken",
    "refreshToken",
    "userId",
  ]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [user, setUser] = useState<User>();
  const history = useHistory();

  useEffect(() => {
    const getUser = async () => {
      let accessToken = await cookies.accessToken;
      if (!accessToken) {
        await api.refreshToken();
        accessToken = await cookies.accessToken;
      }

      if (!accessToken) {
        history.push("/login");
      } else {
        const connectedUser = await api.validate();
        setUser(connectedUser);
      }
    };
    getUser();
  }, [cookies.accessToken, cookies.refreshToken, cookies.userId, history]);

  const logOut = () => {
    removeCookie("accessToken");
    removeCookie("refreshToken");
    removeCookie("userId");
    history.push({ pathname: "/login" });
  };

  const submitRoomCode = ({ roomCode }: any) => {
    history.push({
      pathname: "/game",
      state: { roomCode, sender: user },
    });
  };

  if (!user) {
    return (
      <div className="d-flex justify-content-md-center align-items-center vh-100">
        <Loader type="CradleLoader" height={300} width={300} />
      </div>
    );
  }
  return (
    <div>
      <h1 className="d-flex justify-content-md-center align-items-center my-5 display-1">
        {`Hello ${user?.firstName} ${user?.lastName}`} !
      </h1>
      <div className="d-flex justify-content-center m-5">
        <form onSubmit={handleSubmit(submitRoomCode)}>
          <div className="input-group">
            <div className="form-control">
              <input
                type="roomCode"
                className="form-control"
                id="exampleInputRoomCode"
                placeholder="Enter Room Code"
                {...register("roomCode", {
                  required: "required",
                })}
              />
              {errors?.roomCode && (
                <p className="form-text text-danger">
                  {errors.roomCode.message}
                </p>
              )}
            </div>

            <div className="input-group-text">
              <button type="submit" className="btn btn-warning">
                OK
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className="d-flex justify-content-center m-5">
        <button className="btn btn-success" onClick={logOut}>
          Log Out
        </button>
      </div>
    </div>
  );
};
export default HomePage;
