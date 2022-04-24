import { Request , Response , NextFunction } from 'express';

export class ProxyController<T> {

  /**
  * This function wraps and convert the object which should be a controller or any other object to one that is able to automatically handle promise rejections
  * rethrow them as a caught exception so that it will be handled by the Expess.js middleware or an error handler. This function also automatically binds the function
  * call of each instance method to the original object using the .bind() method.
  * @param {Object} o - The function takes an object with methods that has the signature of a Express RequestHandler and return same controller object
  *     that is now automatically wrapped and converted to handle promise rejections and their context calls binded to the argument passed.
  * @returns {void} Nothing
  **/
  public static create<T>(o : any) : T {

    let aa : any = null;
    let ab : any = null;
    let isSet : boolean = false;
    let listOfProps : string[] = [];

    /** 
      The prototype chain of the object is traversed and the list of all method names is added to an array, then retrieved and then reassigned to the let proxyObject : any = {} 
      with their context call binded to the original object.
    **/
    while (true) {

        if (isSet === false) {
          aa = Object.getPrototypeOf(o);
          isSet = true; }
        else {
          ab = Object.getPrototypeOf(aa);
          if (aa !== null) { let dk = Object.getOwnPropertyNames(aa);
            for (let jd of dk) { if (jd !== 'constructor') listOfProps.push(jd); } }
         
          aa = ab; }
         
      if (aa === null) break; }

    let proxyObject : any = {};

    for (let p in listOfProps) { proxyObject[listOfProps[p]] = o[listOfProps[p]]; }

    for (let ix in proxyObject) {
      if (proxyObject[ix].constructor.name === 'AsyncFunction') {
        proxyObject[ix] = function(...args : any[]) : void { o[ix].bind(o)(...args).catch((err : any) => { throw err; }); } }
      else { 
          try { proxyObject[ix] = o[ix].bind(o); }
          catch (err) { throw err; } } }

    proxyObject = Object.assign(proxyObject , o);
    return proxyObject as T;
   }

}