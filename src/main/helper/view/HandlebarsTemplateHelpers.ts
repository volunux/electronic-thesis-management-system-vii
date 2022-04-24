import Moment from 'moment';
import Handlebars from 'handlebars';

export const handlebarsTemplateHelpers =  {

  mDate : function(date : string) : string {
    const dateFormat = 'MMMM Do , YYYY';
    if (date === undefined || date === null) { return "N/A"; }
    return Moment(date).format(dateFormat);
  } ,

  toString : function(x : any) : string {
    return (x === void 0) ? 'undefined' : x.toString();
  } ,

  urlResolver : function(path : string , options : any) : string {
    let url : string = options.data.root.requestUrl;
    if (url === '/') return '';
    let pathArr : string[] = path.split('/');
    let urlArr : string[] = url.split('/');

    urlArr = urlArr.filter((path : string) => {
      if (path !== "") { return true; }
      else { return false; } });

    let newUrl = [];
    for (let i = 0; i < pathArr.length; i++) {
      if (pathArr[i] === "..") { urlArr.pop(); }
      else { newUrl.push(pathArr[i]); }
    }

    let newUrlStr : string = urlArr.join('/') + "/" + newUrl.join('/');
    return newUrlStr;
  } ,

  addToCartButtonSingle : function(id : any , options : any) : any {
    let helpers : any = options.data.exphbs.helpers;
    return helpers.addToCartCustom(id , 'purple' , options);
  } ,

  addToCartButton : function(id : any , options : any) : any {
    let helpers : any = options.data.exphbs.helpers;
    return helpers.addToCartCustom(id , 'blue' , options);
  } ,

  addToCartCustom : function(id : any , color : any , options : any) : string {
    let itemsId : any[] = options.data.root.cartItemsId;
    let elementStr : string = `<button type ="submit" class ="btn-add-to-cart btn-${color}" id ="showsnackbarbutton" > <span class ="fa fa-book"></span> Add to Wishlist </button>`;
    if (itemsId !== null && itemsId !== undefined && Array.isArray(itemsId) && itemsId.length > 0) {
      for (let item of itemsId) {
        if (id === item.item_id) { elementStr = `<button type ="submit" class ="btn-add-to-cart btn-green" id ="showsnackbarbutton" > <span class ="fa fa-check"></span> Added to Cart </button>`;  } } }
    return elementStr;
  } ,

  when : function(operand1 : any, operator : string , operand2 : any , options : any) : boolean {
    let operators : { [key : string] : Function } = {                     //  {{#when <operand1> 'eq' <operand2>}}
      'eq': (l : any , r : any) => l == r,              //  {{/when}}
      'noteq': (l : any , r : any) => l != r,
      'gt': (l : any , r : any) => (+l) > (+r),                        // {{#when var1 'eq' var2}}
      'gteq': (l : any , r : any) => ((+l) > (+r)) || (l == r),        //               eq
      'lt': (l : any , r : any) => (+l) < (+r),                        // {{else when var1 'gt' var2}}
      'lteq': (l : any , r : any) => ((+l) < (+r)) || (l == r),        //               gt
      'or': (l : any , r : any) => l || r,                             // {{else}}
      'and': (l : any , r : any) => l && r,                            //               lt
      '%': (l : any , r : any) => (l % r) === 0                        // {{/when}}
    };

    let result : boolean = operators[operator](operand1 , operand2);
    if (result === true) return options.fn(this);
    return options.inverse(this);
  } ,

  whenAlg : function(operand1 : any, operator : string , operand2 : any , options : any) : boolean {
    let operators : { [key : string] : Function } = {                     //  {{#when <operand1> 'eq' <operand2>}}
      '==': (l : any , r : any) => l == r,              //  {{/when}}
      '===': (l : any , r : any) => l === r,              //  {{/when}}
      '!=': (l : any , r : any) => l != r,
      '!==': (l : any , r : any) => l !== r,
      '>': (l : any , r : any) => (+l) > (+r),                        // {{#when var1 'eq' var2}}
      '>=': (l : any , r : any) => ((+l) > (+r)) || (l == r),        //               eq
      '<': (l : any , r : any) => (+l) < (+r),                        // {{else when var1 'gt' var2}}
      '<=': (l : any , r : any) => ((+l) < (+r)) || (l == r),        //               gt
      '||': (l : any , r : any) => l || r,                             // {{else}}
      '&&': (l : any , r : any) => l && r,                            //               lt
      'mod': (l : any , r : any) => (l % r) === 0                        // {{/when}}
    };

    let result : boolean = operators[operator](operand1 , operand2);
    if (result === true) return options.fn(this);
    return options.inverse(this);

  } ,

  currentYear : function() : number {
    return new Date().getFullYear();
  } ,

  randomButtonColor : function() : string {
    let colors : string[] = ['btn-blue' , 'btn-purple' , 'btn-green' , 'btn-yellow' , 'btn-red' , 'btn-aqua' , 'btn-orange' , 'btn-pink' , 'btn-gray' , 'btn-navy'];
    colors = [...colors , ...colors , ...colors , ...colors , ...colors , ...colors , ...colors , ...colors , ...colors , ...colors];
    return colors[Math.floor(Math.random() * colors.length - 1)];
  } ,

  indexIncr : function(idx : number , multiple : number = 1 , options : any) : number {
    if (multiple > 1) { return idx + multiple; }
     else { return idx + 1; }     
  } ,

  entryValid : function(entryValue : any , options : any) : any {
    if (entryValue === undefined || entryValue === null) { return "N/A"; }
    else { return entryValue; }
  } ,

  getFileSizeKilobyte : function(entryValue : any , options : any) : any {
    if (entryValue === undefined || entryValue === null) { return "N/A"; }
    else { return entryValue / 1024 + "KB"; }
  } ,

  entryCoverImage : function(entryValue : any , options : any) : any {
    if (entryValue === undefined || entryValue === null) { return "/images/thesis-cover-image.jpg"; }
    else { return entryValue; }
  } ,

  toAcronym : function(entryValue : string , options : any) : string {
    if (entryValue === undefined || entryValue === null) return "N/A";

    let acronymText = entryValue.replace(/and|of/gi , '').split(' ');
    if (acronymText.length > 1) {
       return acronymText.map((item) => {
         if (item) { return item[0];  }  
         else { return '';  } }).join(''); }
    else { return acronymText.join('').slice(0 , 3).toUpperCase(); }
  } ,

  arrToString : function(entryValue : string[] , options : any) : string {
    if (!(entryValue instanceof Array)) return "N/A";
    else { return entryValue.join(' '); }
  } ,

  jsonArrayToString : function(entryValue : any[] , key : string , options : any) : string {
    if (!(entryValue instanceof Array)) return "N/A";
    else { return entryValue.map(function(role) : string { return role[key]; }).join(' , '); }
  } ,

  jsonArrayFlattener : function(entryValue : any[] , key : string , options : any) : string[] {
    if (!(entryValue instanceof Array)) return [];
    else { return entryValue.map(function(role) : string { return role[key]; }); }
  } ,

  useIndexAsKey : function(currentItem : any , entries : any[] , index : any , options : any) : boolean {
    if (!(entries instanceof Array)) return options.inverse(this);
    if (entries == null || entries.length < 1) return options.inverse(this);
    if (entries[index] == currentItem) { return options.fn(this); }
    else { return options.inverse(this); }
  } ,

  useIndexAsKeyRole : function(currentItem : any , entries : any[] , index : any , options : any) : boolean {
    if (!(entries instanceof Array)) return options.inverse(this);
    if (entries == null || entries.length < 1) return options.inverse(this);
    else { return options.inverse(this); }
    for (let cItem of entries) {
      if (cItem == currentItem) { return options.fn(this); }
      else { return options.inverse(this); }
    }
  } ,

  canPaginate : function(index : any , entries : any[] , options : any) : boolean {
    if (entries == null || entries.length < 1) return options.inverse(this);
    if (index != entries.length - 1 && entries.length > 1 && entries.length > 10) return options.fn(this);
    else if (index == entries.length - 1) { return options.fn(this); }
    return options.inverse(this);
  } ,

  math : function(lvalue : string , operator : string , rvalue : string, options : any) {
    if (arguments.length < 4) {
        // Operator omitted, assuming "+"
        options = rvalue;
        rvalue = operator;
        operator = "+";
    }
        
    let clValue : number = parseFloat(lvalue);
    let cRValue : number = parseFloat(rvalue);
        
    return {
        "+": lvalue + rvalue,
        "-": clValue - cRValue,
        "*": clValue * cRValue,
        "/": clValue / cRValue,
        "%": clValue % cRValue
    }[operator];
}

}
