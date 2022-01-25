import React from "react";
import { StompSessionProvider } from "react-stomp-hooks";

import GamePage from "./GamePage";
const server = "http://localhost:8080";
const Game = () => {
  return (
    <StompSessionProvider url={`${server}/chat`}>
      <GamePage />
    </StompSessionProvider>
  );
};

export default Game;
