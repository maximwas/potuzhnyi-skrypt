#!/usr/bin/env node
import { createPotuzhnoContainer } from '../src/container.ts';

const { commandLine } = createPotuzhnoContainer().cradle;

process.exitCode = await commandLine.run(process.argv.slice(2));
