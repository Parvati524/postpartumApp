//for this code, in line 4 we can give the iframe a particular ID or class Name so we can reference that particular video since we will have several on page. 

$("#ppdvideobutton").on("click", function () {
        console.log("button works!")
    let videoId = $("#ppdvideo").attr("src")
    let username = this.className;
    videoId=videoId.split("/")
    videoId=videoId[videoId.length-1]
    console.log(videoId)
    let endpoint = `http://localhost:3000/${username}/videosWatched`
    
    fetch(endpoint, 
         {method: "PUT",   
         headers:{'Content-Type':'application/json'},
         body:JSON.stringify({video:videoId})})

    .then(function(response){
      if(!response.ok){
        throw Error("Issues getting data from server")
      } else {
        return response.json()
      }
    })
    .then(function(data){
      console.log(data)
    })
    .catch(function(error){
      console.error("Error updating: ", error)
    })
    
  });