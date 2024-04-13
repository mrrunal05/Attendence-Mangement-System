const authToken = localStorage.getItem('auth_token');
fetchdata();
let email;
let userdata;
async function fetchdata(){
// URL of the API you want to make a GET request to
  await fetch("https://takemyattendence-27rl.onrender.com/user", {
    method: 'GET',
    headers: {
        "authToken": authToken,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data)
      email = data['email'];
      displayData(data['name'], data['joinedClass']);
      })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
  }
  
  const displayData = (username, joinClassArray) => {
    document.getElementById("username").textContent = username;
    joinClassArray.map((ele)=>{
        const card = `<li onclick="myAttendence(${ele.classId})">
        <div id="class-name" onclick="joinedClasses()">
            <h4>${ele.className}</h4>
        </div>
        </li>`;
        document.getElementById("info").innerHTML += card;
    })
}

function new_btn(){
  window.location.href = "options.html?email=" + encodeURIComponent(email);
}

function myAttendence(classId){
  window.location.href= `myAttendence.html?classId=${classId}&email=${email}`;
}

 // <i class="ri-delete-bin-line" onClick="deleteClass(${ele.classId})"></i>