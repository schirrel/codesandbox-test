# build stage
FROM node:lts-alpine as build-stage

ARG PORT
ARG IO_SERVER
ARG IO_PROJECT
ARG IO_APP
ARG IO_STAGE
ARG IO_VERSION
ARG IO_DEPLOYER
ARG SENTRY_DSN

ENV VUE_APP_PORT $PORT
ENV VUE_APP_SERVER $IO_SERVER
ENV VUE_APP_PROJECT $IO_PROJECT
ENV VUE_APP_APP $IO_APP
ENV VUE_APP_STAGE $IO_STAGE
ENV VUE_APP_VERSION $IO_VERSION
ENV VUE_APP_DEPLOYER $IO_DEPLOYER
ENV VUE_APP_SENTRY_DSN $SENTRY_DSN

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
