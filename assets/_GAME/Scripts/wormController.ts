import { _decorator, CCFloat, CCInteger, Component, debug, director, easing, instantiate, Node, Prefab, tween, Vec3 } from 'cc';
import { Constant } from './Constant';
import { BoxController } from './BoxController';
const { ccclass, property } = _decorator;


@ccclass('wormController')
export class wormController extends Component {


    @property({
        type: Node
    })
    public map: Node | null;


    @property({
        type: CCInteger
    })
    public bodyLength: number;

    @property({
        type: Node
    })
    public bodyNode: Node;

    @property({
        type: Prefab
    })
    public prefabBodyWorm: Prefab;

    @property({
        type: CCFloat
    })
    public bodyMoveDuration: number;

    moveDistance: number = 100;
    pointWormMoveSet: Set<string> = new Set<string>();
    currentBodyPoint: number;
    pointWormMove: Vec3[] = [];
    canMoveBack: boolean;
    isBoxMove: boolean;
    moveIndex: number;

    isFinishMap: boolean = false;

    onLoad() {
        this.CreateBodyWorm();
        this.currentBodyPoint = 0;
        this.pointWormMove.push(this.node.position);
        this.UpdateWormMoveSet();
        //director.addPersistRootNode(this.node);
        //this.box?.on('boxCanMove', this.CheckBoxCanMove, this);
    }

    start() {
        this.OnInit();
    }

    update(deltaTime: number) {

    }

    //huong di chuyen
    _left: Vec3 = new Vec3(-this.moveDistance, 0);
    _right: Vec3 = new Vec3(this.moveDistance, 0);
    _up: Vec3 = new Vec3(0, this.moveDistance);
    _down: Vec3 = new Vec3(0, -this.moveDistance);

    //kiem tra kieu di chuyen tren ground
    isTouchGround: boolean;   

    //box
    box: Node;

    //cap nhat set luu vi tri worm
    UpdateWormMoveSet() {
        this.pointWormMoveSet.clear();
        for (const point of this.pointWormMove) {
            this.pointWormMoveSet.add(point.toString());
        }
    }

    //di chuyen sau khi nhan phim
    WormMoveByStep(director: Vec3) {
        const nodePos = this.node.position.clone();
        this.node.setPosition(nodePos.add(director));
        this.UpdateWormMoveSet();
        if (this.CheckWinGame()) {
            this.node.emit('winGame');
        }
    }

    //khoi tao than sau ban dau
    CreateBodyWorm() {
        this.bodyNode.removeAllChildren();
        for (let i = 0; i < this.bodyLength; i++) {
            const bodyPart = instantiate(this.prefabBodyWorm);
            bodyPart.setPosition(this.node.position.clone());
            this.bodyNode.addChild(bodyPart);
        }
    }

    //lay ra box
    OnInit() {
        const canvas = director.getScene()?.getChildByName('Canvas');
        if (!canvas) {
            console.error('Canvas not found');
            return;
        }

        // Lấy node map từ canvas
        const map = canvas.getChildByName('Map');
        if (!map) {
            console.error('Map not found');
            return;
        }

        // Lấy node hộp từ map
        this.box = map.getChildByName(Constant.MAP_BOX);
        if (!this.box) {
            console.error('Box not found in map');
        } else {
            console.log('Box found:');
        }
    }

    //----------------------------------------------------------------------------------------------------------
    //kiem tra viec di chuyen co bi chan boi map hay khong
    CheckWall(director: Vec3): boolean {
        if (this.node) {
            const nodePos = this.node.position.clone();
            const targetPos = nodePos.add(director);
            const mapPrefabs = this.map.children;

            for (let child of mapPrefabs) {
                if (child.position.equals(targetPos)) {
                    if (child.name == Constant.MAP_MAP || child.name == Constant.MAP_BLOCK) {
                        //console.log('collider');
                        return true;
                    }
                }
            }
        }
        return false;
    }

    //kiem tra wrom da day box hay chua
    CheckWormTounchBox(director: Vec3): boolean {
        if (this.box) {
            const boxPos = this.box.position.clone();
            const nodePos = this.node.position.clone();
            if (nodePos.add(director).equals(boxPos)) {
                return true;
            }

            return false;
        }        
    }

    //kiem tra di chuyen co day duoc box hay khong?
    CheckBoxCanMove(director: Vec3): boolean {
        if (this.box) {
            const boxPos = this.box.position.clone();
            const targetPos = boxPos.add(director);
            const mapPrefabs = this.map.children;

            for (let child of mapPrefabs) {
                if (child.position.equals(targetPos)) {
                    if (child.name == Constant.MAP_BLOCK || Constant.MAP_MAP) {
                        return false;
                    }
                }
            }
            return true;
        }      
    }

    //kiem tra co di chuyen tren mat ground hay khong
    //hai kieu di chuyen: in ground, touch ground
    CheckMoveInGrond(direction: Vec3): boolean {
        let nodePos = this.node.position.clone();
        //console.log(nodePos + ' before move');
        nodePos = nodePos.add(direction).clone();
        const targetPos = nodePos.add(this._down);
        //console.log(nodePos + ' after move');
        const mapPrefabs = this.map.children;
        for (let child of mapPrefabs) {
            if (child.position.equals(targetPos)) {               
                if (child.name == Constant.MAP_MAP || child.name == Constant.MAP_BLOCK || child.name == Constant.MAP_BOX || Constant.MAP_FINISH) {
                    //console.log('check finish map');

                    if (this.pointWormMove.length == 1) {
                        this.isTouchGround = false;
                    }
                    else {
                        this.isTouchGround = true;
                    }

                    if (child.name == Constant.MAP_FINISH) {
                        //console.log('finish map');

                        if (this.node.hasEventListener('finishmap')) {
                            console.log('Event finishmap is being listened to');
                        } else {
                            console.log('Event finishmap is not being listened to');
                        }

                        this.node.emit('finishmap');
                    }

                    return true;                   
                }              
            }
        }
        return false;
    }

    //kiem tra huong da di chuyen, check trang thai di chuyen
    CheckDirectorMoved(): Vec3 {
        const nodePos = this.node.position.clone();
        const _length = this.pointWormMove.length;
        
        const _left = this.node.position.clone().add(this._left);
        const _right = this.node.position.clone().add(this._right);
        const _up = this.node.position.clone().add(this._up);
        const _down = this.node.position.clone().add(this._down);
        

        
        if (this.pointWormMove[_length - 2]) {
            //console.log('check moved point ' + this.pointWormMove[_length - 2]);
            //console.log('current node: ' + nodePos);
            if (this.pointWormMove[_length - 2].equals(_up)) {
                //console.log('current node: ' + nodePos);
                return this._up;
            }
            if (this.pointWormMove[_length - 2].equals(_down)) {
                //console.log('current node: ' + nodePos);
                return this._down;
            }

            if (this.pointWormMove[_length - 2].equals(_left)) {
                //console.log('current node: ' + nodePos);
                return this._left;
            }
            if (this.pointWormMove[_length - 2].equals(_right)) {
                //console.log('current node: ' + nodePos);
                return this._right;
            }
        }
        else {
            //console.log('dont go or back');
        }   
    }

    //kiem tra khi win game
    CheckWinGame(): boolean {

        if (this.node) {
            const mapPrefabs = this.map.children;

            for (let child of mapPrefabs) {
                if (child.position.equals(this.node.position)) {
                    return true;
                }
            }
        }
        return false;
    }

    //----------------------------------------------------------------------------------------------------------
    //di chuyen co dieu kien kiem tra
    WormMove(director: Vec3) {
        if (!this.CheckWall(director)) {
            if (this.box) {
                if (this.CheckWormTounchBox(director)) {
                    if (this.CheckBoxCanMove(director) && this.currentBodyPoint < this.bodyLength) {
                        this.box.getComponent(BoxController).BoxMoveByStep(director);
                        if (this.CheckMoveInGrond(director)) {
                            if (this.isTouchGround) {
                                //console.log('touch in ground');
                                this.WormMoveControl_TounchGround(director);
                            }
                            else {
                                this.WormMoveControl_OnGround(director);
                            }
                        }
                        else {
                            this.WormMoveControl_Go(director);
                            this.WormMoveControl_Back(director);
                        }
                    }
                    return;
                }
            }

            //console.log('check tounch ground' + this.CheckMoveInGrond(director));
            if (this.CheckMoveInGrond(director)) {
                if (this.isTouchGround) {
                    console.log('touch in ground');
                    this.WormMoveControl_TounchGround(director);
                }
                else {
                    this.WormMoveControl_OnGround(director);
                }
            }
            else {
                this.WormMoveControl_Go(director);
                this.WormMoveControl_Back(director);
            }
            
        }
    }

    //kiem soat vi tri ma worm da di qua
    WormMoveControl_Go(director: Vec3) {
        const _length = this.pointWormMove.length;
        const nodePos = this.node.position.clone();
        //console.log(nodePos + ' before move');
        if (this.currentBodyPoint < this.bodyLength) {
            const nextPos = this.node.position.clone();
            if (_length >= 2 && nextPos.add(director).equals(this.pointWormMove[_length - 2])) {
                this.canMoveBack = true;
                return;
            }
            if (_length >= 2) {
                //console.log(nodePos + 'old_node');
                //console.log(this.pointWormMove[_length - 2] + ' length-2');
                this.pointWormMove.splice(_length - 1, 0, nodePos);
            } else {
                //console.log(nodePos + 'node');
                //console.log(this.pointWormMove[_length - 2] + ' length-2');
                this.pointWormMove.unshift(nodePos);
            }
            this.WormMoveByStep(director);
            //console.log("after move: " + this.node.position);
            this.currentBodyPoint++;

            //dieu khien body worm
            this.BodyMoveControl_Go_Back();

            console.log('go');
            this.canMoveBack = false;
        }
        else {
            this.canMoveBack = true;
        }
    }

    WormMoveControl_Back(director: Vec3) {
        if (this.canMoveBack) {
            const _length = this.pointWormMove.length;
            const nodePos = this.node.position.clone();
            if (nodePos.add(director).equals(this.pointWormMove[_length - 2])) {
                //console.log(this.pointWormMove[0]);
                this.pointWormMove.splice(_length - 2, 1);
                this.WormMoveByStep(director);

                //dieu khien body worm
                this.BodyMoveControl_Go_Back();

                if (this.currentBodyPoint > 0) {
                    this.currentBodyPoint--;
                }
                console.log('back');
            }
        }
        this.canMoveBack = false;
    }

    WormMoveControl_OnGround(director: Vec3) {
        this.WormMoveByStep(director);
        this.BodyMoveControl_OnGround();
        console.log('move on ground');
    }

    WormMoveControl_TounchGround(director: Vec3) {
        console.log(this.currentBodyPoint);
        console.log(this.bodyLength);
        console.log(this.CheckDirectorMoved()+ '/' + director);

        if (this.currentBodyPoint < this.bodyLength) {
            //console.log('touch ground');

            if (director.equals(this.CheckDirectorMoved())) {
                //if (director.equals(this._down) && this.pointWormMove.length == 2) {
                    
                //}
                //else {
                //    console.log('go_touch');
                //    this.moveIndex = 0;
                //    this.WormMoveControl_Go(director);
                //    const arrayLength = this.pointWormMove.length;
                //    this.BodyMoveControl_TounchGround(0, arrayLength - 1);
                //}
                console.log('back_touch');
                this.canMoveBack = true;
                this.WormMoveControl_Back(director);
            }
            else {
                this.moveIndex = 0;
                this.WormMoveControl_Go(director);
                const arrayLength = this.pointWormMove.length;
                this.BodyMoveControl_TounchGround(0, arrayLength - 1);
            }
        }
        //console.log('move touch ground');
    }

    //----------------------------------------------------------------------------------------------------------
    //dieu khien phan than di chuyen theo worm go va back
    BodyMoveControl_Go_Back() {
        for (let i = 0; i < this.bodyLength; i++) {
            if (this.pointWormMove[i]) {
                this.bodyNode.children[i].position = this.pointWormMove[i].clone();
            }
            else {
                this.bodyNode.children[i].position = this.node.position.clone();
            }
        }
    }

    BodyMoveControl_OnGround() {
        for (let i = 0; i < this.bodyLength; i++) {
            this.bodyNode.children[i].position = this.node.position.clone();
        }
    }

    BodyMoveControl_TounchGround(startIndex: number, checkIndex: number) {
        if (startIndex < checkIndex) {
            const targetNode = this.bodyNode.children[startIndex];
            let endPos;
            if (this.pointWormMove[startIndex + 1].equals(this.node.position)) {
                endPos = this.node.position.clone();
            }
            else {
                endPos = this.pointWormMove[startIndex + 1];
            }

            this.CreateTweenBodyWorm(targetNode, endPos, () => {
                if (startIndex + 1 == checkIndex && checkIndex > 1) {
                    checkIndex--;
                    startIndex = 0;
                    this.pointWormMove.shift();
                    this.BodyMoveControl_TounchGround(startIndex, checkIndex);
                }
                else {
                    startIndex++;
                    this.BodyMoveControl_TounchGround(startIndex, checkIndex);
                }

            })
        }
        else {
            this.ResetPontOfBodyWorm();
        }
        console.log('body move');
    }

    //hieu ung than sau di chuyen
    CreateTweenBodyWorm(_partBody: Node, _targetPos: Vec3, OnComplete) {
        //console.log('tween');
        tween(_partBody)
            .to(this.bodyMoveDuration, { position: _targetPos }, { easing: 'sineInOut' })
            .call(OnComplete)
            .start();
    }

    //lam moi vi tri than sau khi tounch ground
    ResetPontOfBodyWorm() {
        this.pointWormMove = [this.node.position];
        this.currentBodyPoint = 0;
    }
}


