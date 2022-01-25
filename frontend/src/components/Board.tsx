import React, { useState } from "react";
//import { useSubscription, useStompClient } from "react-stomp-hooks";
import { Chessboard } from "react-chessboard";
import { useSubscription, useStompClient } from "react-stomp-hooks";
const ChessReq: any = require("chess.js");

const Board = (props: {
  color: "white" | "black";
  sender: string;
  rival: string;
  roomCode: string;
}) => {
  const [game, setGame] = useState(new ChessReq());
  const [turn, setTurn] = useState<boolean>(props.color === "white");

  const stompClient = useStompClient();

  const sendMove = (sourceAndTargetSquares: string[]) => {
    stompClient?.publish({
      destination: `/app/chat/move/${props.roomCode}`,
      body: JSON.stringify({ sourceAndTargetSquares }),
    });
    return true;
  };

  function safeGameMutate(game: any) {
    setGame((g: any) => {
      const update = { ...g };
      game(update);
      return update;
    });
  }
  function onDrop(sourceSquare: string, targetSquare: string) {
    if (!turn) return false;
    sendMove([sourceSquare, targetSquare]);
    return true;
  }

  useSubscription(`/topic/move/${props.roomCode}`, (message) => {
    console.log("move");
    console.log(JSON.parse(message.body));
    const [sourceSquare, targetSquare] = JSON.parse(
      message.body
    ).sourceAndTargetSquares;
    safeGameMutate((game: any) => {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
      });
      move && setTurn(!turn);
    });
  });
  return (
    <div className="vh-100">
      <h1 className="d-flex justify-content-md-center align-items-center display-5">
        Room Code: {props.roomCode}
      </h1>
      <div className="d-flex justify-content-center align-items-center">
        {props.rival}
      </div>

      <div className="d-flex justify-content-center">
        <Chessboard
          position={game?.fen()}
          boardWidth={500}
          showBoardNotation={true}
          onPieceDrop={onDrop}
          boardOrientation={props.color}
        />
      </div>
      <div className="d-flex justify-content-center align-items-center">
        {props.sender}
      </div>
    </div>
  );
};
export default Board;
