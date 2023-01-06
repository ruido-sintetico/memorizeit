# syntax=docker/dockerfile:1
FROM pawate95/mongo_node
WORKDIR home/
COPY . .
RUN yarn install -y
CMD ["node", "./server.js"]
EXPOSE 3000
