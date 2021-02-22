export const getCurrentDateString=():string=>{
  const currentTime= Number(new Date());
  return new Date(currentTime).toDateString();
}

export const getHoursAndMinutes=()=>{
    const [hora,minuto]=[new Date().getHours(),new Date().getMinutes()];
    return `${hora.toString()}:${minuto.toString()}`

}
