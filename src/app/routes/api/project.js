import Router from 'koa-router';
import {projectController} from '../../core/controller/index.js';
const router = new Router();
router.prefix('/');

router.post('/project/add',projectController.addProject);
router.post('/project/:_id/update',projectController.updateProject);
router.get('/project/list',projectController.projectList);
router.get('/project/:_id/delete',projectController.deleteProject);

export default router;