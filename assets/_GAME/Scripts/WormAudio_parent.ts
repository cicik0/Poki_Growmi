import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('WormAudio_parent')
export class WormAudio_parent extends Component {
    onLoad() {
        director.addPersistRootNode(this.node);
    }
}


