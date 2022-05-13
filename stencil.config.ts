import { Config } from '@stencil/core';
import { readFileSync } from 'fs';

// https://stenciljs.com/docs/config

export const config: Config = {
  devServer: {
    openBrowser: false,
    https: {
      cert: readFileSync('localhost.crt', 'utf8'),
      key: readFileSync('localhost.key', 'utf8'),
    },
  },
  globalStyle: 'src/global/app.css',
  globalScript: 'src/global/app.ts',
  taskQueue: 'async',
  outputTargets: [
    {
      type: 'www',
      // comment the following line to disable service workers in production
      serviceWorker: null,
      baseUrl: 'https://recover.peterboroughtenants.app',
    },
  ],
};
