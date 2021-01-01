import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Car, Rental } from './models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  carURL = "https://zakuro-warehouse.herokuapp.com/api/car/"
  searchURL = "https://zakuro-warehouse.herokuapp.com/api/rental-search/"
  rentURL = "https://zakuro-warehouse.herokuapp.com/api/rental-full/"

  // carURL = "http://127.0.0.1:8000/api/car/"
  // searchURL = "http://127.0.0.1:8000/api/rental-search/"
  // rentURL = "http://127.0.0.1:8000/api/rental-full/"
   

  constructor(
    private httpClient: HttpClient,
  ) { }

  getCarList(){
    return this.httpClient.get<Car[]>(this.carURL);
  }
  getRentalList(){
    return this.httpClient.get<Rental[]>(this.searchURL);
  } 
  postRent(formData){
    return this.httpClient.post(this.rentURL, formData);
  }
}
