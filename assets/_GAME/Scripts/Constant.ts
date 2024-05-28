import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Constant')
export class Constant extends Component {
    static readonly MAP_BLOCK: string = 'Block';
    static readonly MAP_MAP: string = 'map';
    static readonly MAP_BOX: string = 'BOX';
    static readonly MAP_FINISH: string = 'finishMap';

    static readonly MAP_1: string = 'map1';
    static readonly MAP_2: string = 'map2';
    static readonly MAP_3: string = 'map3';
    static readonly MAP_MENU: string = 'MainMenu';
    static readonly MAP_WIN: string = 'Win';

}


