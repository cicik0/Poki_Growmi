import { _decorator, Component, Node } from 'cc';
import { BoxController } from './BoxController';
import { Constant } from './Constant';
import { DoorController } from './DoorController';
const { ccclass, property } = _decorator;

@ccclass('KeyBoxController')
export class KeyBoxController extends BoxController {

    @property({
        type: DoorController
    })
    public doorControll: DoorController;

    lock: Node;

    star() {
        super.start();
    }

    update(deltaTime: number) {
        super.update(deltaTime);
        if (this.CheckLockPosition()) {
            this.doorControll.OpenDoor();
        }
        else {
            this.doorControll.CloseDoor();
        }
    }

    protected OnInit() {
        super.OnInit();
        const maps = this.node.parent.children;
        for (let child of maps) {
            if (child.name === Constant.MAP_LOCK) {
                this.lock = child;
                console.log('find lock');
                return;
            }
        }
    }

    //kiem tra lock va key co cung position hay khong
    CheckLockPosition(): boolean {
        if (this.node.position.equals(this.lock.position)) {
            return true;
        }
        return false;
    }
}


