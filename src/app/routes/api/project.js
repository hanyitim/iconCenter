import Router from 'koa-router';
import {projectController} from '../../core/controller/index.js';
const router = new Router();
router.prefix('/');

router.post('/project/add',projectController.addProject);
export default router;