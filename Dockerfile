FROM node:14-alpine3.11

LABEL version="v1"
LABEL maintainer="Paul Okeke <donpaul120@gmail.com;>"

# Upadate dependencies
RUN apk update

ADD package.json /app/package.json

# Install Application node dependencies
RUN cd /app && npm install && npm install knex -g

WORKDIR /app

# Bundle app source
COPY  --chown=node . .

EXPOSE 3000

CMD [ "node", "index.js" ]