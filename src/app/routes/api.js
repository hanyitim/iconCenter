import Router from 'koa-router';
import {icon, upload, library} from './api/index.js';

const router = new Router();
router.prefix('/api/');

router.use(icon.routes(), icon.allowedMethods());
router.use(upload.routes(),upload.allowedMethods());
router.use(library.routes(),library.allowedMethods());

router.get('/', async ctx => {
  ctx.body = 'api';
});

export default router;