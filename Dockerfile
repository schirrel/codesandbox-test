# build stage
FROM node:lts-alpine as build-stage
ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
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
