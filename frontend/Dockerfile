FROM node:latest AS builder

WORKDIR /app

ARG SOCKET_URL
ENV NEXT_PUBLIC_SOCKET_URL=${SOCKET_URL}

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:latest

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next

EXPOSE 3000
CMD [ "npm", "run", "start" ]
