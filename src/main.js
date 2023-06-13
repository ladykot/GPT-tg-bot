import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import config from 'config';
import { ogg } from './converter.js';
import { openai } from './openai.js';

const bot = new Telegraf(config.get('TELEGRAM_TOKEN'));

bot.on(message('voice'), async (ctx) => {
  try {
    const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id); // get link to .ogg file
    const userId = String(ctx.message.from.id);
    const oggPath = await ogg.create(link.href, userId);
    const mp3Path = await ogg.convertToMp3(oggPath, userId);
    const text = await openai.transcription(mp3Path);
    // const response = await openai.chat(text)
    // await ctx.reply(JSON.stringify(link, null, 2));
    await ctx.reply(text);
  } catch (error) {
    console.log('Error while voice message', error.message);
  }

});

bot.command('start', async (ctx) => {
  // reply to user
  await ctx.reply(JSON.stringify(ctx.message, null, 2)); // ctx - current info about bot's state
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT')); // if Node.js stopped - bot stop
process.once('SIGTERM', () => bot.stop('SIGTERM'));
