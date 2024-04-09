FROM node:17-alpine

WORKDIR /app

RUN npm i --global react-scripts@3.4.1

COPY package-lock.json ./package-lock.json
COPY package.json ./package.json

COPY server/package-lock.json ./server/package-lock.json
COPY server/package.json ./server/package.json

ENV NODE_ENV=production

RUN npm i
RUN npm i --prefix server
COPY src ./src
COPY public ./public

RUN npm run build

COPY server ./server

EXPOSE 8080

CMD ["npm", "run", "server"]
