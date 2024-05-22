# Use Node.js 20 with Alpine Linux as the base image
FROM node:20.6.1-slim

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the port Next.js is running on
EXPOSE 3000

# Run the Next.js application
CMD ["npm", "start"]
