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

  return {
    getRandomColor,
  };
}
