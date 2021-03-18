import Router from 'koa-router';
import {libraryController} from '../../core/controller/index.js';
const router = new Router();
router.prefix('/library');

router.get('/list',libraryController.libraryList);
router.post('/add',libraryController.addLibrary);
router.get('/:_id',libraryController.libraryDetail);
router.post('/:_id/update',libraryController.updateLibrary);
router.get('/:_id/delete',libraryController.deleteLibrary);
router.post('/:_id/iconImport',libraryController.libraryIconImport);
router.get('/:_id/iconRemove',libraryController.libraryIconRemove);
export default router;



