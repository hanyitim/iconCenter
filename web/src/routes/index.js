import {lazy} from 'react';
import {LIST_BY_LIBRARYID} from '@/js/const.js';

//main
const Index = lazy(()=> import(/* webpackChunkName: "Index" */ '@/page/index/index.jsx'));
// const Details = lazy(()=> import(/* webpackChunkName: "Index" */ '@/page/details/index.jsx'));
const Tool = lazy(()=> import(/* webpackChunkName: "Index" */ '@/page/tool/index.jsx'));
const PreviewFont = lazy(()=> import(/* webpackChunkName: "Tool2" */ '@/page/previewFont/index.jsx'));

export let redirect = `/index/${LIST_BY_LIBRARYID}/`;
export const routes = [
    {
        path:'/index/:type/:id',
        comp:Index,
    },
    // {
    //     path:'/details/:type/:id',
    //     comp:Details
    // },
    {
        path:'/tool',
        comp:Tool
    },
    {
        path:'/preview-font',
        comp:PreviewFont
    }
];
