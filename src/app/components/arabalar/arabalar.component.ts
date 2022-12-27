import { Uye } from './../../models/Uye';
import { Kategori } from './../../models/Kategori';
import { HotToastService } from '@ngneat/hot-toast';
import { FormGroup, FormControl } from '@angular/forms';
import { FbservisService } from './../../services/fbservis.service';
import { Araba } from './../../models/Araba';
import { Component, OnInit } from '@angular/core';
import { concatMap } from 'rxjs';
import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-arabalar',
  templateUrl: './arabalar.component.html',
  styleUrls: ['./arabalar.component.css'],
})
export class ArabalarComponent implements OnInit {
  arabalar!: Araba[];
  kategoriler!: Kategori[];
  uyeler!: Uye[];
  uye = this.fbServis.AktifUyeBilgi;
  modal!: Modal;
  modalBaslik: string = '';
  secAraba!: Araba;
  frm: FormGroup = new FormGroup({
    arabaadi: new FormControl(),
    categoryId: new FormControl(),
    kiralik: new FormControl(),
    vites: new FormControl(),
    iadetarih: new FormControl(),
    kirtarih: new FormControl(),
    arabamodel: new FormControl(),
    kirucret: new FormControl(),
    kimkiraladi: new FormControl(),
    kimekiraladi: new FormControl(),
    foto: new FormControl(),
    plaka: new FormControl(),
    uid: new FormControl(),
  });
  constructor(
    public fbServis: FbservisService,
    public htoast: HotToastService
  ) {}

  ngOnInit() {
    this.fbServis.AktifUyeBilgi.subscribe((user) => {
      this.frm.patchValue({ ...user });
    });
    this.KategoriListele();
    this.ArabaListele();
    this.UyeListele();
  }
  UyeListele() {
    this.fbServis.UyeListele().subscribe((d) => {
      this.uyeler = d;
    });
  }
  ArabaListele() {
    this.fbServis.ArabaListele().subscribe((d) => {
      this.arabalar = d;
    });
  }
  KategoriListele() {
    this.fbServis.KategoriListele().subscribe((d) => {
      this.kategoriler = d;
    });
  }
  EkleKaydet() {
    var araba: Araba = this.frm.value;

    if (
      !araba.arabaadi ||
      !araba.arabamodel ||
      !araba.kiralik ||
      !araba.kirucret ||
      !araba.vites
    ) {
      this.htoast.warning('Alanlar boş geçilemez');
    } else {
      this.fbServis
        .ArabaEkle(this.frm.value)
        .pipe(
          this.htoast.observe({
            loading: 'Araba Ekleniyor',
            success: 'Araba Eklendi',
            error: 'Araba Eklenirken Hata oluştu',
          })
        )
        .subscribe();
    }
  }
  DuzenleKaydet() {
    var araba: Araba = this.frm.value;
    if (
      !araba.arabaadi ||
      !araba.arabamodel ||
      !araba.kiralik ||
      !araba.kirucret ||
      !araba.vites
    ) {
      this.htoast.warning('Alanlar boş geçilemez');
    } else {
      this.fbServis
        .ArabaDuzenle(araba)
        .pipe(
          this.htoast.observe({
            loading: 'Araba Düzenleniyor',
            success: 'Araba Düzenlendi',
            error: 'Araba Düzenlenirken Hata oluştu',
          })
        )
        .subscribe();
    }
  }
  Sil(araba: Araba) {
    this.fbServis.ArabaSil(araba).then(() => {});
  }
  Ekle(el: HTMLElement) {
    this.frm.reset();
    this.frm.patchValue({ admin: 0 });
    this.modal = new bootstrap.Modal(el);
    this.modalBaslik = 'Araba Ekle';
    this.modal.show();
  }
  Duzenle(araba: Araba, el: HTMLElement) {
    this.frm.patchValue(araba);
    this.modalBaslik = 'Araba Düzenle';
    this.modal = new bootstrap.Modal(el);
    this.modal.show();
  }
  ResimYukle(event: any, araba: Araba) {
    this.fbServis
      .uploadImage(event.target.files[0], `images/profile/${araba.uid}`)
      .pipe(
        this.htoast.observe({
          loading: 'Fotoğraf Yükleniyor...',
          success: 'Fotoğraf yüklendi',
          error: 'Hata oluştu',
        }),
        concatMap((foto) =>
          this.fbServis.ArabaDuzenle({
            uid: araba.uid,
            foto,
            arabaadi: araba.arabaadi,
            categoryId: araba.categoryId,
            kiralik: araba.kiralik,
            kirtarih: araba.kirtarih,
            iadetarih: araba.iadetarih,
            vites: araba.vites,
            arabamodel: araba.arabamodel,
            kirucret: araba.kirucret,
            kimkiraladi: araba.kimekiraladi,
            kimekiraladi: araba.kimekiraladi,
            plaka: araba.plaka,
          })
        )
      )
      .subscribe();
  }
}
