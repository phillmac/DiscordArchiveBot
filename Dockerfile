from node:14

RUN apt-get update && apt-get install build-essential -y && npm install -g --unsafe-perm enmap

COPY bot.js package.json package-lock.json /archivebot/
COPY commands/ /archivebot/commands/

WORKDIR /archivebot

RUN npm install

CMD ["node", "./bot.js"]