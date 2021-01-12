const { db, Session } = require("./models");

const seed = async () => {
  try {
    // db.sync({ alter: true });
    await qa.bulkCreate(
      [
        {
          id: "1",
          question: "What is your name?",
          optiona: "aman",
          optionb: "naman",
          optionc: "yaman",
          optiond: "chaman",
          answer: "a",
        },
        {
          id: "2",
          question: "What is your age?",
          optiona: "18",
          optionb: "19",
          optionc: "20",
          optiond: "21",
          answer: "c",
        },
        {
          id: "3",
          question: "Where do u live?",
          optiona: "delhi",
          optionb: "goa",
          optionc: "mumbai",
          optiond: "assam",
          answer: "a",
        },
      ],
      {
        ignoreDuplicates: true,
      }
    );
  } catch (e) {
    console.log(e);
  }
};

seed();
