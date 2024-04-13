var query = new URLSearchParams(window.location.search);
var classId = parseInt(query.get("classId"));
getJoindedStudents(classId);
totalStudents = [];

absentStudents = [];
presentStudents = [];
async function getJoindedStudents(classId) {
  let post = {
    classId: classId,
  };
  console.log(post);
  await fetch("https://takemyattendence-27rl.onrender.com/getAllStudents", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      displayData(data);
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

const displayData = (joindedStudents) => {
  joindedStudents.map((ele) => {
    const card = `<tr>
    <div id="row">
      <td>${ele.rollno}</td>
      <td>${ele.name}</td>
      <div id="pabuttons">
      <td>
          <button id="present${ele.rollno}" class="pbutton" onclick="markPresent('${ele.name}', '${ele.email}', '${ele.rollno}', ${ele.userId})">P</button>
      </td>
      <td>
          <button id="absent${ele.rollno}" class="abutton" onclick="markAbsent('${ele.name}', '${ele.email}', '${ele.rollno}', ${ele.userId})">A</button>
          </div>
          </div> 
      </td>`;
    document.getElementById("info").innerHTML += card;
    totalStudents.push(ele.userId);
  }
  );
  console.log(totalStudents.length);
};

//onclick absent 
const markAbsent = (name, email, rollno, userId) => {
  document.getElementById(`absent${rollno}`).style.backgroundColor = "red";
  document.getElementById(`absent${rollno}`).style.color = "white";

  document.getElementById(`present${rollno}`).style.backgroundColor = "white";
  document.getElementById(`present${rollno}`).style.color = "black";
  let Adata = {
    name,
    email,
    rollno,
    userId,
  };
  if (absentStudents.some((obj) => obj.userId === userId)) {
    alert("value is allrady absent mark");
  } else if (presentStudents.some((obj) => obj.userId == userId)) {
// Use the filter() method to create a new array without the specified object
presentStudents = presentStudents.filter(obj => obj.userId !== userId);
absentStudents.push(Adata);
  } else {
    absentStudents.push(Adata);
}
console.log("absent list: ");
console.log(absentStudents);
console.log("present list: ");
console.log(presentStudents);
};

//onclick present
const markPresent = (name, email, rollno, userId) => {
  document.getElementById(`present${rollno}`).style.backgroundColor = "blue";
  document.getElementById(`present${rollno}`).style.color = "white";

  document.getElementById(`absent${rollno}`).style.backgroundColor = "white";
  document.getElementById(`absent${rollno}`).style.color = "black";
  let Pdata = {
    name,
    email,
    rollno,
    userId,
  };

  if (presentStudents.some((obj) => obj.userId === userId)) {
    alert("value is allrady present mark");
  } else if (absentStudents.some((obj) => obj.userId == userId)) {
absentStudents = absentStudents.filter(obj => obj.userId !== userId);
presentStudents.push(Pdata);
  }else {
    presentStudents.push(Pdata);
  }
  console.log("absent list: ");
  console.log(absentStudents);
  console.log("present list: ");
  console.log(presentStudents);
};

async function postAttendance(lectureStatus) {
  let post = {
    classId,
    presentStudents,
    absentStudents,
    lectureStatus,
  };
  if(presentStudents.length + absentStudents.length == totalStudents.length){
  await fetch("https://takemyattendence-27rl.onrender.com/createLecture", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      window.history.back();
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
  }else{
    alert("Incomplete Attendence")
  }
}


function cancel(){
  window.history.back();
}