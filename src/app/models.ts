export interface Car{
    id:number;
    car:string;
    carPicture:string;
    seats:number;
    trunk:string;
    price:number;
    fuel:string;
    gearbox:string;
  }
  export interface Rental{
    id:number;
    car:number;
    rentFrom:Date;
    rentTo:Date;
  }
  export interface barObject{
    dateFrom:Date;
    dateTo:Date;
    amountOfDays:number;
  }
  export interface carObject{
    id:number;
    carName:string;
    pictureName:string;
    rentPrice:number;
  }