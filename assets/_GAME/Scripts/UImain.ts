import { _decorator, Button, Component, Node } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('UImain')
export class UImain extends Component {
    @property({
        type: Button
    })
    public buttonPlay: Button;

    start() {

    }

    update(deltaTime: number) {
        
    }

    onLoad() {
        this.buttonPlay.node.on('click', this.OnClickButton, this);
    }

    OnClickButton() {
        GameManager._instance.LoadScene('map1');
    }

    //onDestroy() {
    //    this.buttonPlay.node.off('click', this.OnClickButton);
    //}
}


