import styled from "styled-components";
import { urlPath } from "../constants";

const Styled = styled.div`
@font-face {
  font-family: 'Bebas Neue Book';
  src: local('BebasNeueBook'), url(https://fonts.gstatic.com/...) format('woff2');
}
.button-box{
  padding: 0px 68px 0px 5px;
}

.logo {
  padding: 5px;
  width: 130px;
  height: 130px;
  margin-left: 175px;
 }

 .row-box{
    color: black;
    font-size: 60px;
    line-height: 1.25;
    margin: 49px 39px 1px 19px;
    width:90%;
  }

p{
  margin-top: -6px;
  margin-bottom: 0rem;
  font-family: Bebas Neue Book;
  font-size: 80px;
}
  
.box-1, .col{
  display: inline-block;
  overflow: hidden;
  height:100%;
}

.image{
  max-width:85%;
  max-height:10%;
  margin: 6px 6px 4px 35px;
}

.logo{
  max-width:35%;
  max-height:10%;
}

p{
text-align:center;
}

.btn-ms-login {
    border: 3px solid #32b89d;
    box-sizing: border-box;
    border-radius: 40px;
    font-size: 20px;
    padding: 20px 45px ;
    color: black;
    font-family: 'Lato';
    text-decoration: none;
    margin: 110px -40px 20px 15px;
    img {
      width: 20px;
      margin-right: 20px;
    }
}

  @media screen and (min-width: 768px) {
  .logo {
    padding: 5px;
    width: 130px;
    height: 130px;
    margin-left: 30px;
  }
  .image{
    max-width:85%;
    max-height:10%;
    margin: 6px 6px 4px 64px;
  }
  .btn-ms-login {
    margin: 80px 0px 20px 5px;
    font-family: 'Lato Regular';
  }
  p{
    text-align: initial;
    }
  ${'' /* .row-box{
    margin: 70px 39px 1px 19px;
  } */}
}

@media (min-width:750px) and (max-width:1024px) {
  .image{
    max-width:125%;
    max-height:90%;
    margin: 6px 6px 4px 35px;
  }
}
`;

const Login = () => {
  return (
    <Styled>
      <div class="container-fluid">
        <div class="row">
          <div className="col col-md-5">
            <div class="row">
              <img
                  src={require('../assets/images/logo.png').default}
                  alt="Medha SIS"
                  className='logo'
              />
            </div>
            <div class="row-box">
              <p id="text" >STUDENT </p> <p>INFORMATION</p> <p>SYSTEM</p>
            </div>
            <div class=" button-box">
              <a type="button" href={urlPath('/connect/microsoft')} className="btn-ms-login d-flex">
                  <img
                    src={require('../assets/images/logo-microsoft.svg').default}
                    alt="Microsoft"
                    className={`mr-5`}
                  />
                  <span style={{fontFamily:"Latto-Regular"}}>Login using Microsoft account</span>
              </a>
            </div>
        </div>
        <div className="box-1 col-md-7">
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
