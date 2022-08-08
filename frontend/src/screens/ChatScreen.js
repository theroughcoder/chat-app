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
import { Badge, InputGroup } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { getError } from "../utils";


const socket = Socket();

export default function ChatScreen() {
  const messageRef = useRef();
  const [message, setMessage] = useState("");
  const [chatId, setChatId] = useState();
  const [friendInfo, setFriendInfo] = useState("");
  const [online, setOnline] = useState(false);
  const [msgInput, setMsgInput] = useState("");
  const [messages, setMessages] = useState([]);
  const { id } = useParams();
  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      const friend = await axios.get(`/api/users/${id}`)
      setFriendInfo(friend.data);
      const chat = await axios.get(`/api/chats/${userInfo._id}/${id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      if (chat.data) {
        setMessages([...chat.data.chats]);
        setChatId(chat.data._id);
      }
     
    };

    fetchData();
  }, [userInfo, id]);

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
    socket.emit('statusCheck', {
      friendId : id
    })
    socket.on('status', (data)=>{
      if(data.fid === id){
        setOnline(data.online)
      }
    })

    socket.on("chats", (messages) => {
      setMessages(messages);
    });
    socket.on("sendMessage", (data) => {
      setMessages([...messages, data]);
    });
    return () => {
      socket.off();
    };
  }, [messages, userInfo]);

  const inputHandler = async (e) => {
    e.preventDefault();
    setMsgInput("");
    setMessages([...messages, { msg: msgInput, name: userInfo.name }]);
  };
  const scrollHandler = async () => {
    const time = () => {
      messageRef.current.scrollIntoView(false);
    };
    setTimeout(time, 300);
  };

  const sendHandler = async (e) => {
    e.preventDefault();

    if (messages.length === 0) {
      try {
        const chat = await axios.post(
          `/api/chats`,
          {
            firstChatId: userInfo._id,
            secondChatId: id,
            msg: message,
            name: userInfo.name,
          },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        setChatId(chat.data._id);
      } catch (err) {
        toast.error(getError(err));
      }
    } else {
      try {
        await axios.put(
          `/api/chats`,
          {
            chatId: chatId,
            msg: message,
            name: userInfo.name,
          },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
      } catch (err) {
        toast.error(getError(err));
      }
    }

    setMessage("");
    socket.emit("message", {
      messageBody: { msg: message, name: userInfo.name },
      id,
    });
  }; 

  return (
    <div className="chatScreen">
      <Helmet>
        <title>Chat</title>
      </Helmet>
      <header className="list-header">
        <Nav>
          {" "}
          <Container className="user d-flex">
            <div className="friend-info me-auto d-flex ">
              <div style={{position: 'relative'}} >
              <div className="dp-header"><img style={{width: "100%"}} src=  {friendInfo.img}  alt="ProfileImage" /></div>
              
                <div className={online? "status": ""}></div>
              </div>
             
              <p className="name">{friendInfo.name}</p>
            </div>
          </Container>
        </Nav>
      </header>
      <Container className="chat-container small-container">
        <div ref={messageRef}>
          {messages.map((x, index) => {
            if (x.name === userInfo.name) {
              return (
                <Message key={index} cls={"msg-right"}>
                  {x.msg}
                </Message>
              );
            } else if (x.name === friendInfo.name) {
              return (
                <Message key={index} cls={"msg-left"}>
                  {x.msg}
                </Message>
              );
            }
          })}
        </div>
      </Container>
      <div style={{ height: "7.5ch" }}></div>

      <footer className="chat-footer  ">
        <Form
          onSubmit={(e) => {
            sendHandler(e);
            inputHandler(e);
          }}
          className="d-flex small-container container "
        >
          <FormControl
            value={msgInput}
            onClick={scrollHandler}
            onChange={(e) => {
              setMessage(e.target.value);
              setMsgInput(e.target.value);
            }}
            type="text"
            placeholder="Message..."
            className="me-2 chat-input"
            aria-label="Search"
            required
          />
          <Button type="submit" className="chat-sendbtn" variant="dark">
            <span className="material-symbols-outlined">send</span>
          </Button>
        </Form>
      </footer>
    </div>
  );
}
 