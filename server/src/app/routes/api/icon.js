import Router from 'koa-router';
import {iconController} from '../../core/controller/index.js';
const router = new Router();
router.prefix('/icon');

router.post('/import',iconController.iconImport);
router.post('/update',iconController.updateIcon);
router.get('/delete',iconController.deleteIcon);
router.get('/list',iconController.iconList);
router.get('/abandon',iconController.iconAbandon);
router.post('/operatepid',iconController.iconOperatePID);

export default router;