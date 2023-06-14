export const generateRandomCode = (count: number) => {
  let randomCode = "";
  for (let i = 0; i < count; i++) {
    const randomNumber = Math.floor(Math.random() * 9) + 1;
    randomCode = randomCode + randomNumber;
  }
  return `#${randomCode}`;
};

export const shuffleDatas = <T>(array: T[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
