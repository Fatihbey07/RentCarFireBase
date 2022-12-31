import { Uye } from './../../models/Uye';
import { FbservisService } from 'src/app/services/fbservis.service';
import { Talep } from './../../models/Talep';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-talepler',
  templateUrl: './talepler.component.html',
  styleUrls: ['./talepler.component.css'],
})
export class TaleplerComponent implements OnInit {
  mevcutTalepler!: Talep[];
  tamamTalepler!: Talep[];
  uyeler!: Uye[];
  constructor(public fbservis: FbservisService) {}

  ngOnInit() {
    this.TalepListele();
    this.UyeListele();
  }
  TalepListele() {
    this.fbservis.TalepListele().subscribe((d) => {
      this.mevcutTalepler = d.filter(
        (s) => s.tamam == false || s.tamam == null
      );
      this.tamamTalepler = d.filter((s) => s.tamam == true);
    });
  }
  Sil(talep: Talep) {
    this.fbservis.TalepSil(talep).then(() => {});
  }
  TamamIptal(talep: Talep, d: boolean) {
    talep.tamam = d;
    this.fbservis.TalepDuzenle(talep).then(() => {});
  }
  UyeListele() {
    this.fbservis.UyeListele().subscribe((d) => {
      this.uyeler = d;
    });
  }
}
