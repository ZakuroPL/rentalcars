import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Car, Rental } from '../models';
import { InteractionService } from '../interaction.service';
import { barObject, carObject } from '../models';


@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.sass'],
})
export class CarsComponent implements OnInit {

  cars:Car[];
  carsFilter:Car[];
  rentalList:Rental[];

  choicedCar:number;
  pictureName:string;
  rentPrice:number;
  carName:string;

  checkAmount:number = 0;

  isLoading:boolean = false;
  isChoiced:boolean = false;
  isClicked:boolean = false;
  isConfirm:boolean = false;
  isEmpty:boolean = false;
  isFilterEmpty:boolean = false;

  obj:barObject;

  constructor(
    private apiService: ApiService,
    public interaction: InteractionService,
    ) {
    this.interaction.barMessage$.subscribe(
      (data:barObject) => {
        this.obj = data;
        this.showCarList();
      }
    );
    this.interaction.getFilterEvent().subscribe(()=> this.filter());
  }
  ngOnInit(): void {
  }

  showCarList(){
    this.isEmpty = false;
    this.isConfirm = false;
    this.isLoading = true;
    this.cars = [];
    this.rentalList = [];
    this.apiService.getCarList().subscribe(
      data => {
        this.isChoiced = false;
        this.cars = data;
        this.apiService.getRentalList().subscribe(
          data => {
            this.rentalList = data;
            this.continueCarList();
          },
          error => console.log(error)
        )
      },
      error => console.log(error)
    )
  }
  continueCarList(){
    this.checkAmount = 0;
    this.isEmpty = false;
    let timeZone = new Date().getTimezoneOffset();
    for (let rental of this.rentalList){
      let rentFrom = new Date(rental.rentFrom);
      rentFrom = new Date(rentFrom.getTime() + timeZone * 60000);
      let rentTo = new Date(rental.rentTo);
      rentTo = new Date(rentTo.getTime() + timeZone * 60000);
      // space time between rentals for prepare car for new client 1.5h (60+30(from bar.minuteStep))
      rentFrom = new Date(rentFrom.getTime() - 60 * 60000);
      rentTo = new Date(rentTo.getTime() + 60 * 60000);
      if(this.obj.dateFrom >= rentFrom && this.obj.dateFrom <= rentTo ||
        this.obj.dateTo >= rentFrom && this.obj.dateTo <= rentTo ||
        this.obj.dateFrom <= rentFrom && this.obj.dateTo >= rentTo){
        delete this.cars[rental.car-1];
        this.checkAmount ++;
      }
    }
    this.filter();
    this.isEmpty = this.cars.length == this.checkAmount;
  }
  getCarId(id:number, car:string, price:number, carName:string){
    let obj:carObject = Object.create({
      id: id,
      carName: carName,
      pictureName: car,
      rentPrice: price * this.obj.amountOfDays
    });
    this.interaction.carMessage(obj);
  }
  filter(){
    if(this.cars){
      let num:number = 0;
      this.carsFilter = [];
      this.carsFilter.push.apply(this.carsFilter,this.cars)
      for(let car of this.carsFilter){
        if(!this.interaction.isSmall && car.trunk=="mały") {delete this.carsFilter[car.id - 1]; num++}
        else if(!this.interaction.isMedium && car.trunk=="średni") {delete this.carsFilter[car.id - 1]; num++}
        else if(!this.interaction.isBig && car.trunk=="duży") {delete this.carsFilter[car.id - 1]; num++}
        else if(!this.interaction.isStickShift && car.gearbox=="manualna") {delete this.carsFilter[car.id - 1]; num++}
        else if(!this.interaction.isAutomatic && car.gearbox=="automatyczna") {delete this.carsFilter[car.id - 1]; num++}
        else if(!this.interaction.is95 && car.fuel=="benzyna") {delete this.carsFilter[car.id - 1]; num++}
        else if(!this.interaction.isDiesel && car.fuel=="diesel") {delete this.carsFilter[car.id - 1]; num++}
      }
      this.isFilterEmpty = num == this.carsFilter.length
      this.carsFilter.sort((a:Car, b:Car)=>{
        return a.price-b.price;
      })
    }
    this.isLoading = false;
  }
}
