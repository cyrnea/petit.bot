import TelegramBot from "node-telegram-bot-api";
import axios from "axios";

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

if (!TELEGRAM_TOKEN) {
  console.error("❌ TELEGRAM_TOKEN manquant dans les variables Render");
  process.exit(1);
}

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
