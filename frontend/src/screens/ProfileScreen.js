import axios from "axios";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Store } from "../Store";
import { getError } from "../utils";
import { Socket } from "../Socket";
const socket = Socket();



const reducer = (state, action) => {
  switch (action.type) {
  
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false   };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };

    default:
      return state;
  }
};

export default function ProfileScreen() {


  const [{ error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {userInfo} = state;
  const [name, setName] = useState(userInfo.name);
  const [image, setImage] = useState(userInfo.img);
  const [password, setPassword] = useState('');
  const [cpassword, setCPassword] = useState('');

  useEffect(()=>{
    socket.emit("onLogin", {
      _id: userInfo._id,
      name: userInfo.name,
      isAdmin: userInfo.isAdmin,
    }); 

    if(!userInfo){
      navigate('/')
    }
 
  },[userInfo])
  
  const signOutHandler = ()=>{
    socket.emit("logout");
 ctxDispatch({type: "USER_SIGNOUT" })
 navigate('/')
};
const submitHandler = async (e) => {
  e.preventDefault();
  try { 
    dispatch({ type: 'UPDATE_REQUEST' });
    const{data} = await axios.put(
      `/api/users/profileupdate`,
      { _id: userInfo._id, name, email: userInfo.email, password, cpassword, img: image },
      {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      }
    ); 
    dispatch({
      type: 'UPDATE_SUCCESS', payload: data
    });
    ctxDispatch({type:'USER_PROFILE_UPDATE', payload: data})
    toast.success('User updated successfully');
    
  } catch (error) {
    toast.error(getError(error));
    dispatch({ type: 'UPDATE_FAIL' });
  }
};
const uploadFileHandler = async (e, forImages) => {
  const file = e.target.files[0];
  const bodyFormData = new FormData();
  bodyFormData.append('file', file);
  try {
    dispatch({ type: 'UPLOAD_REQUEST' });
    const { data } = await axios.post('/api/upload', bodyFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        authorization: `Bearer ${userInfo.token}`,
      },
    });

      setImage(data.secure_url);
   
    toast.success('Image uploaded successfully. click Update to apply it');
  } catch (err) {
    toast.error(getError(err));
  }
};

  return (
    <div className="profile-container">
      <Helmet>
        <title>Profile</title>
      </Helmet>
      <div style={{padding: '2ch'}} className="sign-out d-flex flex-row-reverse bd-highlight">
        <Button  onClick={signOutHandler} className="" variant="dark">
          Sign out
        </Button>
      </div>

      <Container style={{ marginTop: "-20px" }} className=" small-container">
        <div>
          <div className="profile-img" > <img style={{width: "100%"}} src= {image}  alt="Trull" /> </div>
        </div>
        <h1 className="my-3">{userInfo ? userInfo.name : "no user"}</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Username</Form.Label>
            <Form.Control value={name} onChange={(e)=>{setName(e.target.value)}} type="text" required></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="imageFile">
            <Form.Label>Upload Image</Form.Label>
            <Form.Control  type="file" onChange={uploadFileHandler} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control value={password} onChange={(e)=>{setPassword(e.target.value)}} type="text" required></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control value={cpassword} onChange={(e)=>{setCPassword(e.target.value)}} type="text" required></Form.Control>
          </Form.Group>

          <div className="md-3">
            <Button variant="dark" type="submit">
              Update
            </Button>
          </div>
        </Form>
      </Container>
    </div>
  );
}
