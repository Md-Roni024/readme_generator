import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonList,
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonLoading,
  IonToast
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { pencilOutline, homeOutline } from 'ionicons/icons';
import { ReadmeService } from '../../services/readme/readme.service';
import { Readme } from '../../models/readme.model';

@Component({
  selector: 'app-readmes',
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonButton,
    IonList,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonLoading
  ],
  templateUrl: './readmes.component.html',
  styleUrls: ['./readmes.component.scss'],
})
export class ReadmesComponent implements OnInit {
  readmes: Readme[] = [];
  isLoading = false;
  showToast = false;
  toastMessage = '';

  constructor(
    private readmeService: ReadmeService,
    private router: Router
  ) {
    addIcons({ pencilOutline, homeOutline });
  }

  ngOnInit() {
    this.fetchReadmes();
  }

  fetchReadmes() {
    this.isLoading = true;
    this.readmeService.getReadmes().subscribe({
      next: (data) => this.readmes = data,
      error: (err) => {
        console.error('Failed to load readmes:', err);
        this.toastMessage = 'Failed to load readmes.';
        this.showToast = true;
      },
      complete: () => this.isLoading = false
    });
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  viewReadme(readme: Readme) {
    // Placeholder for future modal or detail view
    console.log('View readme:', readme);
  }

  editReadme(id: string) {
    this.router.navigate(['/edit-readme', id]);
  }
}
