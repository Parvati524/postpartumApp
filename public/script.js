//for this code, in line 4 we can give the iframe a particular ID or class Name so we can reference that particular video since we will have several on page. 

// $("button").on("click", function () {
//     let videoId = $("iframe").attr("src")
//     let username = this.id;
//     videoId=videoId.split("/")
//     videoId=videoId[videoId.length-1]
//     console.log(videoId)
//     let endpoint = `http://localhost:3000/${username}/videosWatched`
//     let self = this;
//     fetch(endpoint, 
        //  {method: "PUT",   
//          headers:{'Content-Type':'application/json'},
//          body:JSON.stringify({video:videoId})})

//     .then(function(response){
//       if(!response.ok){
//         throw Error("Issues getting data from server")
//       } else {
//         return response.json()
//       }
//     })
//     .then(function(data){
//       console.log(data)
//     })
//     .catch(function(error){
//       console.error("Error updating: ", error)
//     })
    
//   });