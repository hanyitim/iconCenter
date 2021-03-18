import Router from 'koa-router';
import {iconController} from '../../core/controller/index.js';
const router = new Router();
router.prefix('/icon');

router.post('/add',iconController.iconAdd);
router.post('/:_id/update',iconController.updateIcon);
router.get('/:_id/delete',iconController.deleteIcon);
export default router;