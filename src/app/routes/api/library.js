import Router from 'koa-router';
import {libraryController} from '../../core/controller/index.js';
const router = new Router();
router.prefix('/');

router.post('/library/add',libraryController.addLibrary);
router.post('/library/:id/update',libraryController.updateLibrary);
router.get('/library/list',libraryController.checkLibrary);
router.get('/library/:id/icons',libraryController.libraryIcons);
router.post('/library/:id/delete',libraryController.deleteLibrary);
export default router;



