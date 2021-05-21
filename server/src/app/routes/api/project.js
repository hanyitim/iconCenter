import Router from 'koa-router';
import {projectController} from '../../core/controller/index.js';
const router = new Router();
router.prefix('/project');

router.post('/add',projectController.add);
router.get('/list',projectController.list);
router.get('/delete',projectController.remove);
router.post('/update',projectController.update);
router.post('/:_id/iconOperate',projectController.iconOperate);

export default router;