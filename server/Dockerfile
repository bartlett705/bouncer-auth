
FROM node:10.15.3-alpine
WORKDIR /app
COPY . .
RUN npm install
ENTRYPOINT ["npm"]
CMD ["run", "start:production"]
EXPOSE 1339