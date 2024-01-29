import React, { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";

const Chat = () => {
  const [uMessage, setUMessage] = useState([]);
  const [nMessage, setNMessage] = useState("");
  const [you, setYou] = useState("");
  const [frd, setFrd] = useState("");
  const divRef = useRef(null);

  const socket = useMemo(() => io("http://localhost:4000"), []);
  // socket.emit("userMessage", { from: "Sahil", message: "Hello" });

  useEffect(() => {
    setYou(prompt("Enter Name:"));

    socket.on("connect", () => {
      console.log("connect : ", socket.id);
    });

    socket.on("Data", (data) => {
      setUMessage((uMessage) => [...uMessage, data]);
      setFrd(data.name);
      // setYou(message)
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    divRef.current.scrollTop = divRef.current.scrollHeight;
  }, [uMessage]);

  const inputHandler = (e) => {
    setNMessage(e.target.value);
  };

  const submitHandler = (e) => {
    try {
      e.preventDefault();

      if (nMessage.length > 0) {
        
        socket.emit("NewMessage", { name: you, message: nMessage });
        setUMessage((uMessage) => [
          ...uMessage,
          { name: you, message: nMessage },
        ]);
        setNMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="my-8 mx-auto max-w-4xl">
        <div className="m-4 border border-purple-800 rounded-lg overflow-hidden">
          <div className="p-4 w-full bg-purple-800">
            {frd ? frd : "Unknown"}
          </div>
          <div
            ref={divRef}
            className="p-4 w-full h-[70vh] flex flex-col gap-2 overflow-y-auto"
          >
            {uMessage &&
              uMessage.map((msg, i) => (
                <>
                  {msg.name === you && (
                    <div key={i} className="ml-auto max-w-[50%]">
                      <p className="text-xs text-right">{msg.name}</p>
                      <div className="py-2 px-4 bg-gray-500 min-w-8 w-fit gap-2 rounded-lg">
                        <p className="">{msg.message}</p>
                      </div>
                    </div>
                  )}
                  {msg.name !== you && (
                    <div key={i} className="max-w-[50%]">
                      <p className="text-xs">{msg.name}</p>
                      <div className="py-2 px-4 bg-gray-500 min-w-8 w-fit gap-2 text-center rounded-lg">
                        <p className="">{msg.message}</p>
                      </div>
                    </div>
                  )}
                </>
              ))}
          </div>
          <form onSubmit={submitHandler} className="w-full rounded-lg">
            <input
              className="p-4 outline-none w-full text-black"
              type="text"
              value={nMessage}
              placeholder="Message..."
              onChange={inputHandler}
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default Chat;
