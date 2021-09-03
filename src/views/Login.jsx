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
    }
  }

  .logo {
    max-width: 100%;
  }

  .app-name {
    color: #207B69;
    font-family: 'Latto-Bold';
    font-size: 20px;
    line-height: 1.25;
    margin-bottom: 60px;
  }

  .btn-ms-login {
    background-color: #EEEFF8;
    border: 1px solid #C4C4C4;
    box-sizing: border-box;
    border-radius: 10px;
    padding: 20px 45px;
    color: #787B96;
    font-family: 'Latto-Bold';
    text-decoration: none;

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
        <div className="row content-wrapper">
          <div className="col-md-6">
            <img
              src={require('../assets/images/logo-sharp.png').default}
              alt="Medha SIS"
              className='logo'
            />
          </div>
          <div className="col-md-6">
            <p className="app-name">Student Information System</p>
            <a type="button" href={urlPath('/connect/microsoft')} className="btn-ms-login d-flex">
              <img
                src={require('../assets/images/logo-microsoft.svg').default}
                alt="Microsoft"
                className={`mr-5`}
              />
              <span>Login using Microsoft account</span>
            </a>
          </div>
        </div>
      </div>
    </Styled>
  );
};

export default Login;
