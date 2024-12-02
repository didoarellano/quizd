FROM node:18-bullseye-slim
RUN apt update -y && apt install -y openjdk-11-jdk bash && \
  rm -rf /var/lib/apt/lists/*
RUN npm install -g firebase-tools
WORKDIR /app
CMD ["firebase", "emulators:start"]
