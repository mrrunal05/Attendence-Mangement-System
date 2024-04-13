var query = new URLSearchParams(window.location.search);
var lecId = parseInt(query.get("Id"));
var className = parseInt(query.get("className"));
var date = parseInt(query.get("date"));
console.log(lecId);

exportlist(lecId)
async function exportlist(lecID){
    let post = {
        "lectureId": lecID,
    };
    console.log(post);
    await fetch("https://takemyattendence-27rl.onrender.com/exportlist", {
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
        displayData(data)
        })
        .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        });
}

const displayData = (presenty) => {
    console.log(presenty);
    presenty.map((ele) => {
        console.log(ele[0])
      const card = ` <tr>
      <td>${ele[2]}</td>
      <td>${ele[0]}</td>
      <td>
          <div id="${ele[3]}">
              <h3>${ele[3].charAt(0)}</h3>
          </div>
      </td>
  </tr>`;
      document.getElementById("info").innerHTML += card;
    });
  };

//     async function excel(){
//         var query = new URLSearchParams(window.location.search);
//         var lecId = parseInt(query.get("Id"));
//     let post = {
//         lectureId: lecId,
//     };
//     console.log(post);
//     await fetch("https://takemyattendence-27rl.onrender.com/export", {
//         method: "POST",
//         headers: {
//         "Content-Type": "application/json",
//         },
//         body: JSON.stringify(post),
//     })
//         .then((response) => {
//         if (!response.ok) {
//             throw new Error("Network response was not ok");
//         }
//         return response.json();
//         })
//         .then((data) => {
//         console.log(data)
//         })
//         .catch((error) => {
//         console.error("There was a problem with the fetch operation:", error);
//         });
// }

// Function to download the Excel file
async function excel() {
    var query = new URLSearchParams(window.location.search);
    var lecId = parseInt(query.get("Id"));
    var className = query.get("className");
    var date = query.get("date");
    await fetch('https://takemyattendence-27rl.onrender.com/export',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({"lectureId": lecId}),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();
        })
        .then(blob => {
            // Create an Object URL for the Blob data
            const blobUrl = URL.createObjectURL(blob);

            // Create an anchor element for downloading
            const downloadLink = document.createElement('a');
            downloadLink.href = blobUrl;
            downloadLink.download = `${className}/(${date})/Attendence.xlsx`; // Set the desired filename
            downloadLink.style.display = 'none';

            // Add the anchor element to the DOM
            document.body.appendChild(downloadLink);

            // Simulate a click on the anchor element to trigger the download
            downloadLink.click();

            // Clean up: remove the anchor and revoke the Blob URL
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(blobUrl);
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}

