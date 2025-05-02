// components/home/home.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, 
         IonInput, IonButton, IonIcon, IonCheckbox, IonTextarea, 
         IonList, IonItemGroup, IonItemDivider,IonFooter } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, trashOutline } from 'ionicons/icons';
import { Readme, Skill } from '../../models/readme.model';
import { ReadmeService } from '../../services/readme.service';

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
    IonFooter
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
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
    private router: Router
  ) {
    addIcons({ add, trashOutline });
  }

  addSocialLink() {
    this.readme.socialLinks.push({ username: '', url: '' });
  }

  removeSocialLink(index: number) {
    this.readme.socialLinks.splice(index, 1);
  }

  onSkillChange() {
    this.readme.skills = this.availableSkills
      .filter(skill => skill.checked)
      .map(skill => skill.name);
  }

  saveReadme() {
    if (this.readme.name && this.readme.email && this.readme.phone) {
      this.readmeService.saveReadme(this.readme).subscribe({
        next: (id) => {
          this.router.navigate(['/readmes']);
        },
        error: (err) => {
          console.error('Error saving readme:', err);
        }
      });
    }
  }
}