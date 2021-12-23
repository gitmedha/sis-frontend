import React from 'react'
import styled from "styled-components";
import image from '../../src/assets/images/image.png'

const Styled = styled.div`
img {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 60%;
}
h3{
    text-align: center;
    font-family:Lato;
}
.button {
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
}
`;
const PageNotFound = () => {
    return (
        <Styled>
            <div id="wrapper">
                <img src={image} />
                <div id="info">
                    <h3>The record/page you are looking for does not exist.  
                    <a href="/home" class="btn btn-primary"> Click Here </a> to go back, or return to the Dashboard.
                    </h3>
                </div>
            </div>
        </Styled>
    )
}

export default PageNotFound