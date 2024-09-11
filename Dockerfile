# Use multi-stage builds to combine both services

# Stage 1: Build the website
FROM nginx:alpine AS website
COPY Game /usr/share/nginx/html/index.html

# Stage 2: Build the Telegram bot
FROM node:14 AS bot
WORKDIR /app
COPY Bot /app
RUN npm install

# Final stage: Combine both
FROM nginx:alpine
COPY --from=Game /usr/share/nginx/html /usr/share/nginx/html
COPY --from=Bot /app /app
WORKDIR /app
ENV TELEGRAM_TOKEN=7540708072:AAEArLeZEv8JHLjPWLI990tJFytaH9Gw5CQ
ENV WEBSITE_URL=http://localhost
CMD ["sh", "-c", "nginx && npm start"]
