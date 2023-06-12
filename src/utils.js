import {unlink} from 'fs/promises' // функция для удаления файлов (возвращает промис)

// to-do: if there isn't file 

export async function removeFile(path) {
    try {
        await unlink(path)
    } catch (error) {
        console.log('Error while removing file', error.message);
    }
}