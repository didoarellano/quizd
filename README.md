# Quiz (WIP)

Create interactive quizzes for in-person or remote classrooms using Markdown.

## Develop

### Install

```
pnpm install
```

_If firebase/functions dependencies aren't installed run:_

```
pnpm run post-install
```

### Environment Variables

```
cp .env{.example,}
```

Open `.env` in your editor and fill in the values.

### Start the Servers

These currently need to be run separately for the Firebase emulator to export data properly on exit.

1. Firebase Emulator

```
pnpm run emulators
```

2. Vite dev server & cloud functions compiler

```
pnpm run dev
```

### Run tests

```
pnpm test
```
