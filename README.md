# pm2-notify

Error log email notifier for PM2

## Installation

```sh
npm i
```

## Configuration

- Create a `.env` file
  - Rename the [.env.sample](.env.sample) file to `.env` to fix it.
- See [src/config.ts](src/config.ts) and edit

## Start

```sh
$ npm start
# OR
$ npm run build
$ npm run pm2:start
```

### Using

- [MJML](https://mjml.io) for Email Markup
- [Handlebars](https://handlebarsjs.com) for Template Parser
- [Nodemailer](https://nodemailer.com) for Sending Mail
