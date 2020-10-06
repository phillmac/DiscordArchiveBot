FROM node:14

ENV NODE_PATH=/usr/local/lib/node_modules

RUN apt-get update && apt-get install build-essential -y && npm install -g --unsafe-perm enmap

COPY package.json package-lock.json /archivebot/
RUN npm install

COPY bot.js /archivebot/
COPY commands/ /archivebot/commands/

WORKDIR /archivebot


CMD ["node", "./bot.js"]