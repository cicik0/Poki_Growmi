import { _decorator, CCFloat, Component, director, find, Node, tween, Vec3 } from 'cc';
import { wormController } from './wormController';
import { Constant } from './Constant';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('BoxController')
export class BoxController extends Component {

    @property({
        type: CCFloat
    })
    public ratioDuration: number;

    wormControl: wormController;

    canFalling: boolean;
    isFalling: boolean = false;

    start() {
        this.OnInit();

        this.canFalling = this.CheckBoxCanFall();
    }

    update(deltaTime: number) {
        //console.log('update box');
        //console.log(this.CheckBoxCanFall());
        //console.log('wall ' + this.CheckBoxOnWall());
        //console.log('worm ' + this.CheckBoxOnWorm());
        if (!this.isFalling ) {
            if (this.CheckBoxCanFall()) {
                this.BoxFalling();
            }           
        }
    }

    onLoad() {
    }

    protected OnInit() {
        //console.log('box onInit');

        if (GameManager._instance) {
            const worm = GameManager._instance.worm;
            if (worm) {
                this.wormControl = worm.getComponent(wormController);
                console.log('found worm');
            }
            else {
                console.log('cant found worm');
            }
        }
        else {
            console.log('can found gameManager');
        }
    }

    //box di chuyen step by step
    BoxMoveByStep(director: Vec3) {
        const nodePos = this.node.position.clone();
        //this.node.setPosition(nodePos.add(director));
        tween(this.node)
            .to(this.wormControl.bodyMoveDuration, { position: nodePos.add(director) }, { easing: 'sineInOut' })
            .start();
    }

    //kiem tra box co the roi hay khong
    CheckBoxCanFall() {
        if (!this.CheckBoxOnWall() && !this.CheckBoxOnWorm()) {
            return true;
        }
        return false;
    }

    //kiem tra box co dang tren tuong hay khong
    CheckBoxOnWall() {
        if (this.node) {
            const nodePos = this.node.position.clone();
            const targetPos = nodePos.add(this.wormControl._down);
            const mapPrefabs = this.wormControl.map.children;

            for (let child of mapPrefabs) {
                if (child.position.equals(targetPos)) {
                    if (child.name == Constant.MAP_MAP || child.name == Constant.MAP_BOX || child.name===Constant.MAP_SCAFFOLD) {
                        //console.log('collider');
                        return true;
                    }
                }
            }
        }
        return false;
    }

    //kiem tra box co nam tren worm hay khong
    CheckBoxOnWorm(): boolean {
        //const nodePos0 = this.node.position.clone();
        const nodePos = this.node.position.clone().add(this.wormControl._down).toString();
        return this.wormControl.pointWormMoveSet.has(nodePos);
    }

    //box roi
    BoxFalling() {
        this.isFalling = true;
        //console.log('--------------------------------------------------------------------------falling');
        //console.log('check worm ' + this.CheckBoxOnWorm());
        this.CreateBoxTween(() => {
            this.isFalling = false;
            this.canFalling = this.CheckBoxCanFall();
        });
    }

    //tao hieu ung box roi
    CreateBoxTween(OnComplete) {
        const nodePos = this.node.position.clone();
        tween(this.node)
            .to(this.wormControl.bodyMoveDuration * this.ratioDuration, { position: nodePos.add(this.wormControl._down) }, { easing: 'sineInOut' })
            .call(OnComplete)
            .start();
    }

}


