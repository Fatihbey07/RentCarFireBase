import { HotToastService } from '@ngneat/hot-toast';
import { Uye } from './models/Uye';
import { Router } from '@angular/router';
import { FbservisService } from './services/fbservis.service';
import { Component } from '@angular/core';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  uye = this.fbServis.AktifUyeBilgi;

  constructor(
    public fbServis: FbservisService,
    public router: Router,
    public htoast: HotToastService
  ) {}

  OturumKapat() {
    this.fbServis.OturumKapat().subscribe(() => {
      this.router.navigate(['login']);
    });
  }
  customToast() {
    this.htoast.success('Look at my styles, and I also need more time!', {
      duration: 5000,
      style: {
        border: '1px solid #713200',
        padding: '16px',
        color: '#713200',
      },
      iconTheme: {
        primary: '#713200',
        secondary: '#FFFAEE',
      },
    });
  }
}
