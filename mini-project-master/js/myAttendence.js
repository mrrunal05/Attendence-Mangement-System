var query = new URLSearchParams(window.location.search);
var classId = parseInt(query.get("classId"));
var email = query.get("email");
var totallec;
var presentDay = 0;
var absentDay = 0;

getMyAttendence();

async function getMyAttendence() {
    let post = {
      classId,
      email
    };
    console.log(post);
    await fetch("https://takemyattendence-27rl.onrender.com/getMyAttendence", {
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
        console.log(data)
        totallec = data["infoList"].length;
        document.getElementById('className').textContent = `Class Name : ${data['className']}`;
        document.getElementById('teacherName').textContent = `Teacher : ${data['Teacher']}`;
        document.getElementById('totalDaysOfClasses').textContent = `Total lectures : ${totallec}`;
        displayData(data['infoList']);
        displaydownTable(totallec, data['infoList']);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }

function ab(presentstatus){
    if(presentstatus == true){
        return "P"
    }else{
        return "A"
    }
}

  const displayData = (joindedStudents) => {
    joindedStudents.map((ele) => {
      var pres = ab(ele.presentStatus);
      console.log(ele);
      const card = `<tr>
      <td>${ele.date}/ ${ele.time}</td>
      <td>${ele.day}</td>
      <td>${pres}</td>
  </tr>`;
      document.getElementById("ft").innerHTML += card;
    });
  }
  
const days = (infoList) => {
    infoList.map((ele) => {
        if(ele.presentStatus == true){
            presentDay+=1
        }else{
            absentDay+=1
        }
    })
}

  function displaydownTable(totallec, infoList){
    days(infoList)
    var persent = (presentDay/totallec)*100;
    
      const card = `<tr>
      <td>${presentDay}</td>
      <td>${absentDay}</td>
      <td>${persent}%</td>
  </tr>`;
      document.getElementById("lt").innerHTML += card;
  }