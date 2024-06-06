import { _decorator, Button, Component, director, Node } from 'cc';
import { BgAudioController } from './BgAudioController';
import { GameManager } from './GameManager';
import { Popup_UISetting } from './Popup_UISetting';
const { ccclass, property } = _decorator;

@ccclass('Canvas_Setting')
export class Canvas_Setting extends Component {

    @property({
        type: Button
    })
    public Button_bgMusic: Button = null;

    @property({
        type: Button
    })
    public Button_Effect: Button = null;

    @property({
        type: Button
    })
    public Button_cancelUISetting: Button = null;

    @property({
        type: Node
    })
    public popup_UISetting: Node | null = null;

    onLoad() {
        director.addPersistRootNode(this.node);
        this.AddClickEvent(this.Button_bgMusic, this.HandleButton_bgMusic);
        this.AddClickEvent(this.Button_Effect, this.HandleButton_Effect);
        this.AddClickEvent(this.Button_cancelUISetting, this.HandleButton_cancleUISetting);
        this.node.active = false;
    }

    start() {

    }

    update(deltaTime: number) {
        
    }

    AddClickEvent(button: Button, callBack: Function) {
        button.node.on('click', callBack, this);
    }

    //bat tat nhac nen
    HandleButton_bgMusic() {
        if (BgAudioController._instance.isOnBgMusic) {
            BgAudioController._instance.Off_bgMusic();
        }
        else {
            BgAudioController._instance.On_bgMusic();
        }
    }

    //off am thanh hieu ung
    HandleButton_Effect() {
        //do some thing
    }

    //click nut cancle
    HandleButton_cancleUISetting() {
        GameManager._instance.ActiveCanvas(GameManager._instance.canvasControll);
        GameManager._instance.ActiveCanvas(GameManager._instance.canvasSetting);
    }

    //hieu ung mo ui setting
    OpenUISetting() {
        this.popup_UISetting.getComponent(Popup_UISetting).ShowUI_Setting();
    }
}


