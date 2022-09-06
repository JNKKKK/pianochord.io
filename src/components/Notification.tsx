import { h, Component } from 'preact'
import { X } from './icon/X'

type NotificationItem = {
    id: number,
    text: string,
}

type NotificationProps = {
    setList: (notifications: NotificationItem[]) => void,
    list: NotificationItem[]
}

type NotificationState = {

}

export default class Notification extends Component<NotificationProps, NotificationState> {
    constructor(props: NotificationProps) {
        super(props)
    }

    removeNotification(id: number) {
        return () => {
            this.props.setList(this.props.list.filter(noti => noti.id != id))
        }
    }

    render() {
        return (
            <div className='notification-container'>
                {
                    this.props.list.map(notification => (
                        <div className='notification'>
                            {notification.text}
                            <X size={20} onClick={this.removeNotification(notification.id)} />
                        </div>
                    ))
                }
            </div>
        )
    }
}

export type { NotificationItem }