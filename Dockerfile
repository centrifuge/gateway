FROM node:10.13.0

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN npm run prepare

EXPOSE 3001

CMD ["npm", "run", "start:prod"]