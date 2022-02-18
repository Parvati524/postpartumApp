$(".videowatched").on("click", function () {
  console.log("button works!")
  let videoId = $(this).attr('data-id')
  console.log("video Id is: " + videoId)

  fetch('/user', { headers: { 'Content-Type': 'application/json'}, credentials: 'include' })
  .then(res => res.json())
  .then(data => {
    let endpoint = `/${data.user.username}/videosWatched`
    fetch(endpoint, 
      {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video: videoId })
      })
      .then(function (response) {
        if (!response.ok) {
          response.text().then(function(text) {
            throw Error(text)
          })
        } else {
          return response.json()
        }
      })
      .then(function () {
        // $('.clicked').removeClass('hidden')
      })
      .catch(function (error) {
        console.error("Error updating: ", error)
        // $('.alreadyclicked').removeClass('hidden')
      })
  })
});




/* New Put route /update -  */
$(".videosaved").on("click", function () {
  let videoId = $(this).attr('data-id')
  console.log("video Id is: " + videoId)
  fetch('/user', { headers: { 'Content-Type': 'application/json'}, credentials: 'include' })
    .then(res => res.json())
    .then(data => {
      let endpoint = `/${data.user.username}/videosSaved`
      fetch(endpoint,
        {
          method: "PUT",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ video: videoId })
        })
        .then(function (response) {
          if (!response.ok) {
            response.text().then(function(text) {
              throw Error(text)
            })
          } else {
            return response.json()
          }
        })
        .then(function (data) {
          console.log(data)
          // $('.clicked').removeClass('hidden')
        })
        .catch(function (error) {
          console.error("Error updating: ", error.message)
          // $('.alreadyclicked').removeClass('hidden')
        })
    })
});



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
      $("#message").html('Your profile has been updated')
    })
    .catch(function (error) {
      console.log(error);
    });
});


