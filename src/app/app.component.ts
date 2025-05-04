import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ReadmesComponent } from './components/readmes/readmes.component';
import { ReadmeModalComponent } from './components/readme-modal/readme-modal.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent {
  title = 'readme-generator';
}