function factory(comand){
    return async function(model,conditions,update){
        let body = {};
        try{
            let dbData = await model[comand](conditions,update);
            body.data = dbData;
        }catch(e){
            body.error = e;
        }
        return body;
    }
}

export async function findDataPopulation(model,conditions,path){
    let body = {}
    
    try{
        let dbData = await model.find(...conditions).populate(path);
        body.data = dbData;
    }catch(e){
        body.error = e;
    }
    return body;
}
    


export const addData = factory('insertMany');
export const updateData = factory('updateOne');
export const removeData = factory('remove');
export const findData = factory('find');

