import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { WaveComponent } from './templates/wave/wave.component';
import { SocialComponent } from './templates/social/social.component';
import { NotificationComponent } from './templates/notification/notification.component';

import { NotificationService } from './provider/notification.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WaveComponent,
    SocialComponent,
    NotificationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [NotificationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
