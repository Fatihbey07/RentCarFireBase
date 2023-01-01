import { Talep } from './../models/Talep';
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
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  User,
  UserInfo,
  signInWithPopup,
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
  GoogleOturumAc() {
    return from(signInWithPopup(this.auth, new GoogleAuthProvider()));
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

  TalepListele() {
    var ref = collection(this.fs, 'Talepler');
    return this.aktifUye.pipe(
      concatMap(() => {
        const myQuery = query(ref);
        return collectionData(myQuery, { idField: 'talepId' }) as Observable<
          Talep[]
        >;
      })
    );
  }
  TalepEkle(talep: Talep) {
    var ref = collection(this.fs, 'Talepler');
    return this.aktifUye.pipe(
      concatMap((user) =>
        addDoc(ref, {
          arabaadi: talep.arabaadi,
          kirtarih: talep.kirtarih,
          iadetarih: talep.iadetarih,
          talepkim: talep.talepkim,
          uid: user?.uid,
        })
      ),
      map((ref) => ref.id)
    );
  }
  TalepDuzenle(talep: Talep) {
    var ref = doc(this.fs, 'Talepler/' + talep.talepId);
    return updateDoc(ref, { ...talep });
  }
  TalepSil(talep: Talep) {
    var ref = doc(this.fs, 'Talepler/' + talep.talepId);
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
