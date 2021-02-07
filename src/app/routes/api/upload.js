import Router from 'koa-router';
import {uploadController} from '../../core/controller/index.js';
const router = new Router();
router.prefix('/');

router.post('/upload',uploadController.upload);
export default router;