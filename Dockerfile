from node:14

COPY * /archivebot

WORKDIR /archivebot

RUN sudo apt-get update && sudo apt-get install build-essential -y && npm install

CMD ["node" "./bot.js"]