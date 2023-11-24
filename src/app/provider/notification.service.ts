

import { Injectable, OnDestroy } from '@angular/core';

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

    notificationTime: number = 6 * 1000

    notifications: INotification[]

    private _IID: number

    constructor() {

        this.notifications = []

        this._IID = window.setInterval(this.clean.bind(this), 500)
    }

    getNotifications() {

        return this.notifications
    }

    send(notification: INotification) {

        this.notifications.push(notification)

        notification.dirty = false

        if(notification.timeStamp == undefined)
            notification.timeStamp = Date.now() + this.notificationTime

        else if(notification.timeStamp < Date.now()) {

            notification.dirty = true

            throw console.error('Notification ERR: NotificationService.send(n) - notification.timeStamp is already timed out', notification.timeStamp);
        }
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
        }
    }

    ngOnDestroy(): void {
        
        window.clearInterval(this._IID)

    }
}

