// components/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, 
         IonInput, IonButton, IonIcon, IonCheckbox, IonTextarea, 
         IonList, IonItemGroup, IonItemDivider, IonFooter, IonBackButton, IonButtons, 
         IonLoading, IonToast, ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, trashOutline, saveOutline, arrowBackOutline, documentTextOutline } from 'ionicons/icons';
import { Readme, Skill } from '../../models/readme.model';
import { ReadmeService } from '../../services/readme.service';
import { ReadmeModalComponent } from '../readme-modal/readme-modal.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
    IonCheckbox,
    IonTextarea,
    IonList,
    IonItemGroup,
    IonItemDivider,
    IonFooter,
    IonBackButton,
    IonButtons,
    IonLoading,
    IonToast
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})


export class HomeComponent implements OnInit {
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

  constructor(
    private readmeService: ReadmeService,
    private router: Router,
    private route: ActivatedRoute,
    private modalCtrl: ModalController
  ) {
    addIcons({ add, trashOutline, saveOutline, arrowBackOutline, documentTextOutline });
  }

  ngOnInit() {
    // Check if there's an ID in the route
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
          // Update the available skills based on the loaded readme
          this.updateAvailableSkills();
          console.log('Loaded readme:', this.readme);
        } else {
          this.toastMessage = 'Readme not found.';
          this.showToast = true;
          this.router.navigate(['/readmes']);
        }
      },
      error: (err) => {
        console.error('Error loading readme:', err);
        this.toastMessage = 'Failed to load readme.';
        this.showToast = true;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  updateAvailableSkills() {
    // Mark skills as checked if they exist in the readme
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
        // Update existing readme
        const readmeToUpdate = { ...this.readme };
        delete readmeToUpdate.id; // Remove ID from the object to update
        
        this.readmeService.updateReadme(this.readmeId, readmeToUpdate)
          .then(() => {
            this.toastMessage = 'Readme updated successfully!';
            this.showToast = true;
            this.isLoading = false; // Stop loading before navigation
            setTimeout(() => {
              this.router.navigate(['/readmes']);
            }, 500); // Small delay to ensure loading is stopped
          })
          .catch(err => {
            console.error('Error updating readme:', err);
            this.toastMessage = 'Failed to update readme.';
            this.showToast = true;
            this.isLoading = false;
          });
      } else {
        // Create new readme
        this.readmeService.saveReadme(this.readme).subscribe({
          next: (id) => {
            this.toastMessage = 'Readme created successfully!';
            this.showToast = true;
            this.isLoading = false; // Stop loading before navigation
            setTimeout(() => {
              this.router.navigate(['/readmes']);
            }, 500); // Small delay to ensure loading is stopped
          },
          error: (err) => {
            console.error('Error saving readme:', err);
            this.toastMessage = 'Failed to save readme.';
            this.showToast = true;
            this.isLoading = false;
          }
        });
      }
    } else {
      this.toastMessage = 'Name, email, and phone are required.';
      this.showToast = true;
    }
  }

  async openReadmeModal() {
    // Check if required fields are filled
    if (!this.readme.name || !this.readme.email || !this.readme.phone) {
      this.toastMessage = 'Name, email, and phone are required.';
      this.showToast = true;
      return;
    }

    // Open modal with the current readme data
    const modal = await this.modalCtrl.create({
      component: ReadmeModalComponent,
      componentProps: {
        readme: this.readme
      },
      cssClass: 'readme-modal'
    });

    await modal.present();
  }
}