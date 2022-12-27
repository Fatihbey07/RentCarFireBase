import { Kategori } from './../models/Kategori';
import { Uye } from './../models/Uye';
import { Gorev } from '../models/Gorev';
import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  Firestore,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import { concatMap, from, map, Observable, of, switchMap, take } from 'rxjs';
import { addDoc, updateDoc } from '@firebase/firestore';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  User,
  UserInfo,
} from '@angular/fire/auth';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadBytes,
} from '@angular/fire/storage';
import { Araba } from '../models/Araba';

@Injectable({
  providedIn: 'root',
})
export class FbservisService {
  aktifUye = authState(this.auth);
  constructor(
    public fs: Firestore,
    public auth: Auth,
    public storage: Storage
  ) {}

  KayitOl(mail: string, parola: string) {
    return from(createUserWithEmailAndPassword(this.auth, mail, parola));
  }
  OturumAc(mail: string, parola: string) {
    return from(signInWithEmailAndPassword(this.auth, mail, parola));
  }
  OturumKapat() {
    return from(this.auth.signOut());
  }

  get AktifUyeBilgi() {
    return this.aktifUye.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          return of(null);
        }
        const ref = doc(this.fs, 'Uyeler', user?.uid);
        return docData(ref) as Observable<Uye>;
      })
    );
  }

  GorevListele() {
    var ref = collection(this.fs, 'Gorevler');
    return this.aktifUye.pipe(
      concatMap((user) => {
        const myQuery = query(ref, where('uid', '==', user?.uid));
        return collectionData(myQuery, { idField: 'gorevId' }) as Observable<
          Gorev[]
        >;
      })
    );
  }
  GorevEkle(gorev: Gorev) {
    var ref = collection(this.fs, 'Gorevler');
    return this.aktifUye.pipe(
      take(1),
      concatMap((user) =>
        addDoc(ref, {
          baslik: gorev.baslik,
          aciklama: gorev.aciklama,
          tamam: gorev.tamam,
          uid: user?.uid,
        })
      ),
      map((ref) => ref.id)
    );
  }
  GorevDuzenle(gorev: Gorev) {
    var ref = doc(this.fs, 'Gorevler/' + gorev.gorevId);
    return updateDoc(ref, { ...gorev });
  }
  GorevSil(gorev: Gorev) {
    var ref = doc(this.fs, 'Gorevler/' + gorev.gorevId);
    return deleteDoc(ref);
  }

  UyeListele() {
    var ref = collection(this.fs, 'Uyeler');
    return collectionData(ref, { idField: 'uid' }) as Observable<Uye[]>;
  }
  UyeEkle(uye: Uye) {
    var ref = doc(this.fs, 'Uyeler', uye.uid);
    return from(setDoc(ref, uye));
  }
  UyeDuzenle(uye: Uye) {
    var ref = doc(this.fs, 'Uyeler', uye.uid);
    return from(updateDoc(ref, { ...uye }));
  }
  UyeSil(uye: Uye) {
    var ref = doc(this.fs, 'Uyeler', uye.uid);
    return deleteDoc(ref);
  }

  uploadImage(image: File, path: string): Observable<string> {
    const storageRef = ref(this.storage, path);
    const uploadTask = from(uploadBytes(storageRef, image));
    return uploadTask.pipe(switchMap((result) => getDownloadURL(result.ref)));
  }
  ArabaListele() {
    var ref = collection(this.fs, 'Arabalar');
    return collectionData(ref, { idField: 'uid' }) as Observable<Araba[]>;
  }
  ArabaEkle(araba: Araba) {
    var ref = collection(this.fs, 'Arabalar');
    return from(addDoc(ref, araba));
  }
  ArabaDuzenle(araba: Araba) {
    var ref = doc(this.fs, 'Arabalar', araba.uid);
    return from(updateDoc(ref, { ...araba }));
  }
  ArabaSil(araba: Araba) {
    var ref = doc(this.fs, 'Arabalar', araba.uid);
    return deleteDoc(ref);
  }
  KategoriListele() {
    var ref = collection(this.fs, 'Kategoriler');
    return collectionData(ref, { idField: 'kid' }) as Observable<Kategori[]>;
  }
  KategoriEkle(kategori: Kategori) {
    var ref = collection(this.fs, 'Kategoriler');
    return this.aktifUye.pipe(
      take(1),
      concatMap((user) =>
        addDoc(ref, {
          adi: kategori.adi,
          kid: kategori.kid,
          uid: user?.uid,
        })
      ),
      map((ref) => ref.id)
    );
  }
  KategoriDuzenle(kategori: Kategori) {
    var ref = doc(this.fs, 'Kategoriler', kategori.kid);
    return from(updateDoc(ref, { ...kategori }));
  }
  KategoriSil(kategori: Kategori) {
    var ref = doc(this.fs, 'Kategoriler', kategori.kid);
    return deleteDoc(ref);
  }
}
