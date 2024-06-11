import { _decorator, Component, Node, Sprite, tween, UIOpacity, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Popup_UISetting')
export class Popup_UISetting extends Component {

    @property({
        type: Node
    })
    public fullScreen_setting: Node | null;

    fullScreen_opcity: UIOpacity;

    durationTween: number = 0.5;

    onLoad() {
        this.fullScreen_opcity = this.fullScreen_setting.getComponent(UIOpacity);
    }

    start() {

    }

    update(deltaTime: number) {
        
    }

    ShowUI_Setting() {
        this.fullScreen_opcity.opacity = 0;
        this.node.scale = new Vec3(0, 0, 0);

        tween(this.node)
            .to(this.durationTween / 3, { scale: new Vec3(1.2, 1.2, 1.2) }, { easing: 'sineIn' })
            .to(this.durationTween / 5, { scale: new Vec3(0.8, 0.8, 0.8) }, { easing: 'sineOut' })
            .to(this.durationTween / 3, { scale: new Vec3(1.1, 1.1, 1.1) }, { easing: 'sineIn' })
            .to(this.durationTween / 5, { scale: new Vec3(0.95, 0.95, 0.95) }, { easing: 'sineOut' })
            //.to(this.durationTween / 5, { scale: new Vec3(1, 1, 1) }, { easing: 'sineIn' })
            .start();

        tween(this.fullScreen_opcity)
            .to(this.durationTween, { opacity: 200 })
            //.call(() => {
            //    this.fullScreen_opcity.opacity = 200;
            //})
            .start();
    }

}


