import RedisCacheManager from '../cache/RedisCacheManager';
import { GeneralFilter } from '../../helper/filter/GeneralFilter';

export function Cache(timeout : number , type? : string , fields? : string[] | undefined) {

return function cache(target : Object , methodName : string , descriptor : PropertyDescriptor) {

 let cacheManager : RedisCacheManager = RedisCacheManager.getInstance();
 const originalMethod = descriptor.value;

 if ((!fields) || (fields && fields.length < 1)) fields = ['_id' , 'name'];

 if (!(descriptor?.value instanceof Function)) { throw new Error("Decorated parameter must be a method or function or callable"); }
  descriptor.value = async function(...args : any[]) {
    let key : string = (this.constructor.name) + methodName;
    let data : string = await cacheManager.getData(key);
    if (data !== null && Object.keys(data).length > 0) {
      if (type === 'object') { return JSON.parse(data); }
      else { return data; }
    }

    let returned : any = await originalMethod.apply(this , args);
    if (Array.isArray(returned)) returned = GeneralFilter.arrayOfCusObjectFieldFilter(fields ? fields : [] , returned);
    cacheManager.setData(key , returned , timeout);
    return returned;
 }

} }