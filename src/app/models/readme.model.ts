export interface SocialLink {
    username: string;
    url: string;
    type?: string;
  }
  
  export interface Readme {
    id?: string;
    name: string;
    email: string;
    phone: string;
    optionalPhone?: string;
    socialLinks: SocialLink[];
    skills: string[];
    about: string;
  }
  
  export interface Skill {
    name: string;
    checked: boolean;
  }