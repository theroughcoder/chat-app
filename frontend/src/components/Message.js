import React from "react";

export default function Message(props) {
  return (
    <div className= "msg" >
      <div className={` ${props.cls}`}>
      {props.children}
      </div>
    </div>
  );
}
