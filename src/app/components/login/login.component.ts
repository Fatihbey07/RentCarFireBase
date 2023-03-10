import { Uye } from './../../models/Uye';
import { HotToastService } from '@ngneat/hot-toast';
import { FbservisService } from './../../services/fbservis.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  uyeler!: Uye[];
  constructor(
    public fbServis: FbservisService,
    public htoast: HotToastService,
    public router: Router
  ) {}

  ngOnInit() {}
  OturumAc(mail: string, parola: string) {
    this.fbServis
      .OturumAc(mail, parola)
      .pipe(
        this.htoast.observe({
          success: 'Oturum Açıldı',
          loading: 'Oturum Açılıyor...',
          error: ({ message }) => `${message}`,
        })
      )
      .subscribe(() => {
        this.router.navigate(['']);
      });
  }
  GoogleOturumAc() {
    this.fbServis
      .GoogleOturumAc()
      .pipe(
        this.htoast.observe({
          success: 'Oturum Açıldı',
          loading: 'Oturum Açılıyor...',
          error: ({ message }) => `${message}`,
        })
      )
      .subscribe((s) => {
        console.log(s.user.displayName, s.user.email);

        this.router.navigate(['']);
      });
  }
}
