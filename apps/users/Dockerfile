FROM node:24-alpine3.22 As development

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

RUN npm install -f

COPY apps/users apps/users
COPY libs libs

RUN cd apps/users && npm install -f

RUN npm run build users

FROM node:24-alpine3.22 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install -f

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/users/main"]