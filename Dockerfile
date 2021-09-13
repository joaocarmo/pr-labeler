FROM node:14-slim

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --immutable --production

RUN yarn cache clean --all

ENV NODE_ENV="production"

COPY . .

RUN yarn build

CMD [ "yarn", "start" ]
