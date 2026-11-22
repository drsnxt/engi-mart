#!/usr/bin/env node
/**
 * Manual Netlify CLI deploys do not apply the Next.js Runtime function config
 * (routes + runtime API v2). The deployed function therefore runs as a v1
 * Lambda while the generated entry point expects the streaming v2 bootstrap.
 *
 * This script rewrites the generated entry point into a v1-compatible adapter:
 * it runs the OpenNext server handler with an in-memory response stream and
 * returns a normal { statusCode, headers, body } result to Netlify.
 */
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const zipPath = resolve(process.argv[2] ?? '.netlify/functions/___netlify-server-handler.zip');
const workDir = mkdtempSync(join(tmpdir(), 'engi-mart-netlify-function-'));

try {
  execFileSync('unzip', ['-q', zipPath, '-d', workDir]);

  writeFileSync(
    join(workDir, '___netlify-entry-point.mjs'),
    `import { Writable } from 'node:stream';

const chunks = [];
let statusCode = 200;
let headers = {};
let stream;

function makeStream() {
  return new Writable({
    write(chunk, _encoding, callback) {
      chunks.push(Buffer.from(chunk));
      callback();
    },
  });
}

globalThis.awslambda = {
  streamifyResponse: (fn) => fn,
  HttpResponseStream: {
    from: (_stream, meta) => {
      statusCode = meta.statusCode;
      headers = meta.headers || {};
      return stream;
    },
  },
};

const bootstrap = await import('./___netlify-bootstrap.mjs');
const run = bootstrap.getLambdaHandler('./___netlify-server-handler.mjs');

export const handler = async (event, context) => {
  chunks.length = 0;
  statusCode = 200;
  headers = {};
  stream = makeStream();

  try {
    await run(event, stream, context);
    return {
      statusCode,
      multiValueHeaders: headers,
      body: Buffer.concat(chunks).toString('base64'),
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error('Netlify v1 adapter failed', error);
    return {
      statusCode: 500,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
      body: 'Internal Server Error',
    };
  }
};
`,
  );

  // Netlify unzips functions in a way that flattens pnpm symlinks. The
  // generated archive keeps next/react/react-dom at the top level but leaves
  // their pnpm-sibling dependencies inside node_modules/.pnpm/node_modules.
  // Copy those siblings up so Node can resolve them after extraction.
  const pnpmModules = join(workDir, 'node_modules/.pnpm/node_modules');
  if (existsSync(pnpmModules)) {
    for (const entry of readdirSync(pnpmModules)) {
      const source = join(pnpmModules, entry);
      const destination = join(workDir, 'node_modules', entry);
      if (!existsSync(destination)) {
        cpSync(source, destination, { recursive: true, dereference: true });
      }
    }
  }

  // Rebuild the archive from the same directory, replacing the entry point.
  rmSync(zipPath);
  execFileSync('zip', ['-q', '-r', zipPath, '.'], { cwd: workDir });
  console.log(`Patched ${zipPath} for Netlify CLI v1 function invocation`);
} finally {
  rmSync(workDir, { recursive: true, force: true });
}
