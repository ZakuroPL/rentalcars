import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { barObject, carObject } from './models';

@Injectable()
export class InteractionService {

  private barObject = new Subject<barObject>();
  barMessage$ = this.barObject.asObservable();

  private carObject = new Subject<carObject>();
  carMessage$ = this.carObject.asObservable();

  private  isCarSubject = new BehaviorSubject<boolean>(true);
  isCar$: Observable<boolean> = this.isCarSubject.asObservable();

  private filterSubject = new Subject<any>();

  isSmall:boolean = true;
  isMedium:boolean = true;
  isBig:boolean = true;
  isStickShift:boolean = true;
  isAutomatic:boolean = true;
  is95:boolean = true;
  isDiesel:boolean = true;

  constructor() { }

  barMessage(obj:barObject){
    this.isCarSubject.next(true);
    this.barObject.next(obj);
  }
  carMessage(obj:carObject){
    this.isCarSubject.next(false);
    this.carObject.next(obj);
  }
  backMessage(){
    this.isCarSubject.next(true);
  }
  sendFilterEvent(){
    this.filterSubject.next()
  }
  getFilterEvent():Observable<any>{
    return this.filterSubject.asObservable();
  }
}
