import { readFileSync } from 'node:fs';
import handlebars from 'handlebars';
import mjml2html from 'mjml';

export interface QData {
  event: string;
  name: string;
  message: string;
}

const template = handlebars.compile(readFileSync(new URL('../views/template.html', import.meta.url), 'utf8'));

export async function render(queue: QData[]): Promise<string> {
  const logs = [...Map.groupBy(queue, (data) => `${data.name} ${data.event}`)].map(([name, items]) => {
    const message = items.map((data) => data.message).join('');
    return { name, message, json: message.trimStart().startsWith('{') };
  });

  const { errors, html } = await mjml2html(template({ logs }));
  if (errors.length > 0) {
    throw new Error(`Invalid MJML template:\n${errors.map((error) => `  ${error.tagName}: ${error.message}`).join('\n')}`);
  }

  return html;
}
