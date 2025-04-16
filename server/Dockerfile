FROM node:18

# Install required libraries for msnodesqlv8
RUN apt-get update && apt-get install -y \
  unixodbc \
  gcc \
  g++ \
  make \
  python3 \
  libodbc1 \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]
