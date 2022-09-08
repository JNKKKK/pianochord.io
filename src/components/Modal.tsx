import { h, Component } from 'preact'

type ModalProps = {
    show: boolean,
    setShow: (show: boolean) => void,
    closeWhenClickBackground?: boolean,
}

type ModalState = {}

export default class Modal extends Component<ModalProps, ModalState> {

    constructor(props: ModalProps) {
        super(props)
        this.onClickBackground = this.onClickBackground.bind(this)
    }

    componentDidUpdate(prevProps: ModalProps) {
        if (prevProps.show && !this.props.show) {
            document.body.style.overflow = "auto"
            document.body.style.height = "auto"
        }
        if (!prevProps.show && this.props.show) {
            document.body.style.overflow = "hidden"
            document.body.style.height = "100%"
        }
    }

    onClickBackground(e: MouseEvent) {
        if (e.currentTarget !== e.target) return
        if (this.props.closeWhenClickBackground === undefined || this.props.closeWhenClickBackground === true) {
            this.props.setShow(false)
        }
    }

    render() {
        return (
            <div className={'modal-background' + (this.props.show ? ' show' : '')} onClick={this.onClickBackground}>
                <div className='modal-container'>
                    {this.props.children}
                </div>
            </div>
        )
    }
}
