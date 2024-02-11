FROM node:alpine As development

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

RUN npm i -g @nestjs/cli typescript ts-node
RUN npm install -f

COPY apps/schedule-task apps/schedule-task
COPY libs libs

RUN cd apps/schedule-task && npm install -f

RUN npm run build schedule-task

FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./
COPY ./../../wait-for-it.sh /opt/wait-for-it.sh

RUN npm install

COPY --from=development /usr/src/app/dist ./dist

CMD ["/bin/bash", "/opt/wait-for-it.sh postgres:5432 -- npm run migration:run && npm run seed:run"]

CMD ["node", "dist/apps/schedule-task/main"]