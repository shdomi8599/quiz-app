export const generateRandomCode = (count: number) => {
  let randomCode = "";
  for (let i = 0; i < count; i++) {
    const randomNumber = Math.floor(Math.random() * 9) + 1;
    randomCode = randomCode + randomNumber;
  }
  return `#${randomCode}`;
};
