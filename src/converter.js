import axios from 'axios';
import { createWriteStream } from 'fs'; // module Node.js for interacting with files
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url)); // преобразуем URL файла в путь к этому файлу и используем в методе create

class OggConverter {
  constructor() {}

  convertToMp3() {}

  // download file from telegram server (url) and save local (filename)
  async create(url, filename) {
    try {
      const oggPath = resolve(__dirname, '../voices', `${filename}.ogg`);
      const response = await axios({
        method: 'get',
        url,
        responseType: 'stream',
      });

      return new Promise((resolve) => {
        const stream = createWriteStream(oggPath);
        // подключаем поток для чтения (response.data) к потоку для записи (stream)
        // данные из data записываются в oggPath по мере поступления
        response.data.pipe(stream);
        stream.on('finish', () => resolve(oggPath));
      });

    } catch (error) {
      console.log('Error while creating ogg', error.message);
    }
  }
}

export const ogg = new OggConverter();
