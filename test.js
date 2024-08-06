var checkStraightLine = function (coordinates) {
  const [p1x, p1y] = coordinates[0];
  let [x, y] = coordinates[1];
  const angleRadians = Math.atan2(y - p1y, x - p1x);
  console.log(angleRadians)
  for (let index = 2; index < coordinates.length; index += 1) {
    let [x, y] = coordinates[index];
    const tempAngleRadians = Math.atan2(y - p1y, x - p1x);
    console.log(tempAngleRadians)
    if (Math.abs(tempAngleRadians) != Math.abs(angleRadians)) {
      return false;
    }
  }
  return true;
};

const result = checkStraightLine([[1,1],[2,2],[2,0]]);
console.log(result); //false
