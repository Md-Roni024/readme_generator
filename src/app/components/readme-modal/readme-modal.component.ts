import { Component, Input, OnInit,inject } from '@angular/core';
import { IonContent, IonButton, 
         IonIcon, ModalController,IonToast } from '@ionic/angular/standalone';
import { Readme } from '../../models/readme.model';
import { addIcons } from 'ionicons';
import { copyOutline, downloadOutline, closeOutline } from 'ionicons/icons';

addIcons({ copyOutline, downloadOutline, closeOutline });

@Component({
  selector: 'app-readme-modal',
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    IonIcon,
    IonToast
  ],
  templateUrl: './readme-modal.component.html',
  styleUrls: [],
})


export class ReadmeModalComponent implements OnInit {
  private modalCtrl = inject(ModalController);
  @Input() readme!: Readme;
  generatedReadme: string = '';
  showToast: boolean = false;
  toastMessage: string = '';

  ngOnInit() {
    this.generateReadmeContent();
  }

  generateReadmeContent() {
    this.generatedReadme = [
      `# ${this.readme.name}'s Profile`,
  
      `## 📞 Contact Information`,
      `- **Email:** ${this.readme.email}`,
      `- **Phone:** ${this.readme.phone}`,
      this.readme.optionalPhone ? `- **Alternative Phone:** ${this.readme.optionalPhone}` : '',
  
      `## 🔗 Social Links`,
      this.generateSocialLinksSection(),
  
      `## 🛠️ Skills`,
      this.generateSkillsSection(),
  
      `## 👤 About Me`,
      this.readme.about || 'No information provided.'
    ].filter(Boolean).join('\n\n');
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
    try{
      const element = document.createElement('a');
      const file = new Blob([this.generatedReadme], { type: 'text/markdown' });
      element.href = URL.createObjectURL(file);
      element.download = `${this.readme.name.replace(/\s+/g, '_')}_README.md`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      this.toastMessage = 'README FILE DOWNLOADED!';
      this.showToast = true;

    }catch(err){
      this.toastMessage = 'FAILLED TO DOWNLOADED!';
      this.showToast = true;
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}