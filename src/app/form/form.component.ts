import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { InteractionService } from '../interaction.service';
import { barObject, carObject } from '../models';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.sass']
})
export class FormComponent implements OnInit {

  rentalForm: FormGroup;

  isLoading:boolean = false;
  isChoiced:boolean = false;
  isClicked:boolean = false;

  obj:barObject;
  obj2:carObject;


  constructor(
    private apiService: ApiService,
    private interaction: InteractionService,
    private formBuilder: FormBuilder
    ) { 
      this.interaction.barMessage$.subscribe(
        (data:barObject) => {
          this.obj = data;
          this.isChoiced = false;
          this.isClicked = false;
        }
      );
      this.interaction.carMessage$.subscribe(
        (data:carObject) => {
          this.obj2 = data;
        }
      );
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

  sendForm(){
    this.isClicked = true;
    if(this.rentalForm.invalid) return;
    let timeZone = new Date().getTimezoneOffset();
    this.obj.dateFrom =  new Date(this.obj.dateFrom.getTime() - timeZone * 60000);
    this.obj.dateTo =  new Date(this.obj.dateTo.getTime() - timeZone * 60000);
    var formData: any = new FormData();
    formData.append("car", this.obj2.id);
    formData.append("rentFrom", this.obj.dateFrom.toISOString())
    formData.append("rentTo", this.obj.dateTo.toISOString())
    formData.append("firstName", this.rentalForm.get('firstName').value);
    formData.append("lastName", this.rentalForm.get('lastName').value);
    formData.append("phoneNumber", this.rentalForm.get('phoneNumber').value);
    formData.append("email", this.rentalForm.get('email').value);
    this.apiService.postRent(formData).subscribe(
      data => {
        this.isChoiced = true
        this.rentalForm.reset();
        this.isClicked = false;
    },
      error => console.log(error)
    )
  }
}
