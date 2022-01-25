import React, { useState, useEffect } from "react";
import Loader from "react-loader-spinner";
import Chat from "./Chat";
import { useLocation } from "react-router-dom";
import Board from "./Board";
import { useSubscription, useStompClient } from "react-stomp-hooks";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import { User } from "./HomePage";

const GamePage = () => {
  const location: any = useLocation();
  const stompClient = useStompClient();
  const [color, setColor] = useState<"white" | "black">("black");
  const [rival, setRival] = useState<string | null>();
  const history = useHistory();
  const roomCode = location?.state?.roomCode;
  const user: User = location?.state?.sender;

  const roomIsFull = () => {
    if (rival) return;
    Swal.fire({
      title: "oops...",
      text: `Room: ${roomCode} Is Full`,
      icon: "warning",
    });
    history.push("/");
  };

  // useSubscription(`/topic/counter/${roomCode}`, (message) => {
  //   console.log("message", message);
  //   const connectedPlayers = parseInt(JSON.parse(message.body));
  //   console.log("connectedPlayers", connectedPlayers);
  //   connectedPlayers === 3 ? roomIsFull() : setGameStarted(connectedPlayers);
  //   console.log(gameStarted);
  // });

  // useSubscription(`/topic/clear/${roomCode}`, (message) => {
  //   console.log("clear", message);
  //   history.push("/");
  // });
  stompClient?.configure({
    onConnect: () => {
      stompClient.subscribe(`/topic/counter/${roomCode}`, (message) => {
        if (rival) return;
        const connectedPlayers: string[] = JSON.parse(message.body).map(
          (user: string) => JSON.parse(user).email
        );
        if (connectedPlayers.length === 1) {
          setColor("white");
          return;
        }
        if (!connectedPlayers.some((email: any) => email === user.email)) {
          roomIsFull();
          return;
        }
        setRival(connectedPlayers.find((email: any) => email !== user.email));
        stompClient.unsubscribe(`/topic/counter/${roomCode}`);
      });

      stompClient.subscribe(`/topic/clear/${roomCode}`, (message) => {
        JSON.parse(message.body) && history.push("/");
      });

      stompClient.publish({
        destination: `/app/chat/counter/${roomCode}`,
        body: JSON.stringify({ email: user.email }),
      });
    },
    onChangeState: (state) => {
      console.log(state);

      state === 1 &&
        rival &&
        stompClient?.publish({
          destination: `/app/chat/clear/${roomCode}`,
        });
    },
  });

  if (!rival) {
    return (
      <div className="d-flex justify-content-md-center align-items-center vh-100">
        <div className="row">
          <div className="col">
            <Loader type="CradleLoader" height={300} width={300} />
          </div>
          <button
            className="btn btn-secondary"
            onClick={() => history.push("/")}
          >
            Exit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="vh-100 overflow-hidden d-flex justify-content-center align-items-center">
      <Board
        color={color}
        roomCode={roomCode}
        sender={user.email}
        rival={rival}
      />
      <Chat roomCode={roomCode} sender={user.email} />
    </div>
  );
};

export default GamePage;
