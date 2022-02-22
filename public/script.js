/* Video Watched */
$(".videowatched").on("click", function () {
  let videoId = $(this).attr("data-id");
  console.log("video Id is: " + videoId);

  fetch("/user", {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  })
    .then((res) => res.json())
    .then((data) => {
      let endpoint = `/${data.user.username}/videosWatched`;
      fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ video: videoId }),
      })
        .then(function (response) {
          if (!response.ok) {
            response.text().then(function (text) {
              throw Error(text);
            });
          } else {
            return response.json();
          }
        })
        .then(function () {
          /* Toast Option for animation etc */
          var option = {
            animation: true,
            delay: 3000,
          };
          /* Grabbing the correlated div to that video/button through the data-toast which has the videoid as its data to make it unique */
          var toastDiv = $(`div[data-toast=${videoId}]`);
          var toast = new bootstrap.Toast(toastDiv, option);
          toast.show();
        })
        .catch(function (error) {
          console.error("Error updating: ", error);
          // $('#ppdalreadywatched').removeClass('hidden')
        });
    });
});

/*  The Toast trigger comes from videosaved on click */
/* Video Saved */
$(".videosaved").on("click", function () {
  let videoId = $(this).attr("data-id");
  console.log("video Id is: " + videoId);

  fetch("/user", {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  })
    .then((res) => res.json())
    .then((data) => {
      let endpoint = `/${data.user.username}/videosSaved`;
      fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ video: videoId }),
      })
        .then(function (response) {
          if (!response.ok) {
            response.text().then(function (text) {
              throw Error(text);
            });
          } else {
            return response.json();
          }
        })
        .then(function (data) {
          console.log(data);

          /* Toast Option for animation etc */
          var option = {
            animation: true,
            delay: 3000,
          };

          /* Grabbing the correlated div to that video/button through the data-toast which has the videoid as its data to make it unique */
          var toastDiv = $(`div[data-toast=${videoId}]`);
          var toast = new bootstrap.Toast(toastDiv, option);
          toast.show();
        })
        .catch(function (error) {
          console.error("Error updating: ", error.message);
          $("#ppdalreadysaved").removeClass("hidden");
        });
    });
});

/* Update Form */
$("#updateForm").on("submit", function (event) {
  event.preventDefault();
  let data = JSON.stringify(Object.fromEntries(new FormData(event.target)));
  fetch("/update", {
    method: "PUT",
    body: data,
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      $("#message").html(
        "<h1 class='alert alert-success' role='alert' >Success! Your profile has been updated </h1>"
      );
    })
    .catch(function (error) {
      console.log(error);
    });
});

$("#yelpSubmit").on("click", function (event) {
  event.preventDefault();
  let location = $("#locationInput").val();
  console.log(location);
  fetch(`/perinatal/?location=${location}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      let myHtml = "<h2 class='card-title'>Prenatal/Perinatal Resources Near You</h2>"
                
      for(let i = 0; i<data.length; i++){
          myHtml+=  "<li class='list-group-item'>" + "Name: "  + data[i].name +
          "<br>" + "Phone: " + data[i].phone + "<br>" + "Rating: " + data[i].rating
            + "</li>"
 
            }
         
          $("#perinatal").html(myHtml)
          })
    .catch(function (error) {
      console.log(error);
    });
});
