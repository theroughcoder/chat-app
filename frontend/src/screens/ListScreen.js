import React, { useContext, useEffect, useReducer, useState } from "react";

import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Friend from "../components/Friend";
import { Store } from "../Store";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getError } from "../utils";
import MessageBox from "../components/MessageBox";
import LoadingBox from "../components/LoadingBox";
import { Socket } from "../Socket";
import { Helmet } from "react-helmet-async";
const socket = Socket();

export default function ListScreen() {
  const [messages, setMessages] = useState();
  const [users, setUsers] = useState([]);
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

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const friendsList = await axios.get(
          `/api/chats/friends/${userInfo._id}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        const users = await axios.get(`/api/users`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const updatedFriendsList = [];
        friendsList.data.forEach((friend) => {
          const fid =
            friend.firstChat.id === userInfo._id
              ? friend.secondChat.id
              : friend.firstChat.id;
          let friendInfo = users.data.find((user) => user._id === fid);
          if (friendInfo) {
            updatedFriendsList.push({
              _id: friendInfo._id,
              name: friendInfo.name,
              img: friendInfo.img,
            });
          }
        });
        // result.data.sort(function (b, a) {
        //   return a.lastUpdate - b.lastUpdate;
        // });

        dispatch({ type: "FETCH_SUCCESS", payload: updatedFriendsList });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();

    socket.on("connect", () => {
      console.log("frontend is connected with the backend");
    });
    socket.on("sendMessage", (data) => {
      setMessages([data]);
    });
    socket.emit("onLogin", {
      _id: userInfo._id,
      name: userInfo.name,
      isAdmin: userInfo.isAdmin,
    });
  }, [userInfo, messages]);

  return (
    <div className="listScreen">
      <Helmet>
        <title>Friends list</title>
      </Helmet>
      <header className="list-header">
        <Nav>
          {" "}
          <Container className="user container d-flex">
            <div className="friend-info me-auto d-flex ">
              <div className="dp-header">
                <img
                  style={{ width: "100%" }}
                  src={userInfo ? userInfo.img : "/images/profile.jpg"}
                  alt="ProfileImage"
                />
              </div>
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
      <Container className="list-container small-container">
        {loading ? (
          <div className="loading">
            <LoadingBox />
          </div>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          friends.map((friend, index) => {
            return (
              <div
                key={index}
                onClick={() => {
                  navigate(`/chat/${friend._id}`);
                }}
              >
                <Friend name={friend.name} img={friend.img} />
              </div>
            );
          })
        )}
      </Container>
      <div className="findFriendIcon">
        <span
          type="button"
          onClick={() => {
            navigate("/findfriend");
          }}
          className="material-symbols-outlined"
        >
          person_add
        </span>
      </div>
    </div>
  );
}
