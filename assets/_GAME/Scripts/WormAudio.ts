import { _decorator, Component, Node, AudioClip, AudioSource, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('WormAudio')
export class WormAudio extends Component {
    @property({
        type: [AudioClip]
    })
    public clips: AudioClip[] = [];

    @property({
        type: AudioSource
    })
    public audiSource: AudioSource = null!;



    onAudioQueue(index: number) {
        let clip: AudioClip = this.clips[index];

        this.audiSource.playOneShot(clip);
    }
}

