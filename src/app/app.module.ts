import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './views/home/home.component';

import { WaveComponent } from './views/templates/wave/wave.component';
import { WaveAnalyzerComponent } from './views/templates/wave-analyzer/wave-analyizer.component';
import { SocialComponent } from './views/templates/social/social.component';
import { NotificationComponent } from './views/templates/notification/notification.component';

import { NotificationService } from './provider/notification.service';
import { SidemenuComponent } from './views/sidemenu/sidemenu.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WaveComponent,
    WaveAnalyzerComponent,
    SocialComponent,
    NotificationComponent,
    SidemenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NoopAnimationsModule
  ],
  providers: [NotificationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
