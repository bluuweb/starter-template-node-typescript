# Starter template

This is a starter template for a simple node.js and typescript project.

## Getting started

```sh
npm init -y
npm i -D typescript tsx @types/node pkgroll
```

## Dir

```
.
├── dist
├── node_modules
├── src
│   └── index.ts
├── package.json
└── tsconfig.json
```

## tsconfig.json

```json
{
  "compilerOptions": {
    "strict": true,
    "outDir": "./dist",
    "moduleDetection": "force",
    "module": "Preserve",
    "resolveJsonModule": true,
    "allowJs": true,
    "esModuleInterop": true,
    "isolatedModules": true
  }
}
```

## package.json

```json
{
  "exports": "./dist/index.js",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "pkgroll",
    "start": "node dist/index.js"
  },
  "devDependencies": {
    "@types/node": "^22.9.0",
    "pkgroll": "^2.5.1",
    "tsx": "^4.19.2",
    "typescript": "^5.6.3"
  }
}
```

## src/index.ts

```ts
console.log("Hello, world!");
```

## Run

```sh
npm run dev
```
