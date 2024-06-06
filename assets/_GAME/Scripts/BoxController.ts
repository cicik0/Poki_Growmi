import { _decorator, CCFloat, Component, director, find, Node, tween, Vec3 } from 'cc';
import { wormController } from './wormController';
import { Constant } from './Constant';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('BoxController')
export class BoxController extends Component {

    wormControl: wormController;

    durationFall: number = 0.01;
    canFalling: boolean;
    isFalling: boolean = false;
    isMoveing: boolean = false;

    start() {
        this.OnInit();

        this.canFalling = this.CheckBoxCanFall();
    }

    update(deltaTime: number) {
        //console.log('update box');
        //console.log(this.CheckBoxCanFall());
        //console.log('wall ' + this.CheckBoxOnWall());
        //console.log('worm ' + this.CheckBoxOnWorm());
        //console.log(this.isFalling);
        //if (!this.isFalling) {
        //
        //    //console.log('worm ' + this.CheckBoxOnWorm());
        //    if (this.CheckBoxCanFall()) {
        //        this.BoxFalling();
        //        if (!this.CheckBoxCanFall()) {
        //            this.isMoveing = false;
        //        }
        //    }
        //}
        //this.BoxFalling();
        if (!this.isFalling && this.CheckBoxCanFall()) {
            this.BoxFalling();
        }
    }

    onLoad() {
        //this.node.on('checkFaliing', this.HandleCheckFalling, this);
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
        //this.CreateBoxMove(director).then(() => {
        //    console.log('box pos ' + this.node.position);
        //    this.BoxFalling();
        //});
        const nodePos = this.node.position.clone();
        this.node.setPosition(nodePos.add(director));
        this.BoxFalling();
        //console.log('box pos ' + this.node.position);

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
        this.wormControl.UpdateWormMoveSet();
        const nodePos = this.node.position.clone().add(this.wormControl._down).toString();
        //console.log('Checking box at position:', nodePos);
        console.log('Worm positions set:', Array.from(this.wormControl.pointWormMoveSet).join(", "));
        return this.wormControl.pointWormMoveSet.has(nodePos);
    }

    //box roi
    BoxFalling() {
        //console.log('box falling');
        //this.isFalling = true;
        //console.log('--------------------------------------------------------------------------falling');
        //console.log('check worm ' + this.CheckBoxOnWorm());
        //this.CreateBoxTween(() => {
            //this.BoxFalling();
            //this.isFalling = false;
            //this.canFalling = this.CheckBoxCanFall();
        //});  
        console.log(this.CheckBoxCanFall());
        console.log('wall ' + this.CheckBoxOnWall());
        console.log('worm ' + this.CheckBoxOnWorm());
        if (this.CheckBoxCanFall()) {
            this.isFalling = true;
            this.CreateBoxTween(() => {
                if (this.CheckBoxCanFall()) {
                    this.BoxFalling();
                }
                else {
                    this.isFalling = false;
                }                
            });
        }
    }

    //tao hieu ung box roi
    CreateBoxTween(OnComplete) {
        const nodePos = this.node.position.clone();
        tween(this.node)
            .to(this.durationFall*10, { position: nodePos.add(this.wormControl._down) }, { easing: 'sineInOut' })
            .call(OnComplete)
            .start();
    }

    //tao hieu ung box move
    async CreateBoxMove(director: Vec3) {
        const nodePos = this.node.position.clone();
        //this.node.setPosition(nodePos.add(director));
        tween(this.node)
            .to(this.durationFall*5, { position: nodePos.add(director) }, { easing: 'sineInOut' })
            .start();
    }


    onDestroy() {
        //this.node.off('checkFalling');
    }
}


