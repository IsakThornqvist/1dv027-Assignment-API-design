FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN PRISMA_SKIP_DATABASE_CHECK=1 npx prisma generate
EXPOSE 4000
CMD ["node", "src/app.js"]