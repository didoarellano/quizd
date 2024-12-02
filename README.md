# Quiz (WIP)

Create interactive quizzes for in-person or remote classrooms using Markdown.

## Develop

### Install

```
pnpm install
```

### Environment Variables

```
cp client/.env{.example,}
```

Open `./client/.env` in your editor and fill in the values.

### Start the Containers

```
docker-compose up
```

### Run tests

```
docker-compose exec client pnpm test
```

```
docker-compose exec client pnpm test:watch
```
