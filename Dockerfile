FROM node:16.16 as build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install && npm install -g @nestjs/cli
COPY . .
RUN npm run build


FROM node:16.16-alpine as production
ARG CREDENTIALS
ENV NODE_ENV=production
ENV NODE_PORT=80
WORKDIR /usr/src/app
COPY package*.json ./
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build "/usr/src/app/$CREDENTIALS" ./
ENV APPLICATION_CREDENTIALS="$CREDENTIALS"
RUN npm install
EXPOSE $NODE_PORT
ENTRYPOINT ["node", "dist/main"]