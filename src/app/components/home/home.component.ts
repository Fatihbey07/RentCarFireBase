import { Araba } from './../../models/Araba';
import { FbservisService } from './../../services/fbservis.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  arabalar!: Araba[];

  constructor(public fbServis: FbservisService) {}

  ngOnInit() {
    this.ArabaListele();
  }
  ArabaListele() {
    this.fbServis.ArabaListele().subscribe((d) => {
      this.arabalar = d;
    });
  }
}
