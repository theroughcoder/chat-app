import React, { useContext } from 'react'
import Container from 'react-bootstrap/esm/Container'
import { Store } from '../Store';

export default function Friend(props) {

  return (
    <Container className='friend container d-flex'>
        <div className= "friend-info me-auto d-flex ">
              <div className='dp'></div>
              <p className='friend-name'>{props.name}</p>
        </div>
        
        
        
       
    </Container>
  )
}
