import React, { useContext, useEffect, useReducer, useState } from "react";

import Container from "react-bootstrap/Container";
import Friend from "../components/Friend";
import { Store } from "../Store";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getError } from "../utils";
import MessageBox from "../components/MessageBox";
import LoadingBox from "../components/LoadingBox";
import { Socket } from "../Socket";
import { Button, Form, FormControl, InputGroup } from "react-bootstrap";
import { Helmet } from "react-helmet-async";

const socket = Socket();

export default function ListScreen() {
  const [friend, setFriend] = useState("");
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
    friends: [],
    loading: false,
    error: "",
  });

  useEffect(() => {
    socket.emit("onLogin", {
      _id: userInfo._id,
      name: userInfo.name,
      isAdmin: userInfo.isAdmin,
    });
  }, [userInfo]);

  const findFriendHandle = async (e) => {
    e.preventDefault();

    dispatch({ type: "FETCH_REQUEST" });
    try {
      const { data } = await axios.get(`/api/users/search?friend=${friend}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch (err) {
      dispatch({ type: "FETCH_FAIL", payload: getError(err) });
    }
  };

  return (
    <div className="listScreen">
      <Helmet>
        <title>Find Friend</title>
      </Helmet>
      <header className="list-header">
        <Form
          onSubmit={findFriendHandle}
          style={{ marginTop: "15px" }}
          className="d-flex me-auto small-container container"
        >
          <InputGroup>
            <FormControl
              type="text"
              name="q"
              id="q"
              onChange={(e) => {
                setFriend(e.target.value);
              }}
              placeholder="Find your friend..."
              aria-label="Search Products"
            ></FormControl>
            <Button type="submit" variant="danger outline-primary">
              Search
            </Button>
          </InputGroup>
        </Form>
      </header>
      <Container className=" small-container list-container">
        {friends.length === 0 ? (
          <MessageBox variant="dark">Find Friend</MessageBox>
        ) : loading ? (
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
                  navigate(`/chat/${friend._id}`);
                }}
              >
                <Friend name={friend.name} img={friend.img}/>
              </div>
            ))
        )}
      </Container>
    </div>
  );
}
