import { Component } from '@angular/core';
import { INotification, NotificationService } from './provider/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  notifications: INotification[]

  constructor(public notification: NotificationService) {

    notification.onChange.subscribe((_notifications) => {

      this.notifications = _notifications
    })
  }
}
