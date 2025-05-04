import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IonContent, IonItem, IonLabel, 
         IonInput, IonButton, IonIcon, IonCheckbox, IonTextarea, 
         IonLoading, IonToast, ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {add} from 'ionicons/icons';
import { Readme, Skill } from '../../models/readme.model';
import { ReadmeService } from '../../services/readme/readme.service';
import { ReadmeModalComponent } from '../readme-modal/readme-modal.component';

addIcons({add})

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
    IonCheckbox,
    IonTextarea,
    IonLoading,
    IonToast
  ],
  templateUrl: './home.component.html',
  styleUrls: [],
})


export class HomeComponent implements OnInit {
  private readmeService = inject(ReadmeService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private modalCtrl = inject(ModalController);

  isEditMode: boolean = false;
  readmeId: string = '';
  isLoading: boolean = false;
  showToast: boolean = false;
  toastMessage: string = '';
  
  readme: Readme = {
    name: '',
    email: '',
    phone: '',
    optionalPhone: '',
    socialLinks: [],
    skills: [],
    about: ''
  };

  availableSkills: Skill[] = [
    { name: 'JavaScript', checked: false },
    { name: 'TypeScript', checked: false },
    { name: 'Angular', checked: false },
    { name: 'React', checked: false },
    { name: 'Vue', checked: false },
    { name: 'Node.js', checked: false },
    { name: 'Express.js', checked: false },
    { name: 'MongoDB', checked: false },
    { name: 'SQL', checked: false },
    { name: 'Firebase', checked: false },
    { name: 'HTML/CSS', checked: false },
    { name: 'Git', checked: false }
  ];

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.readmeId = params['id'];
        this.isEditMode = true;
        this.loadReadme(this.readmeId);
      }
    });
  }

  loadReadme(id: string) {
    this.isLoading = true;
    this.readmeService.getReadmeById(id).subscribe({
      next: (readme) => {
        if (readme) {
          this.readme = readme;
          this.updateAvailableSkills();
        } else {
          this.router.navigate(['/readmes']);
        }
      },
      error: (err) => {
        console.error('Error loading readme:', err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  updateAvailableSkills() {
    this.availableSkills.forEach(skill => {
      skill.checked = this.readme.skills?.includes(skill.name) || false;
    });
  }

  addSocialLink() {
    if (!this.readme.socialLinks) {
      this.readme.socialLinks = [];
    }
    this.readme.socialLinks.push({ username: '', url: '' });
  }

  removeSocialLink(index: number) {
    if (this.readme.socialLinks) {
      this.readme.socialLinks.splice(index, 1);
    }
  }

  onSkillChange() {
    this.readme.skills = this.availableSkills
      .filter(skill => skill.checked)
      .map(skill => skill.name);
  }

  saveReadme() {
    if (this.readme.name && this.readme.email && this.readme.phone) {
      this.isLoading = true;
  
      if (this.isEditMode) {
        const readmeToUpdate = { ...this.readme };
        delete readmeToUpdate.id; 
  
        this.readmeService.updateReadme(this.readmeId, readmeToUpdate).subscribe({
          next: () => {
            this.isLoading = false;
            this.toastMessage = 'README SUCCESSFULLY UPDATED!';
            this.showToast = true;
            setTimeout(() => {
              this.router.navigate(['/readmes']);
            }, 1000);
          },
          error: (err) => {
            console.error('Error updating readme:', err);
            this.isLoading = false;
            this.toastMessage = 'README FAILED TO UPDATE!';
            this.showToast = true;
          }
        });
      } else {
        // Create new readme
        this.readmeService.saveReadme(this.readme).subscribe({
          next: (id) => {
            this.isLoading = false;
            this.toastMessage = 'README SAVED SUCCESSFULLY!';
            this.showToast = true;
            setTimeout(() => {
              this.router.navigate(['/readmes']);
            }, 1000);
          },
          error: (err) => {
            console.error('Error saving readme:', err);
            this.isLoading = false;
            this.toastMessage = 'README FAILED TO SAVE!';
            this.showToast = true;
          }
        });
      }
    } else {
      this.toastMessage = 'PLEASE INPUT ALL REQUIRED FIELDS!';
      this.showToast = true;
    }
  }
  

  async openReadmeModal() {
    if (!this.readme.name || !this.readme.email || !this.readme.phone) {
      this.toastMessage = 'Name, email, and phone are required.';
      this.showToast = true;
      return;
    }
    const modal = await this.modalCtrl.create({
      component: ReadmeModalComponent,
      componentProps: {
        readme: this.readme
      }
    });
    await modal.present();
  }

  navigateToReadmes() {
    this.router.navigate(['/readmes']);
  }
}