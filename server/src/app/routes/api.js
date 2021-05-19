import Router from 'koa-router';
import {icon, common, library, project} from './api/index.js';

const router = new Router();
router.prefix('/api/');

router.use(icon.routes(), icon.allowedMethods());
router.use(common.routes(),common.allowedMethods());
router.use(library.routes(),library.allowedMethods());
router.use(project.routes(),project.allowedMethods());

router.get('/', async ctx => {
  ctx.body = 'api';
});

export default router;