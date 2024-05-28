import { _decorator, Button, Component, Node } from 'cc';
import { GameManager } from '../GameManager';
import { Constant } from '../Constant';
const { ccclass, property } = _decorator;

@ccclass('MainMenu')
export class MainMenu extends Component {
    @property({
        type: Node
    })
    public buttonPlay: Node = null;

    start() {
        this.buttonPlay.on('click', this.HandelButtonPlayClick, this);
    }

    HandelButtonPlayClick() {
        GameManager._instance.LoadScene(GameManager._instance.maps[0]);
        GameManager._instance.currentMap = 0;
    }


    //onDestroy() {
    //    this.buttonPlay.off('click', this.HandelButtonPlayClick, this);
    //}

}


