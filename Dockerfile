# Базовый образ
FROM node:16-alpine

# Создаем директорию внутри образа (все команды выполняются внутри нее)
WORKDIR /app

# Копируем файлы с зависимостями и устанавливаем их
COPY package*.json ./

# ci - учитывает package-lock
RUN npm ci 

# Если вы хотите установить только для production
# RUN npm ci --only=production

# Копируем остальные файлы приложения
COPY . .

# Открываем порт 3000
ENV PORT=3000

EXPOSE $PORT

# Запускаем приложение
CMD [ "npm", "start" ]
