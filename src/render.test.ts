import assert from 'node:assert/strict';
import { test } from 'node:test';

import { render } from './render.ts';

test('render groups logs per app and escapes them', async () => {
  const html = await render([
    { event: 'log:err', name: 'api', message: 'Error: <b>boom</b>\n' },
    { event: 'log:err', name: 'web', message: '{"level":"error"}\n' },
    { event: 'log:err', name: 'api', message: '    at main.ts:1\n' },
  ]);

  assert.equal(html.split('api log:err').length, 2);
  assert.match(html, /Error: &lt;b&gt;boom&lt;\/b&gt;\n {4}at main\.ts:1/u);
  assert.equal(html.split('white-space:pre-wrap').length, 2);
});
