import { _decorator, Component, Director, director, instantiate, Label, Node, Prefab, Vec3 } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('BodyPointController')
export class BodyPointController extends Component {

    @property({
        type: Prefab
    })
    public bodyPointPrefab: Prefab;

    maxBodyPoint: number;
    currentBoidyPoint : number;

    onLoad() {
        //console.log('hello');

        director.on(Director.EVENT_AFTER_SCENE_LAUNCH, this.OnSceneLoad, this);
        
    }

    start() {

    }

    update(deltaTime: number) {
        //console.log('current body point ' + this.currentBoidyPoint);
        this.currentBoidyPoint = GameManager._instance.worm.pointWormMove.length;
        this.UpdateBodyPointUI();
    }

    OnSceneLoad() {
        this.maxBodyPoint = GameManager._instance.worm.bodyLength;
        this.CreateUIBodyPoint();
        //console.log('body point ' + this.maxBodyPoint);
        //console.log('current body point ' + this.currentBoidyPoint);
    }

    CreateUIBodyPoint() {
        this.node.removeAllChildren();        
        for (let i = 0; i < this.maxBodyPoint; i++) {
            let bodyPoint = instantiate(this.bodyPointPrefab);
            this.node.addChild(bodyPoint);            
        }
        this.SetPositionUIBodyPoint();
    }

    SetPositionUIBodyPoint() {
        const addDistance = new Vec3(50, 0, 0);
        const prefabsPos = [];
        const prefabs = this.node.children;
        console.log('check body ' + prefabs.length);
        for (let i = 0; i < this.maxBodyPoint; i++) {
            prefabsPos.push(addDistance.clone().multiplyScalar(i+1));
            prefabs[i].position = prefabsPos[i];
        }
        console.log(prefabsPos);
    }

    UpdateBodyPointUI(){
        const prefabs = this.node.children;
        for(let i = 0; i<this.maxBodyPoint; i++){
            if(i<this.currentBoidyPoint-1){
                prefabs[i].active = false;
            }
            else{
                prefabs[i].active = true;
            }
        }
    }

    onDestroy() {
        //director.off(Director.EVENT_AFTER_SCENE_LAUNCH, this.OnSceneLoad, this);
    }
}


