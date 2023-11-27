import { AfterContentInit, AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
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
export class AppComponent implements AfterContentInit {

  notifications: INotification[]

  @ViewChild(SidemenuComponent) sidemenu: SidemenuComponent

  /** Angle of the pointer position */
  mouseAngle: number = 0

  constructor(public notification: NotificationService) {

    G.w = window.innerWidth
    G.h = window.innerHeight


  }

  ngAfterContentInit(): void {

    this.notification.onChange.subscribe((_notifications) => {

      this.notifications = _notifications
    })

    const n = this.notification.send(NOTIFICATIONS.SYSTEM.BOOTING as INotification)

    n.onTimeout = () => {

      // this.notification.clear()

      // if(G.init == true) return

      this.notification.send({
        type: 'SYSTEM',
        title: 'Synthesizer',
        message: 'CLICK ME !',
        duration: 2000
      })
    }
  }

  /** Open sidemenu */
  open() { if(this.sidemenu) this.sidemenu.open() }

  /** Rotates the menu icon to towards the pointer. */
  onPointerMove(e: PointerEvent) {

    this.mouseAngle = M.getAngle(20, -20, e.clientX, e.clientY)
  }

  onResize(e: Event) {

    G.w = window.innerWidth
    G.h = window.innerHeight
  }
}
