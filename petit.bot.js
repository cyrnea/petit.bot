const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const TELEGRAM_TOKEN = 'TON_TELEGRAM_TOKEN_ICI';

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

bot.onText(/\/token (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const address = match[1].trim();

  try {
    const url = `https://api.dexscreener.com/latest/dex/tokens/${address}`;
    const { data } = await axios.get(url);

    if (!data.pairs || data.pairs.length === 0) {
      return bot.sendMessage(chatId, "Token non trouvé sur Dexscreener.");
    }

    const p = data.pairs[0];

    bot.sendMessage(
      chatId,
      `📊 *Infos du token*\n` +
      `🪙 Symbol: *${p.baseToken.symbol}*\n` +
      `💰 Prix: *${p.priceUsd}$*\n` +
      `📈 Variation 24h: *${p.priceChange.h24}%*\n` +
      `💧 Liquidité: *${p.liquidity.usd}$*\n` +
      `🔗 Pair: ${p.url}`,
      { parse_mode: "Markdown" }
    );

  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, "Erreur lors de la récupération des données.");
  }
});

bot.on("message", (msg) => {
  if (msg.text === "/start") {
    bot.sendMessage(msg.chat.id, "Bienvenue ! Envoie /token <adresse_ERC20>");
  }
});
