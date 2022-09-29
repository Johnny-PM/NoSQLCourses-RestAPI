FROM node:latest

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

# copying all the files from your file system to container file system
COPY package.json .

# install all dependencies
RUN npm install

# copy other files as well
COPY ./ .

#expose the port
EXPOSE 3081

# command to run when intantiate an image
CMD ["node","server.js"]