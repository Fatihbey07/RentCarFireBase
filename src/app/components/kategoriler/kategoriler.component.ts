import { Uye } from './../../models/Uye';
import { FormGroup, FormControl } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { Kategori } from './../../models/Kategori';
import { FbservisService } from 'src/app/services/fbservis.service';
import { Component, OnInit } from '@angular/core';
import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap';
@Component({
  selector: 'app-kategoriler',
  templateUrl: './kategoriler.component.html',
  styleUrls: ['./kategoriler.component.css'],
})
export class KategorilerComponent implements OnInit {
  kategoriler!: Kategori[];
  modal!: Modal;
  modalBaslik: string = '';
  frm: FormGroup = new FormGroup({
    kid: new FormControl(),
    adi: new FormControl(),
  });
  uyeler!: Uye[];
  constructor(
    public fbServis: FbservisService,
    public htoast: HotToastService
  ) {}

  ngOnInit() {
    this.KategoriListele();
    this.UyeListele();
  }
  UyeListele() {
    this.fbServis.UyeListele().subscribe((d) => {
      this.uyeler = d;
    });
  }

  KategoriListele() {
    this.fbServis.KategoriListele().subscribe((d) => {
      this.kategoriler = d;
    });
  }
  Sil(kategori: Kategori) {
    this.fbServis.KategoriSil(kategori).then(() => {});
  }
  Kaydet() {
    var kategori: Kategori = this.frm.value;
    if (!kategori.adi) {
      this.htoast.show('Kategori Adı boş geçilemez');
    } else {
      var filtre = this.kategoriler.filter((s) => s.adi == kategori.adi);
      if (filtre.length > 0) {
        this.htoast.show('Kategori adı zaten var');
      } else {
        this.fbServis
          .KategoriEkle(this.frm.value)
          .pipe(
            this.htoast.observe({
              success: 'Kategori Eklendi',
              loading: 'Kategori Ekleniyor...',
              error: ({ message }) => `${message}`,
            })
          )
          .subscribe();
      }
    }
  }
  DuzenleKaydet() {
    var kategori: Kategori = this.frm.value;
    if (!kategori.adi) {
      this.htoast.warning('Alanlar boş geçilemez');
    } else {
      this.fbServis
        .KategoriDuzenle(kategori)
        .pipe(
          this.htoast.observe({
            loading: 'Kategori Düzenleniyor',
            success: 'Kategori Düzenlendi',
            error: 'Kategori Düzenlenirken Hata oluştu',
          })
        )
        .subscribe();
    }
  }
  Duzenle(kategori: Kategori, el: HTMLElement) {
    this.frm.patchValue(kategori);
    this.modalBaslik = 'Kategori Düzenle';
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }
}
