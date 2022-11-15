import React from 'react'
import styled from 'styled-components';
import Logo from './Logo/logo';
import * as moment from 'moment';

const Foot = styled.footer`
  z-index:9;
  display: flex;
  justify-content: space-evenly;
  color:  #4E5166;
  font-weight: 800;
  margin-top: 1rem;
  border-radius:5px;
  background-color:  #FFD7D7;
  bottom: 0;
  left: 0;
  width: 100%;
  position:fixed;
  height:70px;

  @media only screen and (max-width: 768px){
    height: 50px;
    position:fixed;
  }
  @media only screen and (max-width: 420px){
    align-items: center;
    margin:0;
    height: 60px;
  }
  
`

const Date = styled.p`
 font-size:20px;
  @media only screen and (max-width: 768px){
  font-size:15px;
  }
  @media only screen and (max-width: 420px){
  display: none;
  }

`

function Footer() {

  return (
    <>
      <Foot>
        <Date>{moment().format("dddd Do MMM YYYY, HH:mm ")}</Date>
        <Logo />
      </Foot>
    </>
  );
}

export default Footer;