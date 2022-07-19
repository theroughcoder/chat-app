// import { useEffect, useReducer, useState } from "react";

// import { createContext } from "react";
import socketIO from "socket.io-client";

const ENDPOINT = "http://192.168.1.36:5000";

// export const Sk= createContext();

// export function SocketProvider(props) {

//     const sk = socketIO(ENDPOINT, { transports: ["websocket"] });
//     console.log(sk);

//   return <Sk.Provider value={{sk}}>{props.children}</Sk.Provider>;
// }

export function Socket() {
  const sk = socketIO(ENDPOINT, { transports: ["websocket"] });

  return sk;
}
