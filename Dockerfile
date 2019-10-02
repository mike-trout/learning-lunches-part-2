# Using Alpine Linux with Node.js installed as the base
FROM node:alpine

# Use a non-priviledged user
USER node:node

# Set the working directory to /home/node within the context
# of the Docker image
WORKDIR /home/node

# Copy the files required to install dependencies into the
# working directory
COPY --chown=node:node package.json ./
COPY --chown=node:node package-lock.json ./

# Run npm install to install the dependencies defined in
# package.json
RUN npm install

# Copy our app source code into the container image
COPY --chown=node:node *.js ./

# Expose port 8080 from the running container
EXPOSE 8080

# Set our entrypoint when the container is run
ENTRYPOINT [ "node", "index.js" ]
