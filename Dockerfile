from node:14

COPY commands/ bot.js package.json package-lock.json /archivebot/

WORKDIR /archivebot

RUN apt-get update && apt-get install build-essential -y && npm install && npm install enmap

CMD ["node", "./bot.js"]