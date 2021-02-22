export const saveLocalStorage=(datastring:string,key:string)=>localStorage.setItem(key,datastring);

export const getDataLocalStorage=(key:string)=>localStorage.getItem(key);

export const deleteDataLocalStorage=(key:string)=>localStorage.removeItem(key);
