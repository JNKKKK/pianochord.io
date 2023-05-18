import { forceDescriptives, randomList } from '../libs/helper';
import { keySimpleList } from '../libs/key'
import { Component } from 'preact'

const total = keySimpleList.length * 2

let top = forceDescriptives(randomList(total, 1, 50), 50, 20);
let left = forceDescriptives(randomList(total, 1, 99), 50, 30);
let size = randomList(total, 2, 7);

export default class AboutPage extends Component {
    render() {
        return (
            <div className='about-container'>
                <div className='decor-container'>
                    {
                        [...keySimpleList, ...keySimpleList].map((key, i) => {
                            return (
                                <span
                                    className={['color-' + (i % keySimpleList.length + 1), i % 2 == 0 ? 'mobile-hide' : ''].join(' ')}
                                    style={{
                                        top: top[i] + "%",
                                        left: left[i] + "%",
                                        fontSize: size[i] + "rem",
                                    }}>
                                    {key}
                                </span>
                            )
                        })
                    }
                </div>
                <div className='content-container'>
                    <h1>About</h1>
                    <div>
                        PianoChord.io will always be free and open source.
                        The motivation of this project is to provide music lovers, students and educators an easy-to-use tool to visualize and learn common piano chords.
                        We insist on high bar of user experience, mobile friendliness, and most importantly, the correctness of the data.
                    </div>
                    <h1>Report a Bug</h1>
                    <div>
                        Don't hesitate to report a bug if you find we have the wrong chord data or anything else goes wrong. Feature requests are also welcomed!
                        To do so, please open an issue in <a href="https://github.com/JNKKKK/pianochord.io/issues">Github Issues</a>.
                    </div>
                </div>
            </div>
        )
    }
}
