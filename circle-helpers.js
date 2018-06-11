function CircleHelpers() {
  const getRandomColor = () => {
    const colors = [
      'red', 'black', 'blue',
      'green', 'yellow', 'orange', 'pink'
    ];
    let number = Math.round(Math.random() * colors.length -1);
    number = number < 0 ? 0: number;
    return colors[number];
  };

  const circlesAreIntersect = (circle_1, circle_2) => {
    let deltaX = Math.abs(circle_1._x - circle_2._x);
    let deltaY = Math.abs(circle_1._y - circle_2._y);

    let sqrtDistance = Math.pow(deltaX, 2) + Math.pow(deltaY, 2);
    let distance = Math.sqrt(sqrtDistance);

    return distance < circle_1._radius + circle_2._radius;
  };

  return {
    getRandomColor,
    circlesAreIntersect,
  };
}
