FROM node:24-alpine3.22

RUN apk add --no-cache bash
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

RUN chmod +x /opt/startup.local.sh /opt/wait-for-it.sh
ENTRYPOINT []
CMD ["/bin/sh", "/opt/startup.local.sh"]
