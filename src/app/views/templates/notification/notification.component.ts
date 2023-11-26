import { animate, style, transition, trigger } from '@angular/animations';
import { Component, HostBinding, Input } from '@angular/core';
import { INotification } from 'src/app/provider/notification.service';

@Component({
  selector: 'notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  animations: [
    // trigger('slideInOut', [
    //   transition(':enter', [
    //     style({transform: 'translateX(-100%)'}),
    //     animate('200ms ease-in', style({transform: 'translateX(0%)'}))
    //   ]),
    //   transition(':leave', [
    //     animate('200ms ease-in', style({transform: 'translateX(-100%)'}))
    //   ])
    // ])
    trigger("slideInOut", [
      transition(":enter", [
          style({ opacity: 0, transform: "translateX(-100%)" }), //apply default styles before animation starts
          animate(
              "2s ease-in-out",
              style({ opacity: 1, transform: "translateX(0)" })
          )
      ]),
      transition(":leave", [
          style({ opacity: 1, transform: "translateX(0)" }), //apply default styles before animation starts
          animate(
              "2s ease-in-out",
              style({ opacity: 0, transform: "translateX(-100%)" })
          )
      ])
  ])
  ]
})
export class NotificationComponent {

  private _botPos: number = 10

  /** INotification data. */
  @Input('notification') notification: INotification
  /** Order number. Index in the NotificationService.notifications array. */
  @Input('index') set index(i: number) {

    // Position notifications below each other. Newest top oldest bot.
    this.bottom = i == 0 ? this._botPos : (i * 45) + this._botPos
  }

  /** Bind css bottom attribute to host. */
  @HostBinding('style.bottom.px') bottom: number = this._botPos

}
