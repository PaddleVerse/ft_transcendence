# Use Node.js 20 with Debian Linux as the base image
FROM node:20.6.1-slim

# Set the working directory in the container
WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

RUN npm run build

# Expose the port Nest.js is running on
EXPOSE 3000

# ENTRYPOINT [ "/tools/app/script.sh" ]

# Run the Nest.js application
CMD ["npm", "run", "start:prod"]