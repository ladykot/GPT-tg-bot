import { Telegraf, session } from 'telegraf';
import { message } from 'telegraf/filters';
import { code } from 'telegraf/format';
import config from 'config';
import { ogg } from './converter.js';
import { openai } from './openai.js';

const INITIAL_SESSION = {
  messages: [],
};

const bot = new Telegraf(config.get('TELEGRAM_TOKEN'));

bot.use(session()); // чтобы запомнить контекст разговора

// команда д/создания новой сессии
bot.command('new', async (ctx) => {
  ctx.session = INITIAL_SESSION;
  await ctx.reply('... Чем могу помочь?');
});

bot.on(message('voice'), async (ctx) => {
  ctx.session ??= INITIAL_SESSION;
  try {
    await ctx.reply(code('(∩^o^)⊃━☆ﾟ.*･｡ﾟ...'));
    const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id); // get link to .ogg file
    const userId = String(ctx.message.from.id);
    const oggPath = await ogg.create(link.href, userId);
    const mp3Path = await ogg.convertToMp3(oggPath, userId);

    const text = await openai.transcription(mp3Path);

    ctx.session.messages.push({ role: openai.roles.USER, content: text });

    const response = await openai.chat(ctx.session.messages);

    ctx.session.messages.push({
      role: openai.roles.ASSISTANT,
      content: response.content,
    });
    await ctx.reply(response.content);
  } catch (error) {
    console.log('Error while voice message', error.message);
  }
});


bot.command('start', async (ctx) => {
  ctx.session = INITIAL_SESSION;
  // reply to user
  await ctx.reply(JSON.stringify(ctx.message, null, 2)); // ctx - current info about bot's state
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT')); // if Node.js stopped - bot stop
process.once('SIGTERM', () => bot.stop('SIGTERM'));
