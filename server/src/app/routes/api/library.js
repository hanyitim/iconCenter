import Router from 'koa-router';
import {libraryController} from '../../core/controller/index.js';
const router = new Router();
router.prefix('/library');

router.get('/list',libraryController.libraryList);
router.post('/add',libraryController.addLibrary);
router.post('/update',libraryController.updateLibrary);
router.get('/delete',libraryController.deleteLibrary);
router.get('/:_id',libraryController.libraryDetail);
export default router;



