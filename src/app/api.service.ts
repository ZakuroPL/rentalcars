import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  carURL = "https://zakuro-warehouse.herokuapp.com/api/car/"
  searchURL = "https://zakuro-warehouse.herokuapp.com/api/rental-search/"
  rentURL = "https://zakuro-warehouse.herokuapp.com/api/rental-full/"
  

  constructor(
    private httpClient: HttpClient,
  ) { }

  getCarList(){
    return this.httpClient.get(this.carURL);
  }
  getRentalList(){
    return this.httpClient.get(this.searchURL);
  } 
  postRent(formData){
    return this.httpClient.post(this.rentURL, formData);
  }


  private subject = new Subject<any>();

  sendEvent(){
    this.subject.next()
  }
  getEvent():Observable<any>{
    return this.subject.asObservable();
  }
}
