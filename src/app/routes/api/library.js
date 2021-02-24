import Router from 'koa-router';
import {libraryController} from '../../core/controller/index.js';
const router = new Router();
router.prefix('/');

router.get('/library/list',libraryController.libraryList);
router.post('/library/add',libraryController.addLibrary);
router.get('/library/:_id',libraryController.libraryDetail);
router.post('/library/:_id/update',libraryController.updateLibrary);
router.get('/library/:_id/delete',libraryController.deleteLibrary);
router.post('/library/:_id/iconImport',libraryController.libraryIconImport);
router.get('/library/:_id/iconRemove',libraryController.libraryIconRemove);
export default router;



