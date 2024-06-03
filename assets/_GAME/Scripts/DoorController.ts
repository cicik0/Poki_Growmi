import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DoorController')
export class DoorController extends Component {

    start() {
        this.CloseDoor();
    }

    OpenDoor() {
        this.node.active = false;
    }

    CloseDoor() {
        this.node.active = true;
    }
}


