import React, {useState} from "react";
import axios from 'axios';

const Login = (e) => {
  const [inputId, setInputId] = useState("");
  const [inputPasswd, setInputPasswd] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);

  let id, passwd;

  const handleChangeId = (event) => {
    setInputId((event.target.value).toLowerCase());
  };

  const handleChangePWD = (event) => {
    setInputPasswd(event.target.value);
  };

  const clickLogin = () => {
    const firstCharacterRegex = /^[t]/;
    const remainingCharactersRegex = /^[t][0-9]{4}$/;
    if(firstCharacterRegex.test(inputId) && remainingCharactersRegex.test(inputId)){
        axios.post("http://27.96.130.130:30001/" + "login", {
            login: inputId,
            passwd : inputPasswd
        }).then(() => {
            setLoginSuccess(true);
        })
        .catch(response => {
            if(response.response.status == 400){
                alert("비밀번호를 다시 입력해주세요");
            }
        })
    }
    else{
        alert("본인 부캠 번호를 정확히 입력해주세요. 추천에 도움이 됩니다.")
    };
  }

  const clickLogout = () => {
    setLoginSuccess(false);
  }

  return (
    <div id="login_container">
        <div className="login_wrapper" style={{display: !loginSuccess ? 'inline-block' : 'none' }}> 
            <div className="loginIdDiv">
                <label> ID </label>
                <input type="text" placeholder="부캠 번호" value={id} onChange={handleChangeId}/> 
            </div>
            <div className="loginPasswdDiv">
                <label> Passwd </label>
                <input type="text" placeholder="비밀 번호" value={passwd} onChange={handleChangePWD}/>
            </div>
            <button onClick={clickLogin} className='submit_button'>login</button>
        </div>
        {loginSuccess ?
            <div className="loginResult" style={{display: !loginSuccess ? 'none' : 'inline-block' }}>
                <p>{inputId}님 환영합니다</p>
                <button onClick={clickLogout} className='submit_button' style={{display: !loginSuccess ? 'none' : 'inline-block' }}>logout</button>
            </div>
            : ''
        }
        
    </div>
  );
}


export default Login;
