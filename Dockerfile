FROM node:14

ENV NODE_PATH=/usr/local/lib/node_modules

RUN apt-get update && apt-get install build-essential -y && npm install -g --unsafe-perm enmap

WORKDIR /archivebot

COPY bot.js package.json package-lock.json /archivebot/
RUN npm install

COPY commands/ /archivebot/commands/



CMD ["node", "./bot.js"]