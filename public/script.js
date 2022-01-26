//for this code, in line 4 we can give the iframe a particular ID or class Name so we can reference that particular video since we will have several on page. 

$("#ppdvideowatched").on("click", function () {
        console.log("button works!")
    let videoId = $("#ppdvideo").attr("src")
    let username = $(this).attr("class");
    console.log("username is: " + username)
    videoId=videoId.split("/")
    videoId=videoId[videoId.length-1]
    console.log("video Id is: " + videoId)
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

  $("#ppdvideosaved").on("click", function () {
        console.log("button works!")
    let videoId = $("#ppdvideo").attr("src")
    let username = $(this).attr("class");
    console.log("username is: " + username)
    videoId=videoId.split("/")
    videoId=videoId[videoId.length-1]
    console.log("video Id is: " + videoId)
    let endpoint = `http://localhost:3000/${username}/videosSaved`
    
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