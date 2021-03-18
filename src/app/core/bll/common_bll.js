import {libraryDal} from '../dal/index.js';
import {svg2font} from '../../js/svg2font/index.js';

export async function dist({id, type, icons}){
    let {data:[library],errors} = await libraryDal.findLibraryRef({_id:id});
    if(library){
        let dist = new svg2font(library.toObject());
    }
}