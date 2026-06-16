#!/usr/bin/env node
import { runCommand } from './cli-core';

const readStdin = async (): Promise<string | null> => {
  if (process.stdin.isTTY) {
    return null;
  }

  let data = '';
  for await (const chunk of process.stdin) {
    data += String(chunk);
  }
  return data || null;
};

const main = async (): Promise<void> => {
  const stdin = await readStdin();
  const { code, stdout, stderr } = runCommand(process.argv.slice(2), stdin);
  if (stdout) {
    process.stdout.write(stdout);
  }
  if (stderr) {
    process.stderr.write(stderr);
  }
  process.exit(code);
};

void main();
