import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, query, doc, getDoc,updateDoc } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Readme } from '../models/readme.model';

@Injectable({
  providedIn: 'root'
})
export class ReadmeService {
  private firestore: Firestore = inject(Firestore);
  private readmeCollection = collection(this.firestore, 'readmes');

  saveReadme(readme: Readme): Observable<string> {
    return from(addDoc(this.readmeCollection, readme)).pipe(
      map(docRef => docRef.id)
    );
  }

  // Add this method to get all readmes
  getReadmes(): Observable<Readme[]> {
    return from(getDocs(query(this.readmeCollection))).pipe(
      map(snapshot => {
        return snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data
          } as Readme;
        });
      })
    );
  }

  // Add this method to get a single readme
  // getReadme(id: string): Observable<Readme> {
  //   const docRef = doc(this.firestore, 'readmes', id);
  //   return from(getDoc(docRef)).pipe(
  //     map(doc => {
  //       if (doc.exists()) {
  //         const data = doc.data();
  //         return {
  //           id: doc.id,
  //           ...data
  //         } as Readme;
  //       } else {
  //         throw new Error('ReadMe not found');
  //       }
  //     })
  //   );
  // }


  updateReadme(id: string, readme: Readme) {
    const docRef = doc(this.firestore, 'readmes', id);
    return updateDoc(docRef, { ...readme });
  }
  
  getReadmeById(id: string): Observable<Readme | undefined> {
    const docRef = doc(this.firestore, 'readmes', id);
    return from(getDoc(docRef)).pipe(
      map(docSnap => {
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() } as Readme;
        }
        return undefined;
      })
    );
  }
}