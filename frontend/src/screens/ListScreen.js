import React, { useContext, useEffect, useReducer, useState } from "react";
// import Row from "react-bootstrap/Row";
// import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
// import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Friend from "../components/Friend";
import { Store } from "../Store";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getError } from "../utils";
import MessageBox from "../components/MessageBox";
import LoadingBox from "../components/LoadingBox";
// import { Sk } from "../Socket";
import { Socket } from "../Socket";

const socket = Socket();

export default function ListScreen() {
  const [messages, setMessages] = useState(); 
  const navigate = useNavigate();
  const { state } = useContext(Store);

  const { userInfo } = state;

  const reducer = (state, action) => {
    switch (action.type) {
      case "FETCH_REQUEST":
        return { ...state, loading: true };
      case "FETCH_SUCCESS":
        return { ...state, friends: action.payload, loading: false };
      case "FETCH_FAIL":
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };

  const [{ loading, error, friends }, dispatch] = useReducer(reducer, {
    friends: [{}],
    loading: true,
    error: "",
  });
  // const [products, setProducts] = useState([]);

  useEffect(() => { 
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get(`/api/users/friend/${userInfo._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
 
      // setProducts(result.data);
    };
    fetchData();

    //   console.log( sk)
    //   setSocket(sk);
    //   ctxDispatch({type:"SOCKET", payload: sk})
    socket.on("connect", () => {
      console.log("frontend is connected with the backend");
    }); 
    socket.on("sendMessage", (data) => {
      setMessages([ data]);
    });

    socket.emit("onLogin", {
      _id: userInfo._id,
      name: userInfo.name,
      isAdmin: userInfo.isAdmin,
    });
  }, [userInfo, messages]);

  return (
    <div className="listScreen">
      <header className="list-header">
        <Nav>
          {" "}
          <Container className="user container d-flex">
            <div className="friend-info me-auto d-flex ">
              <div className="dp"></div>
              <p className="name">{userInfo ? userInfo.name : "no user"}</p>
            </div>

            <div>
              <div>
                <span
                  type="button"
                  onClick={() => {
                    navigate("/profile");
                  }}
                  className="profile material-symbols-outlined"
                >
                  person_filled{" "}
                </span>
              </div>
            </div>
          </Container>
        </Nav>
      </header>
      <Container style={{ marginTop: "100px" }} className=" small-container">
        {loading ? (
          <div className="loading">
            <LoadingBox />
          </div>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          friends
            .filter((friend) => friend._id !== userInfo._id)
            .map((friend, index) => (
              <div
                key={index}
                onClick={() => {
                  navigate(`/chat/${friend.friend_id}/${friend.name}`);
                }}
              >
                <Friend friend={friend} />
              </div>
            ))
        )}
      </Container>
      <div className="findFriendIcon">
        <span type="button"
                  onClick={() => {
                    navigate("/findfriend");
                  }} class="material-symbols-outlined">person_add</span>
      </div>
    </div>
  );
}
