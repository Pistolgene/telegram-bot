const TelegramApi = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('.options');
const token = '6505529181:AAFAaF-Ou987gSgLKLEY5VwXRZWESluvOIE';

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async chatId => {
  await bot.sendMessage(chatId, 'I wish a number from 0 to 9 and you should guess it');
  const randomNumber = Math.floor(Math.random() * 10);

  chats[chatId] = randomNumber;

  await bot.sendMessage(chatId, 'Guess the number', gameOptions);
};
const start = () => {
  bot.setMyCommands([
    { command: '/start', description: 'Welcoming a user' },
    { command: '/info', description: 'Providing info to a user' },
    { command: '/game', description: 'The game where you need to guess a certain number to win' },
  ]);
  bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === '/start') {
      await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/be1/98c/be198cd5-121f-4f41-9cc0-e246df7c210d/1.webp');
      return bot.sendMessage(chatId, `Welcome to telegram bot from youtube channel ulbi`);
    }

    if (text === '/info') {
      return bot.sendMessage(chatId, `Your name is ${msg.from.first_name} ${msg.from.last_name}`);
    }
    if (text === '/game') {
      return startGame(chatId);
    }
    return bot.sendMessage(chatId, `I don't understand you`);
  });

  bot.on('callback_query', async msg => {
    const data = msg.data;

    const chatId = msg.message.chat.id;
    if (data === '/again') {
      return startGame(chatId);
    }
    if (data == chats[chatId]) {
      return await bot.sendMessage(chatId, `Congratulations, nubmer ${chats[chatId]} is correct`, againOptions);
    } else {
      return bot.sendMessage(chatId, `Unfortunately, the correct number is ${chats[chatId]} `, againOptions);
    }
  });
};

start();
