const fetch = require("node-fetch");
const keys = require("../config/keys");
const yelpApiKey = keys.yelpApiKey;
const youtubeApiKey = keys.youtubeApiKey;
const yelp = require("yelp-fusion");
const client = yelp.client(yelpApiKey);
const { filterArr } = require("./dataOperations");

// ! helper
function yelpCall(category, location, limit) {
  const reqObject = {
    categories: category,
    location: location,
    limit: limit,
  };
  return client.search(reqObject);
}

// ! helper
async function youtube(videoCategory) {
  let url = `https://www.googleapis.com/youtube/v3/search?key=${youtubeApiKey}&type=video&part=snippet&q=${videoCategory}&videoEmbeddable=true&maxResults=10`;
  const response = await fetch(url);
  const data = await response.json();
  const videos = data;
  return videos;
}

// ! helper
function getData(location, videosWatched, videosSaved) {
  return Promise.all([
    yelpCall("physicaltherapy", location, 10),
    yelpCall("psychologists", location, 10),
    youtube("postpartum_depression_and_anxiety"),
    youtube("postpartum_meditation"),
    youtube("postpartum_yoga"),
    youtube("postpartum_recovery_exercise"),
  ])
    .then((values) => Promise.all(values.map((value) => JSON.stringify(value))))
    .then((finalVals) => {
      //this is how I access each item in the array.
      let phystherapists = finalVals[0];
      phystherapists = JSON.parse(phystherapists);
      phystherapists = phystherapists.jsonBody.businesses;

      //doing same for psychologists
      let psychologists = finalVals[1];
      psychologists = JSON.parse(psychologists);
      psychologists = psychologists.jsonBody.businesses;
      //now doing ppd/ppa youtube call. going to drill down to get videoIds and push to an array.
      let ppdvideos = finalVals[2];
      ppdvideos = JSON.parse(ppdvideos);

      let ppdvideoinfo = ppdvideos.items;
      if (ppdvideoinfo) {
        //filtering our array of videoinfo from youtube to not include videos that are in our users DB under videosSaved or videosWatched
        ppdvideoinfo = filterArr(ppdvideoinfo, videosWatched, videosSaved);
      }

      //now postpartum meditation youtube call
      let meditation = finalVals[3];
      meditation = JSON.parse(meditation);
      let medvideoinfo = meditation.items;
      if (medvideoinfo) {
        medvideoinfo = filterArr(medvideoinfo, videosWatched, videosSaved);
      }

      //now postpartum yoga youtube call
      let yoga = finalVals[4];
      yoga = JSON.parse(yoga);
      let yogavideoinfo = yoga.items;
      if (yogavideoinfo) {
        yogavideoinfo = filterArr(yogavideoinfo, videosWatched, videosSaved);
      }
      //now postpartum recovery exercise youtube call
      let exercise = finalVals[5];
      exercise = JSON.parse(exercise);
      let exvideoinfo = exercise.items;
      if (exvideoinfo) {
        exvideoinfo = filterArr(exvideoinfo, videosWatched, videosSaved);
      }
      return {
          exvideoinfo,
          yogavideoinfo,
          ppdvideoinfo,
          medvideoinfo,
          phystherapists,
          psychologists
        };
   
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
}

module.exports = {
  yelpCall,
  youtube,
  getData,
};
