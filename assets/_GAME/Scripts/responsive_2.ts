import { _decorator, Component, Node, size, UITransform, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('responsive_2')
export class responsive_2 extends Component {
    @property({
        type: Node
    })
    public buttonControllTranform: Node = null;

    onLoad() {
        this.updatecanvas();
        // bắt sự kiện thay đổi kích thước màn hình
        view.on("canvas-resize", this.updatecanvas, this);
    }

    updatecanvas() {
        const canvas = view.getDesignResolutionSize();
        let deviceResolution = view.getResolutionPolicy();
        let designRatio = canvas.width / canvas.height;
        let deviceRatio =
            deviceResolution.canvasSize.width /
            deviceResolution.canvasSize.height;

        let newWidth, newHeight;
        if (deviceRatio < designRatio) {
            newWidth = canvas.width;
            newHeight = canvas.width * deviceRatio;
        } else {
            newWidth = canvas.height * deviceRatio;
            newHeight = canvas.height;
        }

        this.node.getComponent(UITransform).contentSize = size(newWidth, newHeight);

        //this.UpdateChildNodes(newWidth, newHeight);
    }

    //update kich thuoc con
    UpdateChildNodes(parentWidth: number, parentHeight: number) {
        const halfWidth = parentWidth / 2;
        this.buttonControllTranform.setPosition(-halfWidth / 2, this.buttonControllTranform.position.y);
    }
}


