FROM node:16

WORKDIR /usr/src/app

ADD package*.json .
ADD ./src ./src/
ADD *paastis.yml .

RUN npm ci --only=production

EXPOSE 3000

CMD [ "npm", "start" ]
