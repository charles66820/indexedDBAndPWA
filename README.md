# Overview

This projet is website for test indexedDB and PWA.

## Worker module link

<https://developer.chrome.com/docs/workbox/modules/>

## Start this application

### With docker

> install dependency packages :

```bash
npm install
```

```bash
# For dev
docker-compose up -d

# For production
docker-compose -f docker-compose.yml -f production.yml up -d
```

> remove : first for update

```bash
docker-compose restart
# or
docker-compose start
```

### With npm

install dependency packages :

```bash
npm install
```

```bash
npm start
```

### Manual

install dependency packages in node_modules

```bash
node src/app.js
```
