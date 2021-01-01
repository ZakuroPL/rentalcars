import { Component } from '@angular/core';
import { InteractionService } from './interaction.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  providers: [InteractionService]
})
export class AppComponent {

constructor(public interaction: InteractionService){
  this.interaction.isCar$.subscribe(
    () => {
      let width = window.innerWidth;
      width >= 1000 ? window.scrollTo({top:450}) : window.scrollTo({top:550});
    }
  );
}

}
