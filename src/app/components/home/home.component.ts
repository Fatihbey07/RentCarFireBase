import { Uye } from './../../models/Uye';
import { HotToastService } from '@ngneat/hot-toast';
import { FormGroup, FormControl } from '@angular/forms';
import { Araba } from './../../models/Araba';
import { FbservisService } from './../../services/fbservis.service';
import { Component, OnInit } from '@angular/core';
import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  arabalar!: Araba[];
  uye = this.fbServis.AktifUyeBilgi;
  frm: FormGroup = new FormGroup({
    arabaadi: new FormControl(),
    kirtarih: new FormControl(),
    iadetarih: new FormControl(),
    talepkim: new FormControl(),
  });
  modal!: Modal;
  modalBaslik: string = '';
  uyeler!: Uye[];
  constructor(
    public fbServis: FbservisService,
    public htoast: HotToastService
  ) {}

  ngOnInit() {
    this.ArabaListele();
    this.fbServis.AktifUyeBilgi;
    this.UyeListele();
  }

  ArabaListele() {
    this.fbServis.ArabaListele().subscribe((d) => {
      this.arabalar = d;
    });
  }
  Kirala(araba: Araba, el: HTMLElement) {
    this.frm.patchValue(araba);
    this.modalBaslik = 'Araba Kiralama Talebi';
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }
  Talep() {
    this.fbServis
      .TalepEkle(this.frm.value)
      .pipe(
        this.htoast.observe({
          success: 'Talep Oluşturuldu',
          loading: 'Talep Ekleniyor...',
          error: ({ message }) => `${message}`,
        })
      )
      .subscribe();
  }
  UyeListele() {
    this.fbServis.UyeListele().subscribe((d) => {
      this.uyeler = d;
    });
  }
  tikla() {
    console.log(this.fbServis.AktifUyeBilgi);
  }
}
