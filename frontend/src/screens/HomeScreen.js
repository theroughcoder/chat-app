import React, { useContext, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { Store } from "../Store";

export default function HomeScreen() {
  const {state} = useContext(Store);
  const{userInfo} = state;
  const navigate = useNavigate();
  
useEffect(()=>{
  if(userInfo){
    navigate('/list');
  }
},[userInfo])


  return (
    <div className="homeScreen">
      <div className="container small-container">
        <Row>
          <Col>
            <h1 className="heading">Chat Notebook</h1>
          </Col>
        </Row>
        <Row style={{ marginTop: "60px" }}>
          <Col>
            {" "}
            <Button
              onClick={() => {
                navigate("/signin");
              }}
              className="home-btn"
              variant="light"
            >
              Sign In
            </Button>{" "}
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              onClick={() => {
                navigate("/signup");
              }}
              className="home-btn"
              variant="dark"
            >
              Sign Up
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
}
