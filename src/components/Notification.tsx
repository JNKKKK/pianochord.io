import { h, Component } from 'preact'
import { X } from './icon/X'
import { NotificationItem, notifications, removeNotification } from '../libs/notification'


type NotificationProps = {

}

type NotificationState = {

}

export default class Notification extends Component<NotificationProps, NotificationState> {
    constructor(props: NotificationProps) {
        super(props)
    }

    render() {
        return (
            <div className='notification-container'>
                {
                    notifications.value.map(notification => (
                        <div className='notification'>
                            {notification.text}
                            <X size={20} onClick={() => { removeNotification(notification.id) }} />
                        </div>
                    ))
                }
            </div>
        )
    }
}

export type { NotificationItem }