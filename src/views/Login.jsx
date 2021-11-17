import styled from "styled-components";
import { urlPath } from "../constants";

const Styled = styled.div`
  .content-wrapper {
    height: 100vh;

    >div {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding-bottom: 120px;
      border:7px solid red;
    }
  }

  .logo {
  padding: 5px;
  width: 108px;
  height: 121px;
  margin-left: -30px;
 }
  .image {
    border:2px solid green;
    max-width: 100%;
    height: 103%;
    margin: 0px 0px 0px 111px;
  }

  .app-name, p {
    color: black;
    font-family: 'Bebas Neue Book';
    font-size: 50px;
    line-height: 1.25;
    margin: 75px 39px 21px -19px;
  }

  .btn-ms-login {
    border: 1px solid #C4C4C4;
    box-sizing: border-box;
    border-radius: 40px;
    padding: 20px 45px;
    color: #787B96;
    font-family: 'Lato Regular';
    text-decoration: none;
    position: absolute;
    left:   80px;
    bottom:   5px;
    img {
      width: 30px;
      margin-right: 20px;
    }
  }
`;

const Login = () => {

  return (
    <Styled>
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <img
                src={require('../assets/images/logo.png').default}
                alt="Medha SIS"
                className='logo'
            />
            <p className="app-name">STUDENT <br/> INFORMATION <br/> SYSTEM</p>
            <a type="button" href={urlPath('/connect/microsoft')} className="btn-ms-login d-flex">
              <img
                src={require('../assets/images/logo-microsoft.svg').default}
                alt="Microsoft"
                className={`mr-5`}
              />
              <span>Login using Microsoft account</span>
            </a>
          </div>
          <div className="col-md-8">
            <img
             src={require('../assets/images/web-image.png').default}
             alt="Medha SIS"
             className='image'
            />
          </div> 
        </div>
      </div>
    </Styled>
  );
};

export default Login;
