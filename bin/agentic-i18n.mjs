#!/usr/bin/env node
import process from 'node:process';
import { runCli } from '../src/cli.mjs';

runCli(process.argv).catch(err => {
  console.error('Fatal CLI Error:', err);
  process.exit(1);
});
