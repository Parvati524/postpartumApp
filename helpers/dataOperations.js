//function to filter one array to only have values that are not included in 2 other arrays.
function filterArr(arrOne, arrTwo, arrThree) {
  return arrOne.filter(x =>
      !(arrTwo.includes(x.id.videoId) || arrThree.includes(x.id.videoId))
  )

}

module.exports = {
  filterArr
}