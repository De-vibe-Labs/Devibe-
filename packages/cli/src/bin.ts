#!/usr/bin/env node
import { runMonacoCli } from "./cli.js";

const result = await runMonacoCli(process.argv);
process.stdout.write(`${result.message}\n`);
process.exit(result.ok ? 0 : 1);
