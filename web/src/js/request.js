import Axios from 'axios';
import qs from 'qs';

let toastLoadingCount = 0;
Axios.interceptors.request.use((config)=>{
    if(config.hasLoading){
        if(toastLoadingCount === 0){
            // window.Toast.loading('加载中...',0);
        }
        toastLoadingCount+=1;
    }
    return config;
});
Axios.interceptors.response.use((response) => {
    let {data:res,config,headers} = response;
    //loading hide
    console.log(config);
    if(config.hasLoading){
        toastLoadingCount-=1;
        if(toastLoadingCount === 0){
            // window.Toast.hide();
        }
    }
    if(headers['content-type'] === 'application/octet-stream'){
        return res;
    }
    if(res.rCode !== 0 || response.status !== 200){
        return Promise.reject(response.data.msg || '系统异常');
    }
    return res.data;
});
/**
 * request 工厂
 * @param {*} requireOption   axios config
 * @return function(data) 
 */
export function req(requireOption){
    return (data,subUrl) =>{
        switch(requireOption.method){
            case 'get':
                requireOption.params = data;
                break;
            case 'post':
                requireOption.data = qs.stringify(data);
                break;
            default:
                requireOption.params = data;
                break;
        }
        if(subUrl){
            requireOption.url = requireOption.url.replace('$path',subUrl);
        }
        return Axios({
            ...requireOption
        });
    };
}
