// Термінал із FORCE_COLOR (так працює npm publish у кольоровому терміналі) фарбує console.log
// дочірніх процесів, і порівняння виводу ламається на \x1B[33m50\x1B[39m.
export const PLAIN_OUTPUT_ENVIRONMENT = { ...process.env, FORCE_COLOR: '0' };
