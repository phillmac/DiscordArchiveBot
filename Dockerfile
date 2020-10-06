from node:14

COPY * /archivebot/

WORKDIR /archivebot

RUN apt-get update && apt-get install build-essential -y && npm install

CMD ["node", "./bot.js"]