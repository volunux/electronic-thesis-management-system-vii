export class GeneralFilter {

  /**
   * 
   * @param {string[]} allowed - This indicates only the properties which would be returned in the new array of objects
   * @param {any[]} entries - The object to be filtered
   * @returns {any[]} It returns a new object containing only properties which was passed as allowed arguments during the function call.
   */
  public static arrayOfCusObjectFieldFilter(allowed: string[], entries: any[]): any[] {
    if (entries.length > 0)
      return JSON.parse(JSON.stringify(entries, allowed));
    else
      return [];
  }
}