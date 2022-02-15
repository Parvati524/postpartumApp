//for this code, in line 4 we can give the iframe a particular ID or class Name so we can reference that particular video since we will have several on page.

/* Videos Watch and Videos Save */
$(".videowatched").on("click", function () {
  console.log("button works!");
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
          // $('.clicked').removeClass('hidden')
        })
        .catch(function (error) {
          console.error("Error updating: ", error);
          // $('.alreadyclicked').removeClass('hidden')
        });
    });
});

/* New Put route /update -  */
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
          // $('.clicked').removeClass('hidden')
        })
        .catch(function (error) {
          console.error("Error updating: ", error.message);
          // $('.alreadyclicked').removeClass('hidden')
        });
    });
});

$("#updateForm").on("submit", function (event) {
  event.preventDefault();

  let data = JSON.stringify(Object.fromEntries(new FormData(event.target)));
  console.log(data)
  fetch("/update", {
    method: "PUT",
    body: data,
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      return Promise.reject(response);
    })
    .then(function (data) {
      console.log(data);
    })
    .catch(function (error) {
      console.warn(error);
    });
});
