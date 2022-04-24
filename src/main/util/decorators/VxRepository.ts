import { Logger } from 'winston';
import { DataAccessException } from '../../entity/error/DataAccessException';
import SimpleLogger from '../../util/other/Logger';
import { Newable } from '../../entity/interface/Newable';
 
 const logger : Logger = SimpleLogger.getLogger().child({'component' : 'System'});

/** This function traverse the class definition prototype chain to get the list of all property names defined on the prototype object
* making sure their call is automatically wrapped inside another function so that any exception or promise rejection can be and rethrowned as a caught exception.
* @param {Function} Entity - Any function that can be called to construct a new object or a function that can be used in a constructor call. The argument to pass is optional.
* @return {Function} It returns an object with the same structure as the original or passed object but whose member method calls are automatically wrapped to handle exceptions or error.
**/
export function VxRepository(Entity? : Newable<any>) : Function {
  return (target : any) => {

    for (const prop of Object.getOwnPropertyNames(target.prototype)) {

      if (prop === 'constructor') continue;
      const originalMethod = target.prototype[prop];

      if (originalMethod instanceof Function) {
        target.prototype[prop] = async function(...args: any[]) {
          let contextName : string = Object.getPrototypeOf(this).constructor.name;
          try { return await originalMethod.apply(this, args); }
          catch(err : any) { logger.error(`${contextName} : ${err}`);
            throw new DataAccessException(err); }
        };
      }
    }
  };
}