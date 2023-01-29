import { useEffect } from 'react';

function GoogleButton() {
  function handleCallBackResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
  }
   
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
    </div>
  );
}

export default GoogleButton
