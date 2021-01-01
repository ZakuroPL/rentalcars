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

  obj:barObject;

  constructor(
    private apiService: ApiService,
    private interaction: InteractionService,
    ) { 
    this.interaction.barMessage$.subscribe(
      (data:barObject) => {
        this.obj = data;
        this.showCarList();
      }
    );
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
    this.isLoading = false;
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
}