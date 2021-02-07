import Router from 'koa-router';
import {iconController} from '../../core/controller/index.js';
const router = new Router();
router.prefix('/');

router.post('/icon/add',iconController.iconAdd);
router.post('/icon/:id/update',iconController.updateIcon);
router.get('/icon/:id/detele',iconController.deleteIcon);
router.post('/icon/add',iconController.iconAdd);
export default router;