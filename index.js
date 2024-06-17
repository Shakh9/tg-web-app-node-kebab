const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const webAppUrl = 'https://clever-pegasus-a469b1.netlify.app';

const bot = new TelegramBot(token, {polling: true});
const app = express();

app.use(express.json());
app.use(cors());

bot.on('message', async msg => {
  console.log(msg);
  const chatId = msg.chat.id;
  const firstName = msg.chat.first_name;
  const text = msg.text;

  if(text === '/start') {
    await bot.sendMessage(chatId, `Добро пожаловать, ${firstName}! Мы рады приветствовать вас в нашем чат-боте. Для заказа нажмите кнопку "Заказать" снизу.`, {
      reply_markup: {
        keyboard: [
          [{text: 'Заказать', web_app: {url: webAppUrl}}]
        ]
      }
    })
  }
  
  if (msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg?.web_app_data?.data);
      await bot.sendMessage(chatId,
        `Ваш заказ #0022 принят ✅
Статус вашего заказа: в обработке ⌛
Сумма заказа: ${data.totalCost}
Имя: ${data.name}
Адрес: ${data.address}
Телефон: ${data.phone}
Комментарий: ${data.comment}
Способ доставки: ${data.deliveryMethod}
Способ оплаты: ${data.paymentMethod}`);
    } catch (e) {
      console.log(e);
    }
  }
});

// app.post('/web-data', async (req, res) =>  {
//   const {queryId, totalCost, name, address, phone, comment, deliveryMethod, paymentMethod} = req.body;
//   try {
//     await bot.answerWebAppQuery(queryId, {
//       type: 'article',
//       id: queryId,
//       title: 'Заказ принят',
//       input_message_content: {
//         message_text: `Поздравляю с покупкой, вы приобрели товар на сумму + ${totalCost}`
//       }
//     })
//     return res.status(200).json({});
//   } catch (e) {
//     await bot.answerWebAppQuery(queryId, {
//       type: 'article',
//       id: queryId,
//       title: 'Не удалось оформить заказ',
//       input_message_content: {
//         message_text: 'Не удалось оформить заказ'
//       }
//     })
//     return res.status(500).json({});
//   }
// })

// const PORT = 8000;

// app.listen(PORT, () => console.log('server started on PORT' + PORT))