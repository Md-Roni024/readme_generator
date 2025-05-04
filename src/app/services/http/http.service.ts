import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, query, doc, getDoc, updateDoc, CollectionReference } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseHttpService {
  private firestore = inject(Firestore);

  getCollection<T>(collectionName: string): CollectionReference<T> {
    return collection(this.firestore, collectionName) as CollectionReference<T>;
  }

  add<T>(collectionRef: CollectionReference<T>, data: T): Observable<string> {
    return from(addDoc(collectionRef, data)).pipe(map(docRef => docRef.id));
  }

  getAll<T>(collectionRef: CollectionReference<T>): Observable<(T & { id: string })[]> {
    return from(getDocs(query(collectionRef))).pipe(
      map(snapshot =>
        snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T & { id: string }))
      )
    );
  }

  update<T>(collectionName: string, id: string, data: Partial<T>): Observable<void> {
    const docRef = doc(this.firestore, collectionName, id);
    return from(updateDoc(docRef, { ...data }));
  }

  getById<T>(collectionName: string, id: string): Observable<(T & { id: string }) | undefined> {
    const docRef = doc(this.firestore, collectionName, id);
    return from(getDoc(docRef)).pipe(
      map(docSnap => docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as T & { id: string } : undefined)
    );
  }
}
