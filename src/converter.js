import axios from 'axios';
import ffmpeg from 'fluent-ffmpeg'; // library for handling audio/video
import installer from '@ffmpeg-installer/ffmpeg'
import { createWriteStream } from 'fs'; // module Node.js for interacting with files
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

// преобразуем URL файла в путь к этому файлу и используем в методе create
const __dirname = dirname(fileURLToPath(import.meta.url));

// преобразование и сохранение файлов
class OggConverter {
  constructor() {
    ffmpeg.setFfmpegPath(installer.path)
  }

  convertToMp3(input, output) {
    try {
      const outputPath = resolve(dirname(input), `${output}.mp3`);
      return new Promise((resolve, reject) => {
        ffmpeg(input)
        .inputOption('-t 30') // конвертируются первые 30 с
        .output(outputPath)
        .on('end', () => resolve(outputPath)) // обработчик события вызывается, когда конвертация завершена
        .on('error', (err) => reject(err.message))
        .run() // метод запуска конвертации
      })
    } catch (error) {
      console.log('Error while creating mp3', error.message);
    }
  }

  // download file from telegram server (url) and save local (filename)
  async create(url, filename) {
    try {
      const oggPath = resolve(__dirname, '../voices', `${filename}.ogg`); // создаем путь к будущему файлу
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
