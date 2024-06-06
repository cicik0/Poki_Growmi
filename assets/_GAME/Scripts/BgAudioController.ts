import { _decorator, AudioSource, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BgAudioController')
export class BgAudioController extends Component {

    public static _instance: BgAudioController;

    isOnBgMusic: boolean = true;

    @property({
        type: AudioSource
    })
    public _audioSource = null;

    onLoad() {
        if (BgAudioController._instance == null) {
            BgAudioController._instance = this;
            director.addPersistRootNode(this.node);
        }
        else {
            this.destroy();
            
        }
        const audioSource = this.getComponent(AudioSource);
        this._audioSource = audioSource;
    }

    start() {
        this.On_bgMusic();
    }

    On_bgMusic() {
        if (this._audioSource) {
            this._audioSource.play();
            this.isOnBgMusic = true;
        }
    }

    Off_bgMusic() {
        if (this._audioSource) {
            this._audioSource.stop();
            this.isOnBgMusic = false;
        }
    }
}


