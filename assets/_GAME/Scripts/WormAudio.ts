import { _decorator, Component, Node, AudioClip, AudioSource, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('WormAudio')
export class WormAudio extends Component {
    public static _instance: WormAudio;

    @property({
        type: [AudioClip]
    })
    public clips: AudioClip[] = [];

    @property({
        type: AudioSource
    })
    public audiSource: AudioSource = null!;

    protected onLoad(): void {
        if(WormAudio._instance == null){
            WormAudio._instance = this;
        }
        else{
            this.destroy();
        }
    }

    onAudioQueue(index: number) {
        let clip: AudioClip = this.clips[index];

        this.audiSource.playOneShot(clip);
    }
}


