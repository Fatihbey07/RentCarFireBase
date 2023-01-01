import { FormGroup, FormControl } from '@angular/forms';
import { Uye } from './../../models/Uye';
import { FbservisService } from 'src/app/services/fbservis.service';
import { Component, OnInit } from '@angular/core';
import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap';
@Component({
  selector: 'app-uyeler',
  templateUrl: './uyeler.component.html',
  styleUrls: ['./uyeler.component.css'],
})
export class UyelerComponent implements OnInit {
  uye = this.fbServis.AktifUyeBilgi;
  uyeler!: Uye[];
  modalBaslik: string | undefined;
  modal!: Modal;
  adres!: string | undefined;
  tel: number | undefined;
  displayName: string | undefined;
  email: string | undefined;
  foto: string | undefined;
  frm: FormGroup = new FormGroup({
    uid: new FormControl(),
    email: new FormControl(),
    displayName: new FormControl(),
    tel: new FormControl(),
    adres: new FormControl(),
    foto: new FormControl(),
    admin: new FormControl(),
  });
  constructor(public fbServis: FbservisService) {}

  ngOnInit() {
    this.UyeListele();
  }
  UyeListele() {
    this.fbServis.UyeListele().subscribe((d) => {
      this.uyeler = d;
    });
  }
  Sil(uye: Uye) {
    this.fbServis.UyeSil(uye).then(() => {});
  }
  Goruntule(uye: Uye, el: HTMLElement) {
    this.modalBaslik = uye.displayName;
    this.email = uye.email;
    this.displayName = uye.displayName;
    this.adres = uye.adres;
    this.tel = uye.tel;
    this.foto = uye.foto;
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }
  Duzenle(uye: Uye, el: HTMLElement) {
    this.frm.patchValue(uye);
    this.modalBaslik = 'Kayıt Düzenle';
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }
  UyeEkleDuzenle() {
    var uye: Uye = this.frm.value;
    this.fbServis.UyeDuzenle(uye).subscribe((d) => {
      this.UyeListele();
      this.modal.toggle();
    });
  }
}
