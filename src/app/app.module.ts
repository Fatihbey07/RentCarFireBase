import { TaleplerComponent } from './components/talepler/talepler.component';
import { UyelerComponent } from './components/uyeler/uyeler.component';
import { KategorilerComponent } from './components/kategoriler/kategoriler.component';
import { ArabalarComponent } from './components/arabalar/arabalar.component';
import { ProfilComponent } from './components/profil/profil.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { HotToastModule } from '@ngneat/hot-toast';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { getStorage, provideStorage } from '@angular/fire/storage';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    ProfilComponent,
    ArabalarComponent,
    KategorilerComponent,
    UyelerComponent,
    TaleplerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    HotToastModule.forRoot({
      reverseOrder: true,
      autoClose: true,
    }),
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
  ],

  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
