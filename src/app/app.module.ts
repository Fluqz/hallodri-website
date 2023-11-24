import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { WaveComponent } from './templates/wave/wave.component';
import { SocialComponent } from './templates/social/social.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WaveComponent,
    SocialComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
