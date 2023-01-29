import { useEffect, useState } from 'react';
import jwt_decode from "jwt-decode"

function GoogleButton() {
  const [ user, setUser ] = useState({});

  function handleCallBackResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    var userObject = jwt_decode(response.credential);
    console.log(userObject);
    setUser(userObject);
    document.getElementById("signInDiv").hidden = true;
  }
  // function handleSignOut(event) {
  //   setUser({});
  //   document.getElementById("signInDiv").hidden = false;
  // }
  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: "673524057950-ite5crpnnt032m4b474jft1btd7i6dlc.apps.googleusercontent.com",
      callback: handleCallBackResponse
    });
  

    google.accounts.id.renderButton(
      document.getElementById("GoogleButton"),
      { theme: "outline", size: "large"}
    );
  }, []);
  return (
    <div id="GoogleButton">
      <div id="signInDiv"></div>
      {/* { Object.keys(user).length != 0 && 
        <button onClick={ (e) => handleSignOut(e)}>Logout</button>
      } */}
      { user &&
        <div>
          <h3>{user.name}</h3>
        </div>
      }
    </div>
  );
}

export default GoogleButton
