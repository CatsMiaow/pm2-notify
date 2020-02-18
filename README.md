# pm2-notify
PM2 Error log email notifier

### Installation
```sh
$ npm ci
```

### Configuration
- Edit [src/config.ts](src/config.ts)

### Start
```sh
$ npm start
# OR
$ npm run build
$ npm run pm2:start
```

### Using
* [MJML](https://mjml.io) for Email Markup
* [Handlebars](https://handlebarsjs.com) for Template Parser
* [Nodemailer](https://nodemailer.com) for Sending Mail
