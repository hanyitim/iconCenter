import Koa from 'koa';
import { PresetMiddleware } from './preset.middleware.js';

export class AppServer extends Koa {
  constructor() {
    super();
    this.presetMiddleware = new PresetMiddleware(this);
    this.presetMiddleware.use();
  }
}
