import { _decorator, Button, Component, director, Label, Node } from 'cc';
import { GameManager } from './GameManager';
import { BodyPointController } from './BodyPointController';
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

    @property({
        type: Button
    })
    public button_reset: Button;

    @property({
        type: Button
    })
    public button_setting: Button;

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
        this.AddClickEvent(this.button_reset, this.OnClickButton_Reset);
        this.AddClickEvent(this.button_setting, this.OnClickButton_Setting);
        this.node.active = true;
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

    //reset map
    OnClickButton_Reset() {
        GameManager._instance.HandelButton_ResetMap();
    }

    //mo setting
    OnClickButton_Setting() {
        GameManager._instance.HandelButton_Setting();
    }

}


