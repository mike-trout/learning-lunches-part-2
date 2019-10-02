# Using Alpine Linux with Node.js installed as the base
FROM node:alpine

# Set the working directory to /app within the context
# of the Docker image
WORKDIR /app

# Copy the files required to install dependencies into the
# working directory
COPY package.json ./
COPY package-lock.json ./

# Run npm install to install the dependencies defined in
# package.json
RUN npm install

# Copy our app source code into the container image
COPY *.js ./

# Expose port 8080 from the running container
EXPOSE 8080

# Set our entrypoint when the container is run
ENTRYPOINT [ "node", "index.js" ]
