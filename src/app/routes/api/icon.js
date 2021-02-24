import Router from 'koa-router';
import {iconController} from '../../core/controller/index.js';
const router = new Router();
router.prefix('/');

router.post('/icon/add',iconController.iconAdd);
router.post('/icon/:_id/update',iconController.updateIcon);
router.get('/icon/:_id/delete',iconController.deleteIcon);
export default router;