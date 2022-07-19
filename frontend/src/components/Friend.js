import React from 'react'
import Container from 'react-bootstrap/esm/Container'

export default function Friend(props) {
  
  return (
    <Container className='friend container d-flex'>
        <div className= "friend-info me-auto d-flex ">
              <div className='dp'></div>
              <p className='friend-name'>{props.friend.name}</p>
        </div>
        
        
        <div  >
              <div className='status'></div>
        </div>
       
    </Container>
  )
}
