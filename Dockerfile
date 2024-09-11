# Use multi-stage builds to combine both services

# Stage 1: Build the website
FROM nginx:alpine AS website
COPY ./index.html /usr/share/nginx/html/index.html

# Stage 2: Build the Telegram bot
FROM node:14 AS bot
WORKDIR /app
COPY . .
RUN npm install

# Final stage: Combine both
FROM nginx:alpine
COPY --from=website /usr/share/nginx/html /usr/share/nginx/html
COPY --from=bot /app /app
WORKDIR /app
ENV TELEGRAM_TOKEN=YOUR_BOT_TOKEN
ENV WEBSITE_URL=http://localhost
CMD ["sh", "-c", "nginx && npm start"]
