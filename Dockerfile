from node:14

COPY bot.js package.json package-lock.json /archivebot/
COPY commands/ /archivebot/commands/

WORKDIR /archivebot

RUN apt-get update && apt-get install build-essential -y && npm install && npm install enmap

CMD ["node", "./bot.js"]