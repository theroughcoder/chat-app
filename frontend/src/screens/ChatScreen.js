import Container from "react-bootstrap/esm/Container";
import Nav from "react-bootstrap/esm/Nav";
import Form from "react-bootstrap/esm/Form";

import React, { useContext, useEffect, useState, useRef } from "react";
import Button from "react-bootstrap/esm/Button";
import FormControl from "react-bootstrap/esm/FormControl";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { Store } from "../Store";
import Message from "../components/Message";

import { Socket } from "../Socket";
import { InputGroup } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { getError } from "../utils";

const socket = Socket();

export default function ChatScreen() {
  const messageRef = useRef();
  const [message, setMessage] = useState("");
  const [chatId, setChatId] = useState();
  const [messages, setMessages] = useState([]);
  const { id, name } = useParams();
  const { state } = useContext(Store);
  const { userInfo } = state;



useEffect(() => {


    const fetchData = async () => {

        const {data} = await axios.get(`/api/users/friend/${userInfo._id}/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }); 
        setChatId(data.chat_id);
        if(data){
          const chat = await axios.get(`/api/chats/${data.chat_id}`, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          });
          setMessages([ ...chat.data])
          
        }

    };
    fetchData();

},[userInfo, id]);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }

    socket.emit("onLogin", {
      _id: userInfo._id,
      name: userInfo.name,
      isAdmin: userInfo.isAdmin,
    });
  

   
    socket.on("sendMessage", (data) => {
      setMessages([...messages, data]);
    });
    return () => {
      socket.off();
    };
  }, [messages, userInfo]);

  const sendHandler = async(e) => {
    e.preventDefault();
  
    if(messages.length === 0){
try{ 
      const chat = await axios.post(`/api/chats`,{
        msg: message, name: userInfo.name
      }, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      } );

       await axios.put(`/api/users/${userInfo._id}`,{
        friend_id: id,
        chat_id: chat.data._id,
        name: name,
      } ,{
        headers: { Authorization: `Bearer ${userInfo.token}` },
      } ); 
       await axios.put(`/api/users/${id}`,{
        friend_id: userInfo._id,
        chat_id: chat.data._id,
        name: userInfo.name
      }, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      } );
    }catch(err){
      toast.error(getError(err))
  }
    }else{
      try{
       await axios.put(`/api/chats/${chatId}`,{
        msg: message, name: userInfo.name
      }, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      } );

      await axios.get(`/api/users/${userInfo._id}/${id}` ,{
        headers: { Authorization: `Bearer ${userInfo.token}` },
      } ); 

       await axios.get(`/api/users/${id}/${userInfo._id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      } );
    }catch(err){
      toast.error(getError(err))
  }

    }

    setMessage("");
    socket.emit("message", {
      messageBody: { msg: message, name: userInfo.name },
      id,
    });
    setMessages([...messages, { msg: message, name: userInfo.name }]);
  };

  return (
    <div className="listScreen">
      <Helmet>
        <title>Chat</title>
      </Helmet>
      <header className="list-header">
        <Nav>
          {" "}
          <Container className="user d-flex">
            <div className="friend-info me-auto d-flex ">
              <div className="dp-header"></div>
              <p className="name">{name}</p>
            </div>

            <div>
              <div className="status"></div>
            </div>
          </Container>
        </Nav>
      </header>
      <Container
        
        style={{ marginTop: "8ch" }}
        className="chat-container small-container"
      >
        <div ref={messageRef}>
          {messages.map((x, index) => {
            if (x.name === userInfo.name) {
              return (
                <Message key={index} cls={"msg-right"}>
                  {x.msg}
                </Message>
              );
            } else {
              return (
                <Message key={index} cls={"msg-left"}>
                  {x.msg}
                </Message>
              );
            }
          })}
        </div>
      </Container>
      <footer className="list-footer ">
        <Form onSubmit={sendHandler} className="d-flex small-container ">
        <InputGroup>

          <FormControl
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            type="search"
            placeholder="Message..."
            className="me-2"
            aria-label="Search"
            required
          />
          <Button type="submit" variant="outline-light">
            Send
          </Button>
        </InputGroup>

        </Form>
      </footer>
    </div>
  );
}
