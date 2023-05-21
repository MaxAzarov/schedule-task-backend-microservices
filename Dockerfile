FROM node:16.20-buster-slim

RUN npm i -g @nestjs/cli typescript ts-node

COPY package*.json /tmp/app/
RUN cd /tmp/app && npm install

COPY . /usr/src/app
RUN cp -a /tmp/app/node_modules /usr/src/app
COPY ./wait-for-it.sh /opt/wait-for-it.sh
COPY ./startup.local.sh /opt/startup.local.sh

WORKDIR /usr/src/app
RUN rm -rf .env && cp env-example .env
RUN npm run build

CMD ["/bin/bash", "/opt/startup.local.sh"]
