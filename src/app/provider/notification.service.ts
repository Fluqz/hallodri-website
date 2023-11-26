

import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

export type NotificationType = 'ERROR' | 'WARNING' | 'AUDIO' | 'INFO' | 'SYSTEM'


export interface INotification {

    type: NotificationType
    title?: string
    message: string

    onTimeout?: () => void

    dirty?: boolean
    timeStamp?: number
    duration?: number
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
        },
        MUTED: {
            type: 'AUDIO',
            title: 'Audio',
            message: 'Muted',
            duration: 4000,
        },
        UNMUTED: {
            type: 'AUDIO',
            title: 'Audio',
            message: 'Unmuted',
            duration: 4000,
        },
        MASTER_MUTED: {
            type: 'AUDIO',
            title: 'Audio',
            message: 'Master Muted',
            duration: Number.POSITIVE_INFINITY,
        },
        MASTER_UNMUTED: {
            type: 'AUDIO',
            title: 'Audio',
            message: 'Master Unmuted',
            duration: 4000,
        },
    },
    SYSTEM: {
        BOOTING: {
            type: 'AUDIO',
            title: 'System',
            message: 'Booting...',
            duration: 4000,
        },
        SYNTH_READY: {
            type: 'AUDIO',
            title: 'System',
            message: 'Synthesizer ready.',
            duration: 4000,
        },
        WAVE_ENABLED: {
            type: 'AUDIO',
            title: 'System',
            message: 'Wave powered and running',
            duration: 4000,
        },
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

        this._IID = window.setInterval(this.clean.bind(this), 200)
    }

    send(notification: INotification, duration?: number) : INotification {

        if(this.notifications.indexOf(notification) == -1)
            this.notifications.push(notification)

        notification.dirty = false

        if(duration == undefined || duration < 0)
            notification.duration = (notification.duration == null || notification.duration < 0) ? this._notificationTime : notification.duration

        // TODO - MANIPULATING THE OBJECT HERE! Make copy of object??
        else notification.duration = duration

        if(notification.timeStamp == undefined || notification.timeStamp < Date.now())
            notification.timeStamp = Date.now()

        else if(notification.timeStamp + notification.duration <= Date.now()) {

            notification.dirty = true

            console.trace()

            throw console.error('Notification ERR: NotificationService.send(n) - notification.timeStamp is already timed out', notification);
        }

        this.onChange.next(this.notifications)

        return notification
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
            if(n.timeStamp != undefined && n.duration != undefined && n.timeStamp + n.duration <= Date.now()) {

                n.dirty = true
            }

            // Add dirty notifications for removal
            if(n.dirty === true) {

                dirtyNotifications.push(n)
            }
        }

        // Remove notifications when dirty
        for(let n of dirtyNotifications) {

            this.notifications.splice(this.notifications.indexOf(n), 1)

            if(n.onTimeout) {
                n.onTimeout()
                delete n.onTimeout
            }

            this.onChange.next(this.notifications)
        }
    }

    ngOnDestroy(): void {
        
        window.clearInterval(this._IID)
    }
}

