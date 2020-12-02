import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../api.service';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.sass']
})
export class CarsComponent implements OnInit {

  eventSubscription:Subscription;
  cars: any;
  rentalList: any;
  rentalForm: FormGroup;
  @Input() dateFrom: Date;
  @Input() dateTo: Date;
  @Input() amountOfDays: number;

  choicedCar:number;
  pictureName:string;
  rentPrice:number;
  carName:string;

  checkAmount:number = 0;

  isLoading = false;
  isChoiced = false;
  isClicked = false;
  isConfirm = false;
  isEmpty = false;

  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder
    ) { 
    this.eventSubscription = this.apiService.getEvent().subscribe(()=>{
      this.showCarList();
    });

  }
  ngOnInit(): void {
    this.rentalForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: [null, [Validators.required, Validators.pattern("[0-9]{9}")]],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]]
    })
  }
  get f() { return this.rentalForm.controls; }

  showCarList(){
    this.rentalForm.reset();
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
      if(this.dateFrom >= rentFrom && this.dateFrom <= rentTo ||
        this.dateTo >= rentFrom && this.dateTo <= rentTo ||
        this.dateFrom <= rentFrom && this.dateTo >= rentTo){
        delete this.cars[rental.car-1];
        this.checkAmount ++;
      }
    }
    this.isLoading = false;
    console.log(this.cars);
    if(this.cars.length == this.checkAmount) this.isEmpty = true;
  }
  getCarId(id, car, price, carName){
    this.isClicked = false;
    // window.scrollTo({ top: 100, behavior: 'smooth' })
    this.carName = carName;
    this.pictureName = car;
    this.choicedCar = id;
    this.rentPrice = price * this.amountOfDays
    this.isChoiced =true;
    let width = window.innerWidth;
    if (width >= 1000) window.scrollTo({top:450});
    else window.scrollTo({top:550});
  }
  sendForm(){
    this.isClicked = true;
    if(this.rentalForm.invalid) return;
    let timeZone = new Date().getTimezoneOffset();
    this.dateFrom =  new Date(this.dateFrom.getTime() - timeZone * 60000);
    this.dateTo =  new Date(this.dateTo.getTime() - timeZone * 60000);
    var formData: any = new FormData();
    formData.append("car", this.choicedCar);
    formData.append("rentFrom", this.dateFrom.toISOString())
    formData.append("rentTo", this.dateTo.toISOString())
    formData.append("firstName", this.rentalForm.get('firstName').value);
    formData.append("lastName", this.rentalForm.get('lastName').value);
    formData.append("phoneNumber", this.rentalForm.get('phoneNumber').value);
    formData.append("email", this.rentalForm.get('email').value);
    this.apiService.postRent(formData).subscribe(
      data => {
        this.isChoiced = false
        this.isConfirm = true},
      error => console.log(error)
    )
  }
}