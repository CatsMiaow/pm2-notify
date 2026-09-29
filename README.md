# pm2-notify

Batched email notifier for PM2 error logs

## Requirements

- Node.js >= 24 (runs TypeScript directly via [type stripping](https://nodejs.org/api/typescript.html#type-stripping), no build step)
- An SMTP server that supports STARTTLS

## Installation

```sh
npm i
```

## Configuration

Copy [.env.sample](.env.sample) to `.env` in the project root and fill in your values.

| Variable | Description |
| --- | --- |
| `SMTP_HOST`, `SMTP_PORT` | SMTP server (default `smtp.gmail.com:587`). Port 465 uses TLS from the start, other ports require STARTTLS |
| `SMTP_USER`, `SMTP_PASS` | SMTP credentials |
| `MAIL_FROM`, `MAIL_TO` | Sender and recipients. Required |
| `PM2_APPS` | Comma-separated names (`--name`) of the PM2 apps whose stderr is sent |
| `PM2_OUT_APPS` | Same as `PM2_APPS`, for apps whose stdout is sent. At least one of the two is required |
| `SEND_INTERVAL` | How long to collect logs before sending them in one mail, in seconds from 1 to 86400 (default `10`) |

## Customizing the mail

The mail is rendered from [views/template.html](views/template.html) (MJML with Handlebars). After editing it, run `npm run mail:preview` to receive a mail with sample logs and check it in your mail client, without starting the app. It needs only the SMTP and `MAIL_*` settings, and if the template is not valid MJML it fails and lists the problems.

## Usage

```sh
npm run mail:preview   # Send a preview mail rendered with the current template
npm start              # Lint, type check, then run in the foreground
# OR
npm run pm2:start      # Run under PM2
npm run pm2:delete     # Stop and remove it from PM2
```

## Development

```sh
npm run lint           # Oxlint (type-aware)
npm run typecheck      # tsc
npm test               # node:test
```

## Built with

- [MJML](https://mjml.io) for email markup
- [Handlebars](https://handlebarsjs.com) for templating
- [Nodemailer](https://nodemailer.com) for sending mail

## License

[MIT](LICENSE)
