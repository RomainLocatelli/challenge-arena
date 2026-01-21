FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

# RUN npm install

COPY ./ ./

EXPOSE 8008

CMD ["npx", "next", "dev", "--hostname", "0.0.0.0", "--port", "8008"]