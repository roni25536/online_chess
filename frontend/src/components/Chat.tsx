import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useSubscription, useStompClient } from "react-stomp-hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentAlt } from "@fortawesome/free-regular-svg-icons";

const Chat = (props: { sender: string; roomCode: string }) => {
  const [messages, setMessages] = useState<Array<string>>([]);
  const messagesEndRef = useRef<any>(null);
  const [chat, setChat] = useState<boolean>(false);
  const stompClient = useStompClient();
  const { register, handleSubmit, reset } = useForm();

  useSubscription(`/topic/${props.roomCode}`, (message) => {
    setMessages([...messages, JSON.parse(message.body)]);
  });

  const sendMessage = (data?: any) => {
    stompClient?.publish({
      destination: `/app/chat/${props.roomCode}`,
      body: JSON.stringify({ content: data?.message, sender: props.sender }),
    });
    reset();
  };

  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    };
    chat && scrollToBottom();
  }, [messages, chat]);

  return (
    <div className={`position-absolute bottom-0 end-0 ${chat ? "m-5" : "m-4"}`}>
      <div
        className="bg-light rounded"
        style={{
          overflow: "auto",
          height: `${chat ? "70vh" : "0vh"}`,
          width: `${chat ? "45vh" : "0vh"}`,
          visibility: `${chat ? "visible" : "hidden"}`,
          transition: "visibility 0.25s, width 0.5s, height 0.25s linear",
        }}
      >
        <div
          className={
            "position-absolute rounded-top bg-primary w-100 p-2 text-white"
          }
        >
          <div
            className={"text-end"}
            style={{ cursor: "pointer" }}
            onClick={() => setChat(!chat)}
          >
            X
          </div>
        </div>
        <div ref={messagesEndRef}>
          <div className="vh-100"></div>
          {messages?.map((msg: any) => (
            <div
              className={`text-break d-flex ${
                msg.sender === props.sender ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                style={{
                  maxWidth: "50%",
                  borderRadius: `${
                    msg.sender === props.sender ? "30rem 0rem" : "0rem 30rem"
                  } 30rem 30rem`,
                }}
                className={`text-white p-2 m-1 ${
                  msg.sender === props.sender ? "bg-primary" : "bg-success"
                }`}
              >
                {msg.content || msg.sender}
              </div>
            </div>
          ))}
          <form
            className="well form-inline"
            onSubmit={handleSubmit(sendMessage)}
          >
            <div className="input-group">
              <input
                {...register("message", { required: true })}
                className="form-control"
                type="text"
                placeholder="Type something..."
              />
              <div className="input-group-append">
                <button className="btn btn-primary" type={"submit"}>
                  Send
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {!chat && (
        <p
          className="rounded-circle bg-primary p-3"
          onClick={() => setChat(!chat)}
        >
          <FontAwesomeIcon icon={faCommentAlt} size="2x" color="white" />
        </p>
      )}
    </div>
  );
};

export default Chat;
