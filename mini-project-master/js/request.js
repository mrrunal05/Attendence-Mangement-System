var query = new URLSearchParams(window.location.search);
var classId = parseInt(query.get("classId"));
request(classId)

async function request(classId) {
    let post = {
      classId: classId,
    };
    console.log(post);
    await fetch("https://takemyattendence-27rl.onrender.com/allRequest", {
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
        displayData(data, classId)
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }

  const displayData = (requestArray, classId) => {
    requestArray.map((ele) => {
      const card = ` <tr>
      <td>${ele.rollno}</td>
      <td>${ele.name}</td>
      <td>${ele.email}</td>
      <td class="C"><button class="check" onclick="accept('${ele.email}', ${classId}, ${true})"><i class="fa-solid fa-check"></i></button><button class="uncheck" onclick="accept('${ele.email}', ${classId}, ${false})"><i class="fa-solid fa-xmark"></i></button></td>
  </tr>`;
      document.getElementById("info").innerHTML += card;
    });
  };

  async function accept(email, classId, isAccepted){
    let post = {
        classId: classId,
        email: email,
        isAccepted: isAccepted
      };
      console.log(post);
      await fetch("https://takemyattendence-27rl.onrender.com/acceptrequest", {
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
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
        location.reload();
    }
