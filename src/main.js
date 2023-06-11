import { Telegraf } from 'telegraf';
import config from 'config';

const bot = new Telegraf(config.get('TELEGRAM_TOKEN'));

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT')); // if Node.js stopped - bot stop
process.once('SIGTERM', () => bot.stop('SIGTERM'));
