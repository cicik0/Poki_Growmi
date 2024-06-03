import { _decorator, Component, Node } from 'cc';
import { BoxController } from './BoxController';
const { ccclass, property } = _decorator;

@ccclass('NormalBoxController')
export class NormalBoxController extends BoxController {
    start() {
        super.start();
    }


}


