import { Configuration, OpenAIApi } from 'openai';
import config from 'config';
import { createReadStream } from 'fs';

class OpenAI {
  roles = {
    ASSISTANT: 'assistant',
    USER: 'user',
    SYSTEM: 'system',
  };
  constructor(apiKey) {
    const configuration = new Configuration({
      apiKey,
    });
    this.openai = new OpenAIApi(configuration);
  }
  async chat(messages) {
    try {
      const responce = await this.openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages,
      });
      return responce.data.choices[0].message
    } catch (error) {
      console.log('Error while chat', error.message);
    }
  }
  async transcription(filePath) {
    try {
      const response = await this.openai.createTranscription(
        createReadStream(filePath),
        'whisper-1' // модель для чтения файла
      );
      return response.data.text;
    } catch (error) {
      console.log('Error while transcription', error.message);
    }
  }
  async generateImage(description) {
    try {
      const response = await this.openai.createImage({
        prompt: description,
        n: 1,  // Количество генерируемых изображений
        size: "1024x1024",  // Размер изображения
      });
      return response.data.images[0].url; // Возвращает URL сгенерированного изображения
    } catch (error) {
      console.log('Error while generating image', error.message);
      return null;
    }
  }


}

export const openai = new OpenAI(config.get('OPENAI_KEY'));
