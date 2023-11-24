

import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export type NotificationType = 'ERROR' | 'WARNING' | 'AUDIO' | 'INFO'


export interface INotification {

    type: NotificationType
    title?: string
    message: string

    dirty?: boolean
    timeStamp?: number
}

export const NOTIFICATIONS = {

    AUDIO: {
        SOUND_ON: {
            type: 'AUDIO',
            title: 'Audio',
            message: 'Sound: ON'
        },

        SOUND_OFF: {
            type: 'AUDIO',
            title: 'Audio',
            message: 'Sound: OFF'
        }
    }
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService implements OnDestroy {

    private _notificationTime: number = 6 * 1000

    notifications: INotification[]

    private _IID: number

    onChange: Subject<INotification[]>

    constructor() {

        this.notifications = []

        this.onChange = new Subject()

        this._IID = window.setInterval(this.clean.bind(this), 500)
    }

    send(notification: INotification) {

        this.notifications.push(notification)

        notification.dirty = false

        if(notification.timeStamp == undefined)
            notification.timeStamp = Date.now() + this._notificationTime

        else if(notification.timeStamp < Date.now()) {

            notification.dirty = true

            throw console.error('Notification ERR: NotificationService.send(n) - notification.timeStamp is already timed out', notification.timeStamp);
        }

        this.onChange.next(this.notifications)
    }

    remove(notification: INotification) : boolean {

        let i = this.notifications.indexOf(notification)

        if(i == -1) return false

        this.notifications[i].dirty = true

        this.clean()

        return true
    }

    clean() {

        if(this.notifications.length == 0) return

        let dirtyNotifications: INotification[] = []
        for(let n of this.notifications) {

            // Check if notification is overdue
            if(n.timeStamp && n.timeStamp <= Date.now()) {

                n.dirty = true
            }

            // Add dirty notifications for removal
            if(n.dirty == true) {

                dirtyNotifications.push(n)
            }
        }

        // Remove notifications when dirty
        for(let n of dirtyNotifications) {

            this.notifications.splice(this.notifications.indexOf(n), 1)

            this.onChange.next(this.notifications)
        }
    }

    ngOnDestroy(): void {
        
        window.clearInterval(this._IID)

    }
}

