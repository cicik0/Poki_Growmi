import { _decorator, CCFloat, CCInteger, Component, debug, director, easing, instantiate, Node, Prefab, tween, Vec3 } from 'cc';
import { Constant } from './Constant';
import { BoxController } from './BoxController';
import { NormalBoxController } from './NormalBoxController';
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
    //canMoveBack: boolean;
    //isBoxMove: boolean;
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
    boxes: Node[];

    //cap nhat set luu vi tri worm
    UpdateWormMoveSet() {
        this.pointWormMoveSet.clear();
        //console.log('point ' + this.pointWormMove);
        for (const point of this.pointWormMove) {
            this.pointWormMoveSet.add(point.toString());
        }
        //console.log('set ' + Array.from(this.pointWormMoveSet).join(", "));

    }

    //di chuyen sau khi nhan phim
    async WormMoveByStep(director: Vec3) {
        if (director.equals(this._up)) {
            const duration_up = 0.01;
            const nodePos = this.node.position.clone();
            //this.node.setPosition(nodePos.add(director));
            //await this.CreateTweenWorm(this.node, nodePos.add(director), duration_up).then(() => {
            //    this.UpdateWormMoveSet();
            //});
            this.node.setPosition(nodePos.add(director));
            this.UpdateWormMoveSet();
        }
        else {
            const nodePos = this.node.position.clone();
            //this.node.setPosition(nodePos.add(director));
            await this.CreateTweenWorm(this.node, nodePos.add(director), this.bodyMoveDuration).then(() => {
                this.UpdateWormMoveSet();
            });
        }
        

        //if (this.CheckWinGame()) {
        //    this.node.emit('winGame');
        //}
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
        this.boxes = map.children.filter(child => child.name === Constant.MAP_BOX || child.name === Constant.MAP_KEY);
        if (this.boxes.length === 0) {
            console.error('Box not found in map');
        } else {
            console.log(`Found ${this.boxes.length} boxes`);
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
                    if (child.name === Constant.MAP_MAP || (child.name === Constant.MAP_DOOR && child.active === true)) {
                        //console.log('collider');
                        return true;
                    }
                }
            }
        }
        return false;
    }

    //kiem tra wrom da day box hay chua
    CheckWormTounchBox(director: Vec3): Node | null {
        for (let box of this.boxes) {
            const boxPos = box.position.clone();
            const nodePos = this.node.position.clone();
            if (nodePos.add(director).equals(boxPos)) {
                return box;
            }
        }
        return null;
    }

    //kiem tra di chuyen co day duoc box hay khong?
    CheckBoxCanMove(box: Node, director: Vec3): boolean {
        const boxPos = box.position.clone();
        const targetPos = boxPos.add(director);
        const prefabs = this.map.children;

        for (let child of prefabs) {
            if (child.position.equals(targetPos)) {
                if (child.name === Constant.MAP_MAP || child.name === Constant.MAP_BOX) {
                    return false;
                }
            }
        }
        return true;
    }   

    //kiem tra co di chuyen tren mat ground hay khong
    //kieu di chuyen: in ground
    CheckMoveInGrond(direction: Vec3): boolean {
        let nodePos = this.node.position.clone();
        nodePos = nodePos.add(direction).clone();

        const targetPos = nodePos.add(this._down);
        const mapPrefabs = this.map.children;

        for (let child of mapPrefabs) {
            if (child.position.equals(targetPos)) {
                if (child.name == Constant.MAP_MAP || child.name == Constant.MAP_BLOCK || child.name === Constant.MAP_BOX || child.name === Constant.MAP_FINISH || child.name === Constant.MAP_KEY || child.name === Constant.MAP_SCAFFOLD) {
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

    //kieu di chuyen: touch ground
    CheckMoveTounchGround(director: Vec3) {

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

    //kiem tra do dai than
    Check_IfEnoughBodyLength(): boolean {
        if (this.pointWormMove.length == this.bodyLength + 1) {
            return true; 
        }
        return false; 
    }

    //kiem tra khi win game
    CheckWinGame(): boolean {

        if (this.node) {
            const mapPrefabs = this.map.children;

            for (let child of mapPrefabs) {
                if (child.name == Constant.MAP_WIN && child.position.equals(this.node.position)) {
                    return true;
                }
            }
        }
        return false;
    }

    //kiem tra co the go
    CheckCan_Go(director: Vec3): boolean {
        if (this.pointWormMove.length != this.bodyLength + 1) {
            const nodePos = this.node.position.clone();
            const targetPos = nodePos.add(director);
            for (let i = this.pointWormMove.length - 1; i >= 0; i--) {
                if (targetPos.equals(this.pointWormMove[i])) {
                    return false;
                }
            }
            return true;
        }
        else {
            return false;
        }
        
    }

    //kiem tra co the back
    CheckCan_Back(director: Vec3): boolean {
        const _length = this.pointWormMove.length;
        const nodePos = this.node.position.clone();
        const targetPos = nodePos.add(director);
        if (this.pointWormMove[_length - 2]) {
            if (targetPos.equals(this.pointWormMove[_length - 2])) {
                return true;
            }
            return false;
        }
        else {
            return false;
        }
        
    }

    //----------------------------------------------------------------------------------------------------------
    //di chuyen co dieu kien kiem tra
    WormMove(director: Vec3) {

        if (!this.CheckWall(director) && this.pointWormMove.length-1 <= this.bodyLength) {
            if (this.CheckWormTounchBox(director)) {
                const touchBox = this.CheckWormTounchBox(director);
                if (touchBox && this.pointWormMove.length <= this.bodyLength) {
                    if (this.CheckBoxCanMove(touchBox, director)) {

                        this.HandleWormMove(director).then(() => {
                            touchBox.getComponent(BoxController).BoxMoveByStep(director);
                            //touchBox.getComponent(BoxController).isMoveing = true;
                            //this.node.emit('checkFalling');
                        })
                        //touchBox.getComponent(BoxController).BoxMoveByStep(director);
                        //this.HandleWormMove(director);
                        //this.UpdateWormMoveSet();
                        return;
                    }
                    else {
                        return;

                    }
                }

            }            

            this.HandleWormMove(director);
        } 
        //console.log('SET ' + this.pointWormMoveSet);
    }

    async HandleWormMove(director: Vec3) {
        if (this.CheckMoveInGrond(director)) {
            if (this.pointWormMove.length == 1) {
                this.WormMoveControl_OnGround(director);
            }
            else {
                if (this.CheckCan_Back(director)) {
                    this.WormMoveControl_Back(director);
                } else {
                    if (this.CheckCan_Go(director)) {
                        //go va set vi tri body
                        this.WormMoveControl_Go(director).then(() => {
                            this.BodyMoveControl_TounchGround(0, this.pointWormMove.length - 1);
                        });
                    }
                }               
            }
        }
        else {
            if (this.CheckCan_Go(director)) {
                this.WormMoveControl_Go(director);
            }

            if (this.CheckCan_Back(director)) {
                this.WormMoveControl_Back(director);
            }
        }
    }

    //kiem soat worm di chuyen
    //go: tien len
    async WormMoveControl_Go(director: Vec3) {
        const prefabs = this.bodyNode.children;

        //them vi tri moi
        if (this.pointWormMove.length == 1) {
            this.pointWormMove.unshift(this.node.position.clone());
            //console.log('them pos lan 1 ' + this.pointWormMove);
        }
        else {
            this.pointWormMove.splice(this.pointWormMove.length-1, 0, this.node.position.clone());
            //console.log('them pos lan n ' + this.pointWormMove);
        }

        await this.WormMoveByStep(director).then(() => {
            //console.log('sau khi move ' + this.pointWormMove);

            this.BodyMoveControl_Go_Back();
            this.currentBodyPoint++;
        });

        //console.log(this.pointWormMove[0]);
        console.log('worm go-----');
        
    }

    //back: lui ve
    async WormMoveControl_Back(director: Vec3) {
        const _length = this.pointWormMove.length;

        if (this.pointWormMove[_length - 2]) {
            //xoa vi tri 
            //console.log('vi tri xoa ' + this.pointWormMove[_length - 2]);
            this.pointWormMove.splice(_length - 2, 1);
            //for (let i = 0; i < this.bodyLength; i++) {
            //    if (this.pointWormMove[i]) {
            //        prefabs[i].position = this.pointWormMove[i].clone();
            //    }
            //}
            await this.WormMoveByStep(director).then(() => {
                for (let i = 0; i < this.bodyLength; i++) {
                    this.BodyMoveControl_Go_Back();
                }
                this.currentBodyPoint--;

            });
        }      
        console.log('worm back-----');
    }

    WormMoveControl_OnGround(director: Vec3) {
        this.bodyNode.active = false;
        this.WormMoveByStep(director).then(() => {
            this.BodyMoveControl_OnGround();
            this.bodyNode.active = true;
        });
        //console.log('after: ' + this.node.position);
        console.log('move on ground');
    }

    WormMoveControl_TounchGround(director: Vec3) {
        //console.log(this.currentBodyPoint);
        //console.log(this.bodyLength);
        //console.log(this.CheckDirectorMoved()+ '/' + director);

        if (this.currentBodyPoint < this.bodyLength) {
            //console.log('touch ground');

            if (director.equals(this.CheckDirectorMoved())) {
                console.log('back_touch');
                //this.canMoveBack = true;
                this.WormMoveControl_Back(director);
            }
            else {
                console.log('go_touch');
                this.moveIndex = 0;
                this.WormMoveControl_Go(director).then(() => {
                    const arrayLength = this.pointWormMove.length;
                    this.BodyMoveControl_TounchGround(0, arrayLength - 1);
                });
                
            }
        }
        //console.log('move touch ground');
    }

    //----------------------------------------------------------------------------------------------------------
    //dieu khien body di chuyen
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
        //console.log(' move ' + this.node.position);
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
        //const targetNode = this.bodyNode.children[startIndex];
        //let endPos;
        //if (this.pointWormMove[startIndex + 1].equals(this.node.position)) {
        //    endPos = this.node.position.clone();
        //}
        //else {
        //     endPos = this.pointWormMove[startIndex + 1];
        //}

        //this.CreateTweenBodyWorm(targetNode, endPos, () => {
        //})
    }

    //hieu ung body worm di chuyen
    CreateTweenBodyWorm(_partBody: Node, _targetPos: Vec3, OnComplete) {
        //console.log('tween');
        tween(_partBody)
            .to(0.02, { position: _targetPos }, { easing: 'fade' })
            .call(OnComplete)
            .start();
    }

    //hieu dung worm di chuyen
    CreateTweenWorm(worm: Node, _targetPos: Vec3, duration: number): Promise<void> {
        return new Promise((resolve) => {
            tween(worm)
                .to(duration, { position: _targetPos }, { easing: 'sineInOut' })
                .call(resolve)
                .start();
        })
        
    }

    //lam moi vi tri than sau khi tounch ground
    ResetPontOfBodyWorm() {
        this.pointWormMove = [this.node.position];
        this.currentBodyPoint = 0;
    }
}


