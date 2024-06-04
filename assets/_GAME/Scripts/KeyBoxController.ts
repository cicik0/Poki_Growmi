import { _decorator, Component, Node } from 'cc';
import { BoxController } from './BoxController';
import { Constant } from './Constant';
import { DoorController } from './DoorController';
const { ccclass, property } = _decorator;

@ccclass('KeyBoxController')
export class KeyBoxController extends BoxController {


    doors: Node[];

    lock: Node;

    star() {
        super.start();
    }

    update(deltaTime: number) {
        super.update(deltaTime);
        if (this.CheckLockPosition()) {
            this.OpenDoor()
        }
        else {
            this.CloseDoor();
        }
    }

    protected OnInit() {
        super.OnInit();
        const maps = this.node.parent.children;

        this.doors = maps.filter(child => child.name == Constant.MAP_DOOR);
        if (this.doors.length === 0) {
            console.log('no door');
        }
        else {
            console.log('found door');
        }

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

    //mo cua(deactive)
    OpenDoor() {
        for (let child of this.doors) {
            child.getComponent(DoorController).OpenDoor();
        }
    }

    //dong cua(active)
    CloseDoor() {
        for (let child of this.doors) {
            child.getComponent(DoorController).CloseDoor();
        }
    }
}


