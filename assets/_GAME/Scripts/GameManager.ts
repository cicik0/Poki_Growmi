import { _decorator, Component, Node, input, Input, KeyCode, EventKeyboard,game, director, Director, find, CCString } from 'cc';
import { wormController } from './wormController';
import { Constant } from './Constant';
const { ccclass, property } = _decorator;

enum GameState {
    GAME_PAUSE,
    GAME_WIN,
    GAME_PLAY,
    MAIN_MENU
}

@ccclass('GameManager')
export class GameManager extends Component {

    //tao instance static
    public static _instance: GameManager;

    public static gameState: GameState;

    currentMap: number = 0;

    @property({
        type: wormController,
        tooltip: 'this worm'
    })
    public worm: wormController;

    @property({
        type: CCString
    })
    public maps: string[] = [];

    onLoad() {
        if (GameManager._instance == null) {
            GameManager._instance = this;
            director.addPersistRootNode(this.node);
            this.OnInit();
        }
        else {
            this.destroy();
        }

        director.on(Director.EVENT_AFTER_SCENE_LAUNCH, this.OnSceneLoad, this);

        //if (this.node.hasEventListener('finishmap')) {
        //    console.log('Event finishmap is registered');
        //} else {
        //    console.log('Event finishmap is not registered');
        //}
    }


    OnInit() {
        this.node.on('finishmap', this.HandelFinishMap, this);
        this.node.on('winGame', this.HandelWinGame, this);
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        //input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    start() {

    }

    onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case 38: //up
            case 87: //w
                //this.worm.wormMoveWithBody(this.worm.moveUp);
                //this.worm.wormMoveWithoutBody(this.worm.moveUp);
                this.worm.WormMove(this.worm._up);
                break;
            case 40: //down
            case 83: //s
                //this.worm.wormMoveWithBody(this.worm.moveDown);
                //this.worm.wormMoveWithoutBody(this.worm.moveDown);
                this.worm.WormMove(this.worm._down);
                break;
            case 37: //left
            case 65: //a
                //this.worm.wormMoveWithBody(this.worm.moveLeft);
                //this.worm.wormMoveWithoutBody(this.worm.moveLeft);
                this.worm.WormMove(this.worm._left);
                break;
            case 39: //right
            case 68: //d
                //this.worm.wormMoveWithBody(this.worm.moveRight);
                //this.worm.wormMoveWithoutBody(this.worm.moveRight);
                this.worm.WormMove(this.worm._right);
                break;
            case KeyCode.KEY_F:
                console.log(this.worm.pointWormMove); //test funcion, REMEMBER DELETE
                //console.log(this.worm.pointWormMove.length);
                //this.worm.CheckDirectorMoved();
                //console.log('return ' + this.worm.CheckDirectorMoved());
                console.log('current map ' + this.currentMap);
                break;
        }
    }

    updateGameState(newState: GameState) {
        const gameState = newState;

        switch (newState) {
            case GameState.MAIN_MENU:
                this.HandleMainMenu();
                break;
            case GameState.GAME_PLAY:
                this.HandleGamePlay();
                break;
            case GameState.GAME_WIN:
                this.HandleGameWin();
                break;
            case GameState.GAME_PAUSE:
                this.HandleGamePlay();
                break;
        }
    }
    HandleGameWin() {
        
    }
    HandleGamePlay() {
        
    }

    HandleMainMenu() {
        
    }

    //load scene moi theo ten
    LoadScene(sceneName: string) {
        director.loadScene(sceneName, () => {
            console.log(`${sceneName} scene loaded`);
            this.RegisterWormController();
        });
    }

    //khi het map, chuyen scene moi
    HandelFinishMap() {
        console.log('current map ' + this.maps[this.currentMap]);
        this.currentMap++;
        if (this.maps[this.currentMap]) {
            this.LoadScene(this.maps[this.currentMap]);
            //this.currentMap++;
        }
    }

    //khi win game
    HandelWinGame() {
        this.LoadScene(Constant.MAP_WIN);
    }

    //lay worm trong moi map
    OnSceneLoad() {
        this.RegisterWormController();
    }

    //dang ki su kien chuyem map
    RegisterWormController() {
        const wormNode = find('Canvas/WORM');
        if (wormNode) {
            const wormControl = wormNode.getComponent(wormController);
            if (wormControl) {
                this.worm = wormControl;
                wormNode.on('finishmap', this.HandelFinishMap, this);
                wormNode.on('winGame', this.HandelWinGame, this);
            }
            else {
                console.error('can find wormcontroller');
            }
        }
    }

    onDestroy() {
        this.node.off('finishmap', this.HandelFinishMap, this);
        this.node.off('winGame', this.HandelWinGame, this);
        director.off(Director.EVENT_AFTER_SCENE_LAUNCH, this.OnSceneLoad, this);
    }
}

