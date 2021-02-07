import Router from 'koa-router';
import {libraryController} from '../../core/controller/index.js';
const router = new Router();
router.prefix('/');

router.post('/library/add',libraryController.postLibraryAdd);
router.post('/library/:id/update',libraryController.updateLibrary);
router.get('/library/list',libraryController.checkLibrary);
router.post('/library/:id/remove',libraryController.removeLibrary);
export default router;



