# Use the official image as a parent image.
FROM node:current-slim

# Set the working directory.
WORKDIR /usr/src/server

COPY * ./

# Run the command inside your image filesystem.
RUN npm install
RUN npm install -g ts-node

# Add metadata to the image to describe which port the container is listening on at runtime.
EXPOSE 8080

# Run the specified command within the container.
CMD [ "npm", "run", "deploy" ]

##
