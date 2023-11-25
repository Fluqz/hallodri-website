import { Component, HostBinding, Input } from '@angular/core';
import { INotification } from 'src/app/provider/notification.service';

@Component({
  selector: 'notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {

  @Input('notification') notification: INotification
  @Input('index') set index(i: number) {

    this.bottom = i == 0 ? 5 : (i * 45) + 5
  }

  @HostBinding('style.bottom.px') bottom: number = 5

}
