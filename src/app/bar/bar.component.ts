import { Component, OnInit, HostListener } from '@angular/core';
import {NgbDate, NgbCalendar, NgbDateParserFormatter, NgbTimeStruct, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { InteractionService } from '../interaction.service';
import { barObject } from '../models';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.sass']
})
export class BarComponent implements OnInit {

  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  todayDate: NgbDateStruct;
  dateMaxToRent: NgbDateStruct;

  timeFrom: NgbTimeStruct = {hour: 10, minute: 0, second: 0};
  timeTo: NgbTimeStruct = {hour: 10, minute: 0, second: 0};
  minuteStep = 30;

  // new Date with time
  dateFrom: Date;
  dateTo: Date;
  amountOfDays: number;

  screenWidth:number ;

  constructor(
    private interaction: InteractionService,
    private calendar: NgbCalendar, 
    public formatter: NgbDateParserFormatter) {
    this.fromDate = calendar.getNext(calendar.getToday(), 'd', 1)
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 8);
  }
  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    let todayDate = new Date;
    let dateMaxToRent = new Date(todayDate.getTime() + (1000 * 60 * 60 * 24 * 90));
    this.todayDate = { day: todayDate.getDate(), month: todayDate.getMonth() + 1, year: todayDate.getFullYear()};
    this.dateMaxToRent = { day: dateMaxToRent.getDate(), month: dateMaxToRent.getMonth() + 1, year: dateMaxToRent.getFullYear()};
  }
  @HostListener('window:resize')
  changeCalendar() {
    this.screenWidth = window.innerWidth;
  }
//boostrap datepicker
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }
//boostrap datepicker
  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }
//boostrap datepicker
  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }
//boostrap datepicker
  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }
//boostrap datepicker
  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  buttonFunction(){
    this.dateFrom = new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day, this.timeFrom.hour, this.timeFrom.minute);
    this.dateTo = new Date(this.toDate.year, this.toDate.month - 1, this.toDate.day, this.timeTo.hour, this.timeTo.minute);
    this.amountOfDays = (this.dateTo.getTime() - this.dateFrom.getTime())/86400000;
    this.amountOfDays = Math.ceil(this.amountOfDays);
    let obj:barObject = Object.create({
      dateFrom: this.dateFrom,
      dateTo: this.dateTo,
      amountOfDays: this.amountOfDays
    });
    this.interaction.barMessage(obj);
  }

}
