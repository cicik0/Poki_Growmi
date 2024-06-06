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

    onLoad() {
        //console.log('hello');

        director.on(Director.EVENT_AFTER_SCENE_LAUNCH, this.OnSceneLoad, this);
        
    }

    start() {

    }

    update(deltaTime: number) {
    }

    OnSceneLoad() {
        this.maxBodyPoint = GameManager._instance.worm.bodyLength;
        console.log(this.maxBodyPoint);
        this.CreateUIBodyPoint();
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
        const prefabs = this.node.children;
        for (let i = 1; i < prefabs.length; i++) {
            prefabs[i].position = prefabs[i - 1].position.add(new Vec3(-50, 0, 0));
            console.log( i, prefabs[i]);
        }
    }

    onDestroy() {
        //director.off(Director.EVENT_AFTER_SCENE_LAUNCH, this.OnSceneLoad, this);
    }
}


