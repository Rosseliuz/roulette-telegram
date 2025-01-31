const TelegramBot = require('node-telegram-bot-api');

const token = '7593030918:AAEnFoTLA3d732TZWdQeuhYhLRQJYTL8IGY'; // Замени на свой токен
const webAppUrl = 'https://rosseliuz.github.io/roulette-telegram/'; // Замени на URL своего сайта

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Нажми на кнопку ниже, чтобы запустить рулетку", {
    reply_markup: {
      inline_keyboard: [[{ text: "Испытать удачу!", web_app: { url: webAppUrl } }]],
    },
  });
});

console.log('Bot is running...');