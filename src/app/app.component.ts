import { Component, ViewChild } from '@angular/core';
import { INotification, NotificationService } from './provider/notification.service';
import { SidemenuComponent } from './views/sidemenu/sidemenu.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  notifications: INotification[]

  @ViewChild(SidemenuComponent) sidemenu: SidemenuComponent

  constructor(public notification: NotificationService) {

    notification.onChange.subscribe((_notifications) => {

      this.notifications = _notifications
    })
  }

  open() { if(this.sidemenu) this.sidemenu.open() }
}
