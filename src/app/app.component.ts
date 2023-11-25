import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { INotification, NOTIFICATIONS, NotificationService } from './provider/notification.service';
import { SidemenuComponent } from './views/sidemenu/sidemenu.component';
import { G } from './globals';

import * as Tone from 'tone'
import { M } from './util/math';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: {

    '(window:resize)': 'onResize($event)',
    '(document:pointermove)': 'onPointerMove($event)',
  }
})
export class AppComponent implements AfterViewInit {

  notifications: INotification[]

  @ViewChild(SidemenuComponent) sidemenu: SidemenuComponent

  mouseAngle: number = 0

  constructor(public notification: NotificationService) {

    G.w = window.innerWidth
    G.h = window.innerHeight

    notification.onChange.subscribe((_notifications) => {

      this.notifications = _notifications
    })

  }

  ngAfterViewInit(): void {

    this.notification.send(NOTIFICATIONS.SYSTEM.BOOTING as INotification)

  }

  open() { if(this.sidemenu) this.sidemenu.open() }

  onPointerMove(e: MouseEvent) {

    this.mouseAngle = M.getAngle(20, -20, e.clientX, e.clientY)
  }

  onResize(e: Event) {

    G.w = window.innerWidth
    G.h = window.innerHeight
  }
}
