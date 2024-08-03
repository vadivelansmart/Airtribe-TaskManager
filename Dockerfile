# Use the official Node.js image from the Docker Hub as the base image
FROM node:latest

# Create and set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock) to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code to the working directory
COPY . .

# Expose the port that your application will run on
EXPOSE 3000

# Define the command to run your application
CMD [ "npm", "start" ]
