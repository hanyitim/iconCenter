import {
    req
} from './request.js';

/* eslint-disable */
let HOST = API;
// let BASE_URL
// if(ENV === 'dev'){
//     HOST = 'http://yapi.feoffice.lizhi.fm/mock/1104';
//     BASE_URL = HOST
// } else {
//     BASE_URL = HOST + '/api'
// }
if(ENV === 'dev'){
    // HOST = 'http://iconfont.yfxn.lizhi.fm';
} 
/* eslint-enable */


export const apiLibraryList = req({
    url:`${HOST}/api/library/list`,
});

export const apiLibraryAdd = req({
    url:`${HOST}/api/library/add`,
    method:'post'
});

export const apiLibraryDelete = req({
    url:`${HOST}/api/library/delete`,
    method:'get'
});

export const apiLibraryUpdate = req({
    url:`${HOST}/api/library/update`,
    method:'post'
});

export const apiLibraryIconImport = (url) => req({
    baseURL:`${HOST}/api/library/`,
    url:`${url}/iconImport`,
    method:'post'
});

export const apiIconImport = req({
    url:`${HOST}/api/icon/import`,
    method:'post'
});

export const apiIconList = req({
    url:`${HOST}/api/icon/list`
});

export const apiIconUpdate = req({
    url:`${HOST}/api/icon/update`,
    method:'post'
});


export const apiIconDelete = req({
    url:`${HOST}/api/icon/delete`,
});


export const apiLibraryDetail = ()=>req({
    baseURL:`${HOST}/api/library/`,
    url:'$path',
});

export const apiDetail = (url)=>req({
    baseURL:`${HOST}/api/`,
    url,
});

export const apiDist = req({
    url:`${HOST}/api/common/dist`,
    method:'post',
    responseType: 'blob'
});
