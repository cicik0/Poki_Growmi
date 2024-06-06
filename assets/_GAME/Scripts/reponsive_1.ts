import { _decorator, Component, Node, size, UITransform, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('reponsive_1')
export class reponsive_1 extends Component {

    @property({
        type: Node
    })
    public leftNode: Node = null;

    @property({
        type: Node
    })
    public rightNode: Node = null;

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

        this.UpdateChildNodes(newWidth, newHeight);
    }

    //update kich thuoc con
    UpdateChildNodes(parentWidth: number, parentHeight: number) {
        const leftNodeTranform = this.leftNode.getComponent(UITransform);
        const rightNodeTranfrom = this.rightNode.getComponent(UITransform);

        const halfWidth = parentWidth / 2;
        const margin_right = 560  ;
        const margin_left = 460  ;

        leftNodeTranform.contentSize = size(halfWidth - margin_left, parentHeight);
        rightNodeTranfrom.contentSize = size(halfWidth - margin_right, parentHeight);

        //reset vi tri node con de full man hinh
        this.leftNode.setPosition(-halfWidth / 2, 0);
        this.rightNode.setPosition(halfWidth / 2, 0);
    }
}


