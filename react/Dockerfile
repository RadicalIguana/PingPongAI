# FROM node:19.8

# WORKDIR /app

# COPY package.json .

# RUN npm i

# COPY . .

# CMD ["npm", "run", "dev"]

# FROM node:18-alpine3.17 as build
# WORKDIR /app
# COPY . /app
# RUN npm install
# RUN npm run build

# FROM ubuntu
# RUN apt-get update
# RUN apt-get install nginx -y
# COPY --from=build /app/dist /var/www/html/
# EXPOSE 80
# CMD ["nginx","-g","daemon off;"]

FROM node:alpine
WORKDIR /app/react
COPY . .
RUN npm install
EXPOSE 5173 4000
CMD npm run dev

