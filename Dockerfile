# build stage
FROM node:lts-alpine as build-stage

ARG PORT
ARG SERVER
ARG STAGE
ARG VERSION
ARG DEPLOYER
ARG ERRBIT

ENV VUE_APP_PORT $PORT
ENV VUE_APP_SERVER $SERVER
ENV VUE_APP_STAGE $STAGE
ENV VUE_APP_VERSION $VERSION
ENV VUE_APP_DEPLOYER $DEPLOYER
ENV VUE_APP_ERRBIT $ERRBIT

WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# release stage
FROM nginx:stable-alpine as release-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]
