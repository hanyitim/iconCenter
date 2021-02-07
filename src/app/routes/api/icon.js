import Router from 'koa-router';
import {iconController} from '../../core/controller/index.js';
const router = new Router();
router.prefix('/');

router.get('/icon/:icon_id',iconController.getIconInfo);
router.post('/icon/add',iconController.postIconAdd);
export default router;