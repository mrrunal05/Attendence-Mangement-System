const authToken = localStorage.getItem('auth_token');
console.log(authToken)


async function create_class(){
        const className = document.getElementById("className").value;
        const classPassword = document.getElementById("classPass").value;
    
        let postData = {
            "className": className,
            "classPassword": classPassword,  
        };
    console.log(postData)
        await fetch("https://takemyattendence-27rl.onrender.com/createClass",{
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "authToken": authToken,
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
          window.location.href = "dashboard_C.html";
          })
          .catch((error) => {
            console.error("There was a problem with the fetch operation:", error);
          });
    }

    //join class function
    function join(){
      var query = new URLSearchParams(window.location.search);
      var email = query.get('email');
      window.location.href = "join_class.html?email=" + encodeURIComponent(email);
    }
    
    function create(){
      // var query = new URLSearchParams(window.location.search);
      // var email = query.get('email');
      window.location.href = "create_class.html";
    }

    async function join_class(){
      var query = new URLSearchParams(window.location.search);
      var email = query.get('email');
      const classId = parseInt(document.getElementById("classId").value);
      const classPassword = document.getElementById("classPassword").value;
      const sname = document.getElementById("sName").value;
      const srollno = document.getElementById("sRollno").value;
      let postData = {
        "name": sname,
        "rollno": srollno,
        "classPassword": classPassword,  
        "classId": classId,
        "email": email,
    };
    console.log(postData);
        await fetch("https://takemyattendence-27rl.onrender.com/joinClass",{
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "authToken": authToken,
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
            console.log(data)
            if (data['status']){
            window.location.href = "dashboard_J.html";
            }
            else{
              alert(data['messager']);
            }

          })
          .catch((error) => {
            console.error("There was a problem with the fetch operation:", error);
          });
    }