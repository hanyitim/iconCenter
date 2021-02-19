import Router from 'koa-router';
import {iconController} from '../../core/controller/index.js';
const router = new Router();
router.prefix('/');

router.post('/icon/add',iconController.iconAdd);
router.get('/icon/list',iconController.iconList);
router.post('/icon/:id/update',iconController.updateIcon);
router.get('/icon/:id/delete',iconController.deleteIcon);
router.post('/icon/toProject',iconController.iconToProjectOperation);
export default router;