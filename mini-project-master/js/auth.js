//login page
closeOtherWindows();
async function login() {
  console.log("button_clicked");
  const email = document.getElementById("email").value;
  const Cr_password = document.getElementById("password").value;

  let postData = {
    email: email,
    password: Cr_password,
  };
  console.log(postData);
  await fetch("https://takemyattendence-27rl.onrender.com/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (data["status"] == true) {
        console.log(data);
        localStorage.setItem("auth_token", data["authToken"]);
        window.location.href = "dashboard_C.html";
      } else {
        alert(data["message"]);
      }
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
  Cr_password.value = "";
}

// signup page
async function signup() {
  console.log("button_clicked");
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const Cr_password = document.getElementById("Cr_password").value;
  const Co_password = document.getElementById("Co_password").value;

  if (Cr_password == Co_password){
  // check password and confrim password

  let postData = {
    name: name,
    email: email,
    password: Cr_password,
  };
  console.log(postData);
  await fetch("https://takemyattendence-27rl.onrender.com/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok" + response);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      if (data["status"] == true) {
        // alert(data['message']);
        window.open("OTP.html?email=" + encodeURIComponent(email), "_blank");
      } else {
        alert(data["message"]);
      }
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
  }else{
    alert("password and confirm password are not same");
  }
}

function closeOtherWindows() {
  const currentWindow = window;

  // Loop through all open windows
  for (let i = 0; i < window.top.length; i++) {
      const otherWindow = window.top[i];

      // Close the window if it's not the current window
      if (otherWindow !== currentWindow) {
          otherWindow.close();
      }
  }
}

//check otp

async function checkOTP() {
  var query = new URLSearchParams(window.location.search);
  var email = query.get("email");
  const OTP = parseInt(document.getElementById("otp").value);

  let postData = {
    email: email,
    user_otp: OTP,
  };
  console.log(postData);
  await fetch("https://takemyattendence-27rl.onrender.com/verifyEmail", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      if (data["status"] == true) {
        alert("Email verified go for signin ");
        window.close();
      } else {
        alert("OTP incorrect");
      }
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

//forgot password
async function forgot_pass() {
  const email = document.getElementById("email").value;
  const new_pass = document.getElementById("new_pass").value;
  const con_pass = document.getElementById("conPassword").value;
  // check new pass and confrim pass
if (new_pass == con_pass){
  let postData = {
    email: email,
    password: new_pass,
  };
  console.log(postData);
  await fetch("https://takemyattendence-27rl.onrender.com/resetpassword", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      if (data["status"] == true) {
        alert("emal for reset password is sent to " + email);
      }
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
  }else{
    alert("password and confirm password are not same");
  }
}


async function resendotp(){
  var query = new URLSearchParams(window.location.search);
  var email = query.get("email");

  let postData = {
    email: email,
  };
  console.log(postData);
  await fetch("https://takemyattendence-27rl.onrender.com/resendotp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      if (data["status"] == true) {
       alert(data['message']);
      } else {
        alert(data['message']);
      }
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

function togglePasswordVisibility() {
  const passwordField = document.getElementById("new_pass");
  const passwordField2 = document.getElementById("conPassword");
  const togglePasswordButton = document.getElementById("togglePassword");

  if (passwordField.type === "password" && passwordField2.type == "password") {
      passwordField.type = "text";
      passwordField2.type = "text";
      togglePasswordButton.innerHTML = "&#128064;"; // Show password icon
  } else {
      passwordField.type = "password";
      passwordField2.type = "password";
      togglePasswordButton.innerHTML = "&#128065;"; // Hide password icon
  }
}