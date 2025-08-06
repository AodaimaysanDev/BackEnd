# Use an official Node.js runtime as a parent image (LTS version is a good choice)
FROM node:18-alpine

# Create and set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to leverage Docker layer caching
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy the rest of your application's source code
COPY . .

# Expose the port the app runs on
EXPOSE 8080

# Define the command to run the application
# This will run "node server.js"
CMD [ "node", "server.js" ]