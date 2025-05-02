// components/readme-modal/readme-modal.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalController } from '@ionic/angular/standalone';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, 
         IonIcon, IonButtons, IonTextarea, IonToast } from '@ionic/angular/standalone';
import { Readme } from '../../models/readme.model';
import { addIcons } from 'ionicons';
import { copyOutline, downloadOutline, closeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon,
    IonButtons,
    IonTextarea,
    IonToast
  ],
  templateUrl: './readme-modal.component.html',
  styleUrls: ['./readme-modal.component.scss'],
})


export class ReadmeModalComponent implements OnInit {
  @Input() readme!: Readme;
  generatedReadme: string = '';
  showToast: boolean = false;
  toastMessage: string = '';

  constructor(private modalCtrl: ModalController) {
    addIcons({ copyOutline, downloadOutline, closeOutline });
  }

  ngOnInit() {
    this.generateReadmeContent();
  }

  generateReadmeContent() {
    // Generate README markdown based on the provided readme object
    this.generatedReadme = `# ${this.readme.name}'s Profile

## Contact Information
- Email: ${this.readme.email}
- Phone: ${this.readme.phone}
${this.readme.optionalPhone ? `- Alternative Phone: ${this.readme.optionalPhone}` : ''}

## Social Links
${this.generateSocialLinksSection()}

## Skills
${this.generateSkillsSection()}

## About Me
${this.readme.about || 'No information provided.'}
`;
  }

  generateSocialLinksSection(): string {
    if (!this.readme.socialLinks || this.readme.socialLinks.length === 0) {
      return 'No social links provided.';
    }

    return this.readme.socialLinks
      .filter(link => link.username && link.url)
      .map(link => `- [${link.username}](${link.url})`)
      .join('\n');
  }

  generateSkillsSection(): string {
    if (!this.readme.skills || this.readme.skills.length === 0) {
      return 'No skills provided.';
    }

    return this.readme.skills.map(skill => `- ${skill}`).join('\n');
  }

  async copyToClipboard() {
    try {
      await navigator.clipboard.writeText(this.generatedReadme);
      this.toastMessage = 'README copied to clipboard!';
      this.showToast = true;
    } catch (err) {
      console.error('Failed to copy:', err);
      this.toastMessage = 'Failed to copy README.';
      this.showToast = true;
    }
  }

  downloadReadme() {
    const element = document.createElement('a');
    const file = new Blob([this.generatedReadme], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${this.readme.name.replace(/\s+/g, '_')}_README.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    this.toastMessage = 'README downloaded successfully!';
    this.showToast = true;
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}