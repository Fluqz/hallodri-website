import { Component, HostBinding, Input } from '@angular/core';
import { INotification } from 'src/app/provider/notification.service';

@Component({
  selector: 'notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {

  private _botPos: number = 10

  @Input('notification') notification: INotification
  @Input('index') set index(i: number) {

    this.bottom = i == 0 ? this._botPos : (i * 45) + this._botPos
  }

  @HostBinding('style.bottom.px') bottom: number = this._botPos

}
