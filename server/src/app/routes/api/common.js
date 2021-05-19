import Router from 'koa-router';
import {commonController} from '../../core/controller/index.js';
const router = new Router();
router.prefix('/common');

router.post('/upload',commonController.upload);
router.post('/dist',commonController.dist);
export default router;