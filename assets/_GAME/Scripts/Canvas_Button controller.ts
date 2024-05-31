import { _decorator, Button, Component, director, Node } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('Canvas_Button_controller')
export class Canvas_Button_controller extends Component {
    @property({
        type: Button
    })
    public button_up: Button;

    @property({
        type: Button
    })
    public button_down: Button;

    @property({
        type: Button
    })
    public button_left: Button;

    @property({
        type: Button
    })
    public button_right: Button;

    start() {

    }

    update(deltaTime: number) {
        
    }

    onLoad() {
        director.addPersistRootNode(this.node);
        this.AddClickEvent(this.button_up, this.OnClickButton_Up);
        this.AddClickEvent(this.button_down, this.OnClickButton_Down);
        this.AddClickEvent(this.button_left, this.OnClickButton_Left);
        this.AddClickEvent(this.button_right, this.OnClickButton_Right);
    }

    //them event click cho button
    AddClickEvent(button: Button, callBack: Function) {
        button.node.on('click', callBack, this);
    }

    //su kien khi click move button
    OnClickButton_Up() {
        GameManager._instance.HandelButton_UpClick();
    }

    OnClickButton_Down() {
        GameManager._instance.HandelButton_DownClick();
    }

    OnClickButton_Left() {
        GameManager._instance.HandelButton_LeftClick();
    }

    OnClickButton_Right() {
        GameManager._instance.HandelButton_RightClick();
    }
}


