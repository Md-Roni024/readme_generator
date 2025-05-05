import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Readme } from '../../models/readme.model';
import { FirebaseHttpService } from '../firebase/firebase.service';
import { CollectionReference } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ReadmeService {
  private firebaseHttp = inject(FirebaseHttpService);
  private collectionName = 'readmes';
  private readmeCollection: CollectionReference<Readme> = this.firebaseHttp.getCollection<Readme>(this.collectionName);

  saveReadme(readme: Readme): Observable<string> {
    return this.firebaseHttp.add(this.readmeCollection, readme);
  }

  getReadmes(): Observable<Readme[]> {
    return this.firebaseHttp.getAll(this.readmeCollection);
  }

  updateReadme(id: string, readme: Readme): Observable<void> {
    return this.firebaseHttp.update(this.collectionName, id, readme);
  }

  getReadmeById(id: string): Observable<Readme | undefined> {
    return this.firebaseHttp.getById(this.collectionName, id);
  }
}
