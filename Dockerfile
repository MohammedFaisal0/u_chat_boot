# Use an official Node.js runtime as the base image
FROM node:20.9.0

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm ci


# Copy the rest of the application code
COPY . .

# Install Next.js globally
RUN npm config set fetch-timeout 60000
RUN npm install -g 



# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm","start"]
