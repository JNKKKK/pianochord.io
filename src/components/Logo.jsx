import { h, Component, createRef } from 'preact'
import Leon from '../libs/leonsans'
import anime from 'animejs/lib/anime.es.js'

const pixelRatio = 2
const width = 610
const height = 90

var leon, ctx

export default class Logo extends Component {
  constructor (props) {
    super(props)
    this.canvasRef = createRef()
    this.animate = this.animate.bind(this)
  }

  animate () {
    window.requestAnimationFrame(this.animate)
    ctx.clearRect(0, 0, width * pixelRatio, height * pixelRatio)
    leon.position(0, 0)
    leon.drawColorful(ctx)
  }

  componentDidMount () {
    const canvas = this.canvasRef.current
    ctx = canvas.getContext('2d')
    canvas.width = width * pixelRatio
    canvas.height = height * pixelRatio
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
    ctx.clearRect(0, 0, width * pixelRatio, height * pixelRatio)
    leon = new Leon({
      text: 'PianoChord.io',
      color: ['#000000'],
      size: 200,
      weight: 500,
      tracking: 0,
      leading: 0
    })
    ctx.lineCap = 'round'
    ctx.globalCompositeOperation = 'multiply'
    this.rAF = window.requestAnimationFrame(this.animate)
    var i
    var total = leon.drawing.length
    for (i = 0; i < total; i++) {
      anime({
        targets: leon.drawing[i],
        value: [0, 1],
        duration: 1500,
        easing: 'easeOutCubic'
      })
    }
  }

  componentWillUnmount () {
    window.cancelAnimationFrame(this.rAF)
  }

  render () {
    return (
      <div className='logo-container'>
        <canvas ref={this.canvasRef} />
      </div>
    )
  }
}
