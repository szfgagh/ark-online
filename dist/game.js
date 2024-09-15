'use strict';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */


function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

let actionScript = class actionScript extends Script {
    //绑定玩家
    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    onStart() {
        // 获取玩家
        const character1 = Player.localPlayer.character;
        // let myPlayer = Player.localPlayer;
        //     // 获取玩家控制角色
        //     let myCharacter = myPlayer.character;
        //this.character = this.gameObject.addComponent('Character');
        let chara = character1;
        //将坐着打招呼的动画资源转为二级姿态
        let stance = chara.loadSubStance("285631"); //姿态 下蹲285631
        //加载一个挥手的角色动画
        let animation = chara.loadAnimation("285185"); //动画 喂食285185
        // 添加一个按键方法：按下键盘“U”，执行以下逻辑
        InputUtil.onKeyDown(Keys.U, () => {
            //设置姿态效果为全身姿态
            stance.blendMode = StanceBlendMode.WholeBody;
            //播放姿态
            stance.play();
            stance.stop();
        });
        InputUtil.onKeyDown(Keys.I, () => {
            //停止姿态
            stance.stop();
            //设置姿态效果为下身姿态
            stance.blendMode = StanceBlendMode.BlendLower;
            //播放姿态
            stance.play();
        });
        // 添加一个按键方法：按下键盘“O”，执行以下逻辑
        InputUtil.onKeyDown(Keys.O, () => {
            stance.blendMode = StanceBlendMode.BlendLower;
            //播放姿态
            stance.play();
            setTimeout(() => {
                stance.stop();
            }, 3500);
            //设置动画的播放部位为下半身
            animation.slot = AnimSlot.Upper;
            //播放动画
            animation.play();
            // 发送本地事件，事件名我们可以随便自定义，但是要保证发送方和接收方的事件名一致，否则接收不到事件	
            // 这里我们定义事件名为"client_local_event_feed"喂食	
            Event.dispatchToLocal("client_local_event_feed");
        });
    }
};
actionScript = __decorate([
    Component
], actionScript);
var actionScript$1 = actionScript;

var foreign1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    default: actionScript$1
});

let DoorTrigger = 
//当玩家进入触发器时，门会旋转100度打开；当玩家离开触发器时，门会旋转回0度关闭。
class DoorTrigger extends Script {
    constructor() {
        super(...arguments);
        //isDoorOpen用于切换门的开关状态，
        this.isDoorOpen = false;
    }
    onStart() {
        this.door = this.gameObject.getChildByName("门");
        let localGameObject = this.gameObject;
        let trigger = localGameObject;
        if (SystemUtil.isClient()) {
            trigger.onEnter.add((other) => {
                if (other instanceof Character) {
                    this.openDoor();
                }
            });
            trigger.onLeave.add((gameObject) => {
                if (gameObject instanceof Character) {
                    setTimeout(() => {
                        this.closeDoor();
                    }, 1000);
                }
            });
        }
    }
    //开门
    openDoor() {
        if (this.isDoorOpen == false) {
            this.isDoorOpen = true;
            this.door.worldTransform.rotation = new Rotation(0, 0, 100);
        }
    }
    //关门
    closeDoor() {
        if (this.isDoorOpen) {
            this.isDoorOpen = false;
            this.door.worldTransform.rotation = new Rotation(0, 0, 0);
        }
    }
};
DoorTrigger = __decorate([
    Component
    //当玩家进入触发器时，门会旋转100度打开；当玩家离开触发器时，门会旋转回0度关闭。
], DoorTrigger);
var DoorTrigger$1 = DoorTrigger;

var foreign2 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    default: DoorTrigger$1
});

let follow = class follow extends Script {
    constructor() {
        super(...arguments);
        this.pet = null;
        this.refreshtime = 0;
        this.newVector = Vector.zero;
        this.catStandstanceID = "181291"; // 动画 猫站立  181291
        this.catRunstanceID = "181390"; // 动画 猫跑步 181293 猫走路 181390
    }
    /** 当脚本被实例后，会在第一帧更新前调用此函数  */
    async onStart() {
        if (SystemUtil.isServer()) {
            return;
        }
        this.pet = this.gameObject;
        await this.pet.asyncReady();
        this.pet.setCollision(PropertyStatus.On);
        this.useUpdate = true;
        let stance = this.pet.loadSubStance(this.catStandstanceID);
        let Runstance = this.pet.loadAnimation(this.catRunstanceID);
        Event.addLocalListener("petMove", () => {
            Runstance.play();
            stance.play();
            console.log("petMove");
        });
        //    let myPlayer = await Player.asyncGetLocalPlayer();
        //    // 获取本地玩家的角色
        //    let myCharacter = myPlayer.character;
        //    //let myPlayer = Player.localPlayer; // 获取当前客户端正在运行的玩家对象
        //    //let playerGroundContactPoint = myCharacter.groundContactPoint; // 获取玩家接触地面的位置 groundContactPoint don't exist in Character 
        //    //let playerZPosition = playerGroundContactPoint.z; 
        //    // 当按下键盘上的1键时，打印当前角色的位置信息
        //    InputUtil.onKeyDown(Keys.One, () => {
        //        console.log("当前角色z位置：" + myCharacter.worldTransform.position);
        //    });
    }
    onUpdate(dt) {
        let refresh = false;
        if (this.refreshtime < 0) {
            refresh = true;
            this.refreshtime = 0.5;
        }
        else {
            this.refreshtime -= dt;
        }
        const player = mw.Player.getPlayer(Player.localPlayer.userId);
        if (player && player.character) {
            const trans = player.character.worldTransform;
            //角色背对向量
            const charBackVec = trans.getForwardVector().negative;
            const model = this.pet;
            if (!model) {
                return;
            }
            if (!model.getVisibility()) {
                model.setVisibility(true);
                model.worldTransform.rotation = trans.rotation;
                //创建了一个向后移动50单位的新位置（基于Transform的正向向量）并且z轴为0的位置，并将角色的位置更新为此新位置。接着，新位置被重置为原始Transform的位置。
                this.newVector = trans.position.clone().add(charBackVec.clone().multiply(50));
                model.worldTransform.position = this.newVector;
                this.newVector = trans.position;
            }
            const prepos = model.worldTransform.position;
            //宠物当前位置
            let nowpos = new Vector(prepos.x, prepos.y, player.character.worldTransform.position.z); // trans.position.z
            console.log("nowpos " + nowpos);
            let backv = Vector.zero;
            let targetpos = Vector.zero;
            //玩家身后位置
            backv = charBackVec;
            //目标位置
            targetpos = this.newVector;
            if (refresh) {
                this.newVector = Vector.add(trans.position, Vector.multiply(backv, 90));
            }
            const dis = Vector.distance(nowpos, targetpos);
            //下一帧的新位置
            let newpos = Vector.zero;
            if (dis > 3) {
                newpos = Vector.moveTowards(nowpos, targetpos, 0.05 * dis);
                //在本地客户端上触发名为petMove的事件
                Event.dispatchToLocal("petMove");
                console.log("nowpos " + nowpos);
            }
            else {
                Event.dispatchToLocal("petEndMove");
                newpos = nowpos;
            }
            const offsetv = new Vector(0, 0, -60);
            model.worldTransform.position = Vector.add(newpos, offsetv);
            //console.log("newpos:"+newpos);
            model.worldTransform.rotation = backv.toRotation().add(new Rotation(0, 0, 180));
            console.log("model.worldTransform.position " + model.worldTransform.position);
        }
    }
};
follow = __decorate([
    Component
], follow);
var follow$1 = follow;

var foreign3 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    default: follow$1
});

/**
 * @Author       : lei.zhao
 * @Date         : 2023-02-16 09:42:19
 * @LastEditors  : lei.zhao
 * @LastEditTime : 2023-02-16 13:48:15
 * @FilePath     : \stumbleguys\Prefabs\GravityArea\Script\GravityArea.ts
 * @Description  : 修改描述
 */
const TEMP = new mw.Vector();
let GravityArea = class GravityArea extends mw.Script {
    constructor() {
        super(...arguments);
        // 用触发器确认进入进入的角色，建议使用数组
        this.characters = [];
        /**周期系数，用于模拟上下浮动的效果 */
        this.cycle = 0;
        /**周期乘法系数，用于模拟上下浮动的效果 */
        this.cycleMulit = 300;
    }
    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    onStart() {
        // if(mw.SystemUtil.isServer())return;
        let trigger = this.gameObject;
        trigger.onEnter.add((go) => {
            if (go instanceof mw.Character && !this.characters.includes(go)) {
                go.gravityScale = 0;
                go.addImpulse(mw.Vector.multiply(trigger.localTransform.getUpVector(), 1500, TEMP));
                this.characters.push(go);
            }
        });
        trigger.onLeave.add((go) => {
            if (go && this.characters.includes(go)) {
                go.gravityScale = 1;
                this.characters.splice(this.characters.indexOf(go), 1);
            }
        });
        this.rootPoint = new mw.Vector();
        this.size = mw.Vector.multiply(trigger.localTransform.scale, 100, this.rootPoint).length;
        //后方向量
        mw.Vector.multiply(trigger.localTransform.getUpVector(), -40, this.rootPoint);
        //中心点位置
        mw.Vector.add(trigger.worldTransform.position, mw.Vector.multiply(this.rootPoint, trigger.localTransform.scale, this.rootPoint), this.rootPoint);
        // 开启帧更新
        this.useUpdate = true;
    }
    /**
     * 周期函数 每帧执行
     * 此函数执行需要将this.useUpdate赋值为true
     * @param dt 当前帧与上一帧的延迟 / 秒
     */
    onUpdate(dt) {
        this.characters.forEach((character) => {
            // character["syncSetMovementMode"](0);
            let location = character.worldTransform.position;
            //运动方向
            mw.Vector.subtract(location, this.rootPoint, TEMP);
            //力度
            const force = (this.size - TEMP.length) * 2 - this.cycle;
            this.cycle += dt * this.cycleMulit;
            if (this.cycle > 200) {
                this.cycle = 200;
                this.cycleMulit = -this.cycleMulit;
            }
            else if (this.cycle < -200) {
                this.cycle = -200;
                this.cycleMulit = -this.cycleMulit;
            }
            mw.Vector.multiply(this.gameObject.localTransform.getUpVector(), dt * force, TEMP);
            // 添加距离需要用帧时间校准
            mw.Vector.add(location, TEMP, location);
            character.worldTransform.position = location;
        });
    }
    /** 脚本被销毁时最后一帧执行完调用此函数 */
    onDestroy() {
    }
};
GravityArea = __decorate([
    Component
], GravityArea);
var GravityArea$1 = GravityArea;

var foreign4 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    default: GravityArea$1
});

let Launch = class Launch extends Script {
    constructor() {
        super(...arguments);
        // 填写触发器的 GameObjectId this.gameObject as Trigger
        this.triggerGameObjectId = "31C3778E";
        // 填写交互物的 GameObjectId
        this.interactiveGameObjectId = "2771854A";
    }
    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    async onStart() {
        // 因为是坐下是个动作，我们只需要在客户端表现，这里就在客户端运行
        if (SystemUtil.isClient()) {
            let Interactor1 = this.gameObject;
            const character1 = Player.localPlayer.character;
            //   动画 坐姿鬼脸 280682
            await AssetUtil.asyncDownloadAsset("280682");
            // 获取交互物
            // const interactive = (await GameObject.asyncFindGameObjectById(this.interactiveGameObjectId)) as Interactor;
            // 获取触发器
            const trigger = (await GameObject.asyncFindGameObjectById(this.triggerGameObjectId));
            // 触发器事件绑定
            trigger.onEnter.add(go => {
                // 判断进入碰撞区域的对象是否为角色
                if (!(character1 instanceof Character)) {
                    // 不是角色，停止执行
                    return;
                }
                // 让该角色进入交互 坐姿鬼脸 280682
                Interactor1.enter(character1, HumanoidSlotType.Buttocks, "280682");
                console.log("onInteractiveStarted");
                //5000 毫秒后离开交互，并移动到(0,0,100)
                setTimeout(() => {
                    Interactor1.leave(); //new Vector(0, 0, 100)
                }, 5000);
            });
        }
    }
};
Launch = __decorate([
    Component
], Launch);
var Launch$1 = Launch;

var foreign5 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    default: Launch$1
});

let petScript = class petScript extends Script {
    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    async onStart() {
        if (SystemUtil.isClient()) {
            let npc3 = await this.gameObject;
            //加载角色动画资源
            const character1 = Player.localPlayer.character;
            let chara = character1;
            //将坐着打招呼的动画资源转为二级姿态
            let chara_stance = chara.loadSubStance("285631"); //姿态 下蹲285631
            //加载一个角色动画
            let chara_animation = chara.loadAnimation("285185"); //动画 喂食285185
            //const CC = npc3.loadAnimation("181295");//动画 猫吃东西 181295 
            let CC2 = npc3.loadAnimation("181298"); //动画   懒腰 181298
            npc3.loadStance("181291"); // 姿态 猫姿态 181291
            //let lazy = npc3.loadSubStance("181298");  //姿态   懒腰 181298
            npc3.loadAnimation("181289"); ///动画 奔跑 181289
            // 定义一个放姿态 assetId 的变量，后面引用
            // 假设这个是宠物
            let pet = npc3;
            await AssetUtil.asyncDownloadAsset("181298");
            await AssetUtil.asyncDownloadAsset("106699"); //特效 升级  106699
            //按下“1”键触发以下逻辑
            // InputUtil.onKeyDown(Keys.One, () => {
            //     //让角色动画播
            //     //让NPC3动画播放
            //     animation.play();//动画 181293 猫跑    
            //     //播放姿态
            //     CC2.play();
            //     // CC2.onFinish.add(() => {
            //     //     //在对象上播放特效（特效ID，目标对象）
            //     //     EffectService.playOnGameObject("106699", npc3, 
            //     //     {
            //     //         // //特效播放得插槽位置
            //     //         // slotType:HumanoidSlotType.Root,
            //     //         // //特效的旋转角度
            //     //         // rotation:new Rotation(0,0,-90)
            //     //     });
            //     // });
            //     // lazy.play();
            // }); 
            // InputUtil.onKeyDown(Keys.Two, () => {
            //     playCat()
            //    }); 
            Event.addLocalListener("开始撸猫", () => {
                //让玩家撸猫时，宠物朝向玩家，玩家朝向宠物
                //一个相机（Camera）对象将其朝向了一个NPC对象（npc3）
                let myCamera = Camera.currentCamera;
                chara.worldTransform.position;
                myCamera.lookAt(npc3);
                // 计算出宠物和玩家之间的向量
                // 计算宠物朝向
                let rotation = chara.worldTransform.position.clone().subtract(pet.worldTransform.position).toRotation();
                // 宠物朝向赋值，设置 rotation　y= 0
                rotation.y = 0;
                pet.worldTransform.rotation = rotation;
                // 玩家朝向赋值,返回一个与原来的旋转对象互补的旋转对象
                let PlayerRotation = rotation;
                PlayerRotation = PlayerRotation.subtract(new Rotation(0, 0, 180));
                chara.worldTransform.rotation = PlayerRotation;
                //让NPC3动画播放
                playCat();
                chara_stance.blendMode = StanceBlendMode.BlendLower;
                //播放姿态
                chara_stance.play();
                setTimeout(() => {
                    chara_stance.stop();
                }, 3500);
                //设置动画的播放部位为下半身
                chara_animation.slot = AnimSlot.Upper;
                //播放动画
                chara_animation.play();
                // 发送本地事件，事件名我们可以随便自定义，但是要保证发送方和接收方的事件名一致，否则接收不到事件	
                // // 这里我们定义事件名为"爱抚宠物+1" 
                // Event.dispatchToLocal("爱抚宠物+1");	
            });
            function playCat() {
                //让NPC3动画播放
                CC2.play();
                CC2.onFinish.add(() => {
                    //使用SoundService.playSound播放音效 萌猫 135489
                    SoundService.playSound("135489", 1);
                    //在对象上播放特效（特效ID，目标对象）
                    EffectService.playOnGameObject("106699", npc3, {
                        //特效播放得插槽位置
                        slotType: HumanoidSlotType.Root,
                        //特效的旋转角度
                        rotation: new Rotation(0, 0, -90)
                    });
                });
            }
        }
    }
};
petScript = __decorate([
    Component
], petScript);
var petScript$1 = petScript;

var foreign6 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    default: petScript$1
});

let TriggerTest = class TriggerTest extends Script {
    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    onStart() {
        //这里在服务端进行示例
        Trigger;
        if (SystemUtil.isClient()) {
            //通过上面复制的 GameObjectID 获取触发器对象
            let trigger = this.gameObject;
            // 处理Trigger对象
            //为触发器绑定 有物体进入时 会触发的监听事件
            trigger.onEnter.add(this.onTriggerEnter);
            //为触发器绑定 有物体离开时 会触发的监听事件
            trigger.onLeave.add(this.onTriggerLeave);
        }
    }
    //有物体进入了触发区域,other 为进入触发区域的物体对象
    onTriggerEnter(other) {
        //这里判断一下进入区域的物体是不是一名角色
        if (other instanceof Character) {
            //是的话，转成角色类型
            const character = other;
            //修改角色名称
            character.displayName = "进入区域";
        }
    }
    //有物体离开了触发区域
    onTriggerLeave(other) {
        //这里判断一下离开区域的物体是不是一名角色
        if (other instanceof Character) {
            //是的话，转成角色类型
            const character = other;
            //修改角色名称
            character.displayName = "离开区域";
        }
    }
};
TriggerTest = __decorate([
    Component
], TriggerTest);
var TriggerTest$1 = TriggerTest;

var foreign7 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    default: TriggerTest$1
});

// import TriggerUI from "./TriggerUI";
// @Component
// export default class TriggerEvent extends Script {
//     /** 当脚本被实例后，会在第一帧更新前调用此函数 */
//     protected onStart(): void {
//         let trigger=this.gameObject as Trigger;
//         trigger.onEnter.add((obj)=>{
//             if (trigger.tag=="Sit"){
//                 if (SystemUtil.isClient()){
//                     if (obj==Player.localPlayer.character){
//                         UIService.show(TriggerUI)
//                         Event.dispatchToLocal("Sit",this.gameObject.parent);
//                     }
//                 }        
//             }
//         });
//         trigger.onLeave.add((obj)=>{
//             if (trigger.tag=="Sit"){
//                 if (SystemUtil.isClient()){
//                     if(obj==Player.localPlayer.character){
//                         UIService.destroyUI(TriggerUI);
//                     }
//                 }
//             }
//         })
//     }
//     /**
//      * 周期函数 每帧执行
//      * 此函数执行需要将this.useUpdate赋值为true
//      * @param dt 当前帧与上一帧的延迟 / 秒
//      */
//     protected onUpdate(dt: number): void {
//     }
//     /** 脚本被销毁时最后一帧执行完调用此函数 */
//     protected onDestroy(): void {
//     }
// }

var foreign8 = /*#__PURE__*/Object.freeze({
    __proto__: null
});

let DefaultUI = class DefaultUI extends UIScript {
    constructor() {
        super(...arguments);
        this.anim1 = null;
        /**
        * 每一帧调用
        * 通过canUpdate可以开启关闭调用
        * dt 两帧调用的时间差，毫秒
        */
        //protected onUpdate(dt :number) {
        //}
        /**
         * 设置显示时触发
         */
        //protected onShow(...params:any[]) {
        //}
        /**
         * 设置不显示时触发
         */
        //protected onHide() {
        //}
        /**
         * 当这个UI界面是可以接收事件的时候
         * 手指或则鼠标触发一次Touch时触发
         * 返回事件是否处理了
         * 如果处理了，那么这个UI界面可以接收这次Touch后续的Move和End事件
         * 如果没有处理，那么这个UI界面就无法接收这次Touch后续的Move和End事件
         */
        //protected onTouchStarted(InGemotry :Geometry,InPointerEvent:PointerEvent) :EventReply{
        //	return EventReply.unHandled; //EventReply.handled
        //}
        /**
         * 手指或则鼠标再UI界面上移动时
         */
        //protected onTouchMoved(InGemotry :Geometry,InPointerEvent:PointerEvent) :EventReply{
        //	return EventReply.unHandled; //EventReply.handled
        //}
        /**
         * 手指或则鼠标离开UI界面时
         */
        //protected OnTouchEnded(InGemotry :Geometry,InPointerEvent:PointerEvent) :EventReply{
        //	return EventReply.unHandled; //EventReply.handled
        //}
        /**
         * 当在UI界面上调用detectDrag/detectDragIfPressed时触发一次
         * 可以触发一次拖拽事件的开始生成
         * 返回一次生成的拖拽事件 newDragDrop可以生成一次事件
         */
        //protected onDragDetected(InGemotry :Geometry,InPointerEvent:PointerEvent):DragDropOperation {
        //	return this.newDragDrop(null);
        //}
        /**
         * 拖拽操作生成事件触发后经过这个UI时触发
         * 返回true的话表示处理了这次事件，不会再往这个UI的下一层的UI继续冒泡这个事件
         */
        //protected onDragOver(InGemotry :Geometry,InDragDropEvent:PointerEvent,InDragDropOperation:DragDropOperation):boolean {
        //	return true;
        //}
        /**
         * 拖拽操作生成事件触发后在这个UI释放完成时
         * 返回true的话表示处理了这次事件，不会再往这个UI的下一层的UI继续冒泡这个事件
         */
        //protected onDrop(InGemotry :Geometry,InDragDropEvent:PointerEvent,InDragDropOperation:DragDropOperation):boolean {
        //	return true;
        //}
        /**
         * 拖拽操作生成事件触发后进入这个UI时触发
         */
        //protected onDragEnter(InGemotry :Geometry,InDragDropEvent:PointerEvent,InDragDropOperation:DragDropOperation) {
        //}
        /**
         * 拖拽操作生成事件触发后离开这个UI时触发
         */
        //protected onDragLeave(InGemotry :Geometry,InDragDropEvent:PointerEvent) {
        //}
        /**
         * 拖拽操作生成事件触发后，没有完成完成的拖拽事件而取消时触发
         */
        //protected onDragCancelled(InGemotry :Geometry,InDragDropEvent:PointerEvent) {
        //}
    }
    /** 仅在游戏时间对非模板实例调用一次 */
    onStart() {
        //设置能否每帧触发onUpdate
        this.canUpdate = false;
        //找到对应的跳跃按钮
        const jumpBtn = this.uiWidgetBase.findChildByPath('RootCanvas/Button_Jump');
        const attackBtn = this.uiWidgetBase.findChildByPath('RootCanvas/Button_Attack');
        //点击跳跃按钮,异步获取人物后执行跳跃
        jumpBtn.onPressed.add(() => {
            if (this.character) {
                this.character.jump();
            }
            else {
                Player.asyncGetLocalPlayer().then((player) => {
                    this.character = player.character;
                    //角色执行跳跃功能
                    this.character.jump();
                });
            }
        });
        //点击攻击按钮,异步获取人物后执行攻击动作
        attackBtn.onPressed.add(() => {
            Player.asyncGetLocalPlayer().then((player) => {
                this.character = player.character;
                AssetUtil.asyncDownloadAsset("61245").then((res) => {
                    if (res) {
                        if (!this.anim1) {
                            this.anim1 = player.character.loadAnimation("61245");
                            this.anim1.slot = AnimSlot.Upper;
                        }
                        //角色执行攻击动作
                        if (this.anim1.isPlaying) {
                            return;
                        }
                        else {
                            this.anim1.play();
                        }
                    }
                });
            });
        });
    }
    /**
     * 构造UI文件成功后，onStart之后
     * 对于UI的根节点的添加操作，进行调用
     * 注意：该事件可能会多次调用
     */
    onAdded() {
    }
    /**
     * 构造UI文件成功后，onAdded之后
     * 对于UI的根节点的移除操作，进行调用
     * 注意：该事件可能会多次调用
     */
    onRemoved() {
    }
    /**
    * 构造UI文件成功后，UI对象再被销毁时调用
    * 注意：这之后UI对象已经被销毁了，需要移除所有对该文件和UI相关对象以及子对象的引用
    */
    onDestroy() {
    }
};
DefaultUI = __decorate([
    UIBind('')
], DefaultUI);
var DefaultUI$1 = DefaultUI;

var foreign9 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    default: DefaultUI$1
});

/**
 * 按钮UI组件脚本
 * @version v1.0.0
 */
let EasyButton1 = class EasyButton1 extends Script {
    constructor() {
        super(...arguments);
        this.showEvent = "";
        this.hideEvent = "";
        this.clickEvent = "";
        this.clickEdEvent = "";
        this.isAutoenable = true;
        this.bgPicGuid = "289278";
        this.btnPos = new Vector2(1600, 550);
        this.btnName = "按钮";
        this.btnSize = new Vector2(256, 256);
        this.version = "v1.0.0";
        this._btnCom = null;
    }
    // public eventMutex = false;
    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    onStart() {
        if (SystemUtil.isClient()) {
            // 获取UI文件
            const uiObj = this.gameObject.getChildByPath("/按钮");
            if (uiObj) {
                this._btnCom = uiObj.uiWidgetBase.findChildByPath("RootCanvas/Btn");
                if (this._btnCom == null) {
                    console.error("[EasyButton]:按钮组件获取失败!,id:", this.gameObject.gameObjectId);
                    return;
                }
                else {
                    // 设置背景图
                    this._btnCom.normalImageGuid = this.bgPicGuid;
                    // 设置位置 需要根据分辨率运算
                    const difX = 1920 - this.btnPos.x;
                    const difY = 1080 - this.btnPos.y;
                    const realSize = WindowUtil.getViewportSize();
                    const resultX = realSize.x - difX;
                    const resuleY = realSize.y - difY;
                    this._btnCom.position = new Vector2(resultX, resuleY);
                    // 按钮名字
                    this._btnCom.text = this.btnName;
                    // 设置默认状态
                    this._btnCom.visibility = this.isAutoenable ? SlateVisibility.Visible : SlateVisibility.Hidden;
                    // 关闭 UI
                    if (this.hideEvent != "") {
                        Event.addLocalListener(this.hideEvent, (userId) => {
                            if (userId != Player.localPlayer.userId)
                                return;
                            this._btnCom.visibility = SlateVisibility.Collapsed;
                        });
                    }
                    // 显示 UI
                    if (this.showEvent != "") {
                        Event.addLocalListener(this.showEvent, (userId) => {
                            if (userId != Player.localPlayer.userId)
                                return;
                            this._btnCom.visibility = SlateVisibility.Visible;
                        });
                    }
                    // 点击按钮
                    if (this.clickEvent != "") {
                        this._btnCom.onPressed.add(() => {
                            //let child1 :GameObject;
                            //let child1 = this.gameObject.parent.gameObjectId;
                            // let child1ID =  this.child1.gameObjectId;
                            //const attr=["",""]
                            Event.dispatchToLocal(this.clickEvent, Player.localPlayer.userId);
                            //console.log(" ***发送 的ID： "+child1)
                            this.serverEventEmit(Player.localPlayer.userId, this.clickEvent);
                            //按下信号“chairSit” 触发坐下
                        });
                    }
                    // 抬起按钮
                    if (this.clickEdEvent != "") {
                        this._btnCom.onReleased.add(() => {
                            Event.dispatchToLocal(this.clickEdEvent, Player.localPlayer.userId);
                            this.serverEventEmit(Player.localPlayer.userId, this.clickEdEvent);
                        });
                    }
                }
            }
            else {
                console.error("[EasyButton]:按钮文件获取失败!,id:", this.gameObject.gameObjectId);
                return;
            }
        }
    }
    serverEventEmit(userId, eventStr) {
        Event.dispatchToLocal(eventStr, userId);
    }
};
//public child1ID: string= null;
EasyButton1.child1ID = null;
__decorate([
    Property({ displayName: "显示按钮信号", group: "接收信号" })
], EasyButton1.prototype, "showEvent", void 0);
__decorate([
    Property({ displayName: "关闭按钮信号", group: "接收信号" })
], EasyButton1.prototype, "hideEvent", void 0);
__decorate([
    Property({ displayName: "按键按下信号", group: "发出信号" })
], EasyButton1.prototype, "clickEvent", void 0);
__decorate([
    Property({ displayName: "按键抬起信号", group: "发出信号" })
], EasyButton1.prototype, "clickEdEvent", void 0);
__decorate([
    Property({ displayName: "是否默认显示按钮", group: "按钮设置" })
], EasyButton1.prototype, "isAutoenable", void 0);
__decorate([
    Property({ displayName: "背景图资源ID", group: "按钮设置", defaultValue: "289278" })
], EasyButton1.prototype, "bgPicGuid", void 0);
__decorate([
    Property({ displayName: "按钮位置", tooltip: "屏幕大小默认为 1920x1080,这里可以设置按钮的位置\n按钮位置默认与右下角对齐", group: "按钮设置" })
], EasyButton1.prototype, "btnPos", void 0);
__decorate([
    Property({ displayName: "按钮文本", group: "按钮设置" })
], EasyButton1.prototype, "btnName", void 0);
__decorate([
    Property({ displayName: "按钮大小", tooltip: "", group: "按钮设置" })
], EasyButton1.prototype, "btnSize", void 0);
__decorate([
    Property({ displayName: "版本号", group: "预制体信息", readonly: true })
], EasyButton1.prototype, "version", void 0);
__decorate([
    RemoteFunction(Server)
], EasyButton1.prototype, "serverEventEmit", null);
EasyButton1 = __decorate([
    Component
], EasyButton1);
var EasyButton1$1 = EasyButton1;

var foreign10 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    default: EasyButton1$1
});

/**
 * 按钮UI组件脚本
 * @version v1.0.0
 */
let EasyButton = class EasyButton extends Script {
    constructor() {
        super(...arguments);
        this.showEvent = "";
        this.hideEvent = "";
        this.clickEvent = "";
        this.clickEdEvent = "";
        this.isAutoenable = true;
        this.bgPicGuid = "289278";
        this.btnPos = new Vector2(1600, 550);
        this.btnName = "按钮";
        this.btnSize = new Vector2(256, 256);
        this.version = "v1.0.0";
        this._btnCom = null;
    }
    // public eventMutex = false;
    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    onStart() {
        if (SystemUtil.isClient()) {
            // 获取UI文件
            const uiObj = this.gameObject.getChildByPath("/按钮");
            if (uiObj) {
                this._btnCom = uiObj.uiWidgetBase.findChildByPath("RootCanvas/Btn");
                if (this._btnCom == null) {
                    console.error("[EasyButton]:按钮组件获取失败!,id:", this.gameObject.gameObjectId);
                    return;
                }
                else {
                    // 设置背景图
                    this._btnCom.normalImageGuid = this.bgPicGuid;
                    // 设置位置 需要根据分辨率运算
                    const difX = 1920 - this.btnPos.x;
                    const difY = 1080 - this.btnPos.y;
                    const realSize = WindowUtil.getViewportSize();
                    const resultX = realSize.x - difX;
                    const resuleY = realSize.y - difY;
                    this._btnCom.position = new Vector2(resultX, resuleY);
                    // 按钮名字
                    this._btnCom.text = this.btnName;
                    // 设置默认状态
                    this._btnCom.visibility = this.isAutoenable ? SlateVisibility.Visible : SlateVisibility.Hidden;
                    // 关闭 UI
                    if (this.hideEvent != "") {
                        Event.addLocalListener(this.hideEvent, (userId) => {
                            if (userId != Player.localPlayer.userId)
                                return;
                            this._btnCom.visibility = SlateVisibility.Collapsed;
                        });
                    }
                    // 显示 UI
                    if (this.showEvent != "") {
                        Event.addLocalListener(this.showEvent, (userId) => {
                            if (userId != Player.localPlayer.userId)
                                return;
                            this._btnCom.visibility = SlateVisibility.Visible;
                        });
                    }
                    // 点击按钮
                    if (this.clickEvent != "") {
                        this._btnCom.onPressed.add(() => {
                            //let child1 :GameObject;
                            //let child1 = this.gameObject.parent.gameObjectId;
                            // let child1ID =  this.child1.gameObjectId;
                            //const attr=["",""]
                            Event.dispatchToLocal(this.clickEvent, Player.localPlayer.userId);
                            //console.log(" ***发送 的ID： "+child1)
                            this.serverEventEmit(Player.localPlayer.userId, this.clickEvent);
                            //按下信号“chairSit” 触发坐下
                        });
                    }
                    // 抬起按钮
                    if (this.clickEdEvent != "") {
                        this._btnCom.onReleased.add(() => {
                            Event.dispatchToLocal(this.clickEdEvent, Player.localPlayer.userId);
                            this.serverEventEmit(Player.localPlayer.userId, this.clickEdEvent);
                        });
                    }
                }
            }
            else {
                console.error("[EasyButton]:按钮文件获取失败!,id:", this.gameObject.gameObjectId);
                return;
            }
        }
    }
    serverEventEmit(userId, eventStr) {
        Event.dispatchToLocal(eventStr, userId);
    }
};
//public child1ID: string= null;
EasyButton.child1ID = null;
__decorate([
    Property({ displayName: "显示按钮信号", group: "接收信号" })
], EasyButton.prototype, "showEvent", void 0);
__decorate([
    Property({ displayName: "关闭按钮信号", group: "接收信号" })
], EasyButton.prototype, "hideEvent", void 0);
__decorate([
    Property({ displayName: "按键按下信号", group: "发出信号" })
], EasyButton.prototype, "clickEvent", void 0);
__decorate([
    Property({ displayName: "按键抬起信号", group: "发出信号" })
], EasyButton.prototype, "clickEdEvent", void 0);
__decorate([
    Property({ displayName: "是否默认显示按钮", group: "按钮设置" })
], EasyButton.prototype, "isAutoenable", void 0);
__decorate([
    Property({ displayName: "背景图资源ID", group: "按钮设置", defaultValue: "289278" })
], EasyButton.prototype, "bgPicGuid", void 0);
__decorate([
    Property({ displayName: "按钮位置", tooltip: "屏幕大小默认为 1920x1080,这里可以设置按钮的位置\n按钮位置默认与右下角对齐", group: "按钮设置" })
], EasyButton.prototype, "btnPos", void 0);
__decorate([
    Property({ displayName: "按钮文本", group: "按钮设置" })
], EasyButton.prototype, "btnName", void 0);
__decorate([
    Property({ displayName: "按钮大小", tooltip: "", group: "按钮设置" })
], EasyButton.prototype, "btnSize", void 0);
__decorate([
    Property({ displayName: "版本号", group: "预制体信息", readonly: true })
], EasyButton.prototype, "version", void 0);
__decorate([
    RemoteFunction(Server)
], EasyButton.prototype, "serverEventEmit", null);
EasyButton = __decorate([
    Component
], EasyButton);
var EasyButton$1 = EasyButton;

var foreign11 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    default: EasyButton$1
});

/**
 * 触发器信号脚本
 * @version v1.0.2
 */
let EasyEvent = class EasyEvent extends Script {
    constructor() {
        super(...arguments);
        this.enterEvent = "";
        this.leaveEvent = "";
        this.version = "v1.0.2";
    }
    onStart() {
        // 判断是否挂载在触发器上
        if (this.gameObject instanceof Trigger) {
            if (this.enterEvent != "") {
                this.gameObject.onEnter.add((character) => {
                    if (character instanceof Character) {
                        if (StringUtil.isEmpty(this.enterEvent))
                            return;
                        character.asyncReady().then((char) => {
                            if (character.player == null)
                                return;
                            Event.dispatchToLocal(this.enterEvent, char.player.userId);
                        });
                    }
                });
            }
            if (this.leaveEvent != "") {
                this.gameObject.onLeave.add((character) => {
                    if (character instanceof Character) {
                        if (StringUtil.isEmpty(this.leaveEvent))
                            return;
                        character.asyncReady().then((char) => {
                            if (character.player == null)
                                return;
                            Event.dispatchToLocal(this.leaveEvent, char.player.userId);
                        });
                    }
                });
            }
        }
        else {
            console.error("[EasyEvent]:脚本必须挂载在触发器上!");
        }
    }
};
__decorate([
    Property({ displayName: "角色进入信号", group: "发出信号" })
], EasyEvent.prototype, "enterEvent", void 0);
__decorate([
    Property({ displayName: "角色离开信号", group: "发出信号" })
], EasyEvent.prototype, "leaveEvent", void 0);
__decorate([
    Property({ displayName: "版本号", group: "预制体信息", readonly: true })
], EasyEvent.prototype, "version", void 0);
EasyEvent = __decorate([
    Component
], EasyEvent);
var EasyEvent$1 = EasyEvent;

var foreign12 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    default: EasyEvent$1
});

/**
 * 旋转组件脚本
 * @version v1.0.0
 */
let EasyRotate = class EasyRotate extends Script {
    constructor() {
        super(...arguments);
        this.startEvent = "";
        this.stopEvent = "";
        this.isOpen = true;
        this.rotateMode = 301;
        this.rotateDirection = 0;
        this.baseAxial = 10;
        this.rotateAngle = 360;
        this.rotateDuration = 2;
        this.version = "v1.0.0";
        //终点角度
        this.endRotation = Rotation.zero;
    }
    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    onStart() {
        if (SystemUtil.isClient()) {
            // 客户端端，不执行动作
            return;
        }
        if (this.rotateDuration <= 0) {
            // 移动时长为0，不进行移动
            console.error("组件旋转一圈时长设置为0，不进行移动");
        }
        const rotateObj = this.gameObject;
        // 关闭往返运动
        rotateObj.rotationRepeat = false;
        // 轴向设置
        rotateObj.motionCoordinate = this.baseAxial == 11 ? MotionAxis.WorldAxis : MotionAxis.LocalAxis;
        rotateObj.rotationDelayStartTime = 0;
        // 旋转速度（速度为360时，1秒一圈，所以速度等于一秒要转多少角度）
        let rotateSpeed = 1;
        if (this.rotateMode === 301) {
            // 持续旋转
            // 不重复
            rotateObj.rotationRepeat = false;
            // 设置旋转速度(360 / 单圈时长)
            rotateSpeed = 360 / this.rotateDuration;
        }
        else {
            // 固定角度
            rotateObj.motionCoordinate = MotionAxis.WorldAxis;
            // 设置旋转速度(角度 * 单圈时长)
            rotateSpeed = this.rotateAngle / this.rotateDuration;
            // 单程循环时间(旋转角度 / 360 * 单圈时间)
            rotateObj.rotationRepeatTime = this.rotateDuration;
        }
        //根据设定方向，
        rotateObj.rotationSpeed = this.rotateDirectionCheck(rotateSpeed);
        let rotation = new Rotation(rotateObj.rotationSpeed.x * this.rotateDuration, rotateObj.rotationSpeed.y * this.rotateDuration, rotateObj.rotationSpeed.z * this.rotateDuration);
        this.endRotation = rotateObj.parent.worldTransform.rotation.add(rotation);
        if (this.isOpen) {
            // 自动开启状态，马上执行
            this.startRotate(rotateObj);
        }
        // 监听启动信号
        if (!StringUtil.isEmpty(this.startEvent)) {
            Event.addLocalListener(this.startEvent, () => {
                if (this.rotateMode === 302) {
                    if (this.gameObject.parent.worldTransform.rotation.equals(this.endRotation, 2)) {
                        this.gameObject.parent.worldTransform.rotation = this.endRotation;
                        return;
                    }
                }
                this.startRotate(rotateObj);
            });
        }
        // 监听停止信号
        if (!StringUtil.isEmpty(this.stopEvent)) {
            Event.addLocalListener(this.stopEvent, () => {
                if (this.timeoutId) {
                    clearTimeout(this.timeoutId);
                }
                rotateObj.enable = false;
            });
        }
    }
    startRotate(rotateObj) {
        let rotateDistance = Rotation.subtract(this.endRotation, this.gameObject.parent.worldTransform.rotation.clone());
        rotateObj.rotationSpeed = new Vector(rotateDistance.x / this.rotateDuration, rotateDistance.y / this.rotateDuration, rotateDistance.z / this.rotateDuration);
        rotateObj.enable = true;
        if (!rotateObj.rotationRepeat && this.rotateMode !== 301) {
            // 若不重复，并且也不持续，那规定时间后就停止
            this.timeoutId = setTimeout(() => {
                if (this.rotateMode === 302) {
                    // 判断角度是否相等
                    if (this.gameObject.parent.worldTransform.rotation.equals(this.endRotation, 1)) {
                        this.gameObject.parent.worldTransform.rotation = this.endRotation;
                    }
                }
                rotateObj.enable = false;
            }, this.rotateDuration * 1000 - 2);
        }
    }
    /**
     * 将单向旋转速度根据所选的旋转方向，生成最终Rotation向量
     * @param rotateSpeed 单向旋转速度
     * @returns Rotation向量
     */
    rotateDirectionCheck(rotateSpeed) {
        let rotationSpeed = Vector.zero;
        switch (this.rotateDirection) {
            case 0:
                // 向前，绕y轴顺时针旋转
                rotationSpeed = new Vector(0, -rotateSpeed, 0);
                break;
            case 1:
                // 向后，绕y轴逆时针旋转
                rotationSpeed = new Vector(0, rotateSpeed, 0);
                break;
            case 2:
                // 向左，绕X轴顺时针旋转
                rotationSpeed = new Vector(-rotateSpeed, 0, 0);
                break;
            case 3:
                // 向右，绕X轴逆时针旋转
                rotationSpeed = new Vector(rotateSpeed, 0, 0);
                break;
            case 4:
                // 顺时针，绕Z轴顺时针旋转
                rotationSpeed = new Vector(0, 0, rotateSpeed);
                break;
            case 5:
                // 逆时针，绕Z轴逆时针旋转
                rotationSpeed = new Vector(0, 0, -rotateSpeed);
                break;
            case 6:
                // 左前，绕y轴顺时针旋转，绕X轴顺时针旋转
                rotationSpeed = new Vector(-rotateSpeed, -rotateSpeed, 0);
                break;
            case 7:
                // 右前，绕y轴顺时针旋转，绕X轴逆时针旋转
                rotationSpeed = new Vector(rotateSpeed, -rotateSpeed, 0);
                break;
            case 8:
                // 左后，绕y轴逆时针旋转，绕X轴顺时针旋转
                rotationSpeed = new Vector(-rotateSpeed, rotateSpeed, 0);
                break;
            case 9:
                // 右后，绕y轴逆时针旋转，绕X轴逆时针旋转
                rotationSpeed = new Vector(rotateSpeed, rotateSpeed, 0);
                break;
        }
        return rotationSpeed;
    }
};
__decorate([
    Property({ displayName: "开启信号", group: "接收信号" })
], EasyRotate.prototype, "startEvent", void 0);
__decorate([
    Property({ displayName: "停止信号", group: "接收信号" })
], EasyRotate.prototype, "stopEvent", void 0);
__decorate([
    Property({ displayName: "是否自动开启", defaultValue: true, group: "旋转组件设置" })
], EasyRotate.prototype, "isOpen", void 0);
__decorate([
    Property({
        displayName: "旋转模式",
        enumType: {
            "持续旋转": 301,
            "目标角度": 302,
        },
        defaultValue: 10,
        tooltip: "选中【持续旋转】时，【固定角度】不生效,选中【目标角度】时，固定角度参数生效,物体会转动到指定角度",
        group: "旋转组件设置"
    })
], EasyRotate.prototype, "rotateMode", void 0);
__decorate([
    Property({
        displayName: "旋转方向",
        enumType: {
            "向前": 0,
            "向后": 1,
            "向左": 2,
            "向右": 3,
            "顺时针": 4,
            "逆时针": 5,
            "左前": 6,
            "右前": 7,
            "左后": 8,
            "右后": 9,
        },
        defaultValue: 0,
        tooltip: "【向前】是绕y轴顺时针旋转，【向后】是绕y轴逆时针旋转(绕轴是从箭头方向面向原点判断顺时针还是逆时针)" +
            "\n【向左】是绕X轴顺时针旋转，【向右】是绕X轴逆时针旋转" +
            "\n【顺时针】是绕Z轴顺时针旋转，【逆时针】是绕Z轴逆时针旋转",
        group: "旋转组件设置"
    })
], EasyRotate.prototype, "rotateDirection", void 0);
__decorate([
    Property({
        displayName: "基础轴向",
        enumType: {
            "本地轴向": 10,
            "世界轴向": 11
        },
        defaultValue: 10,
        tooltip: "可以在工具栏选中不同轴向预览坐标轴方向,若选择【固定角度】模式，则默认为世界轴向",
        group: "旋转组件设置"
    })
], EasyRotate.prototype, "baseAxial", void 0);
__decorate([
    Property({
        displayName: "固定角度",
        tooltip: "【旋转模式】选中固定角度后生效",
        defaultValue: 360,
        group: "旋转组件设置"
    })
], EasyRotate.prototype, "rotateAngle", void 0);
__decorate([
    Property({
        displayName: "旋转耗时(秒)",
        tooltip: "转到【固定角度】所需时间" +
            "\n若勾选了【是否保持运动】，则代表转一圈的时间",
        defaultValue: 2,
        group: "旋转组件设置"
    })
], EasyRotate.prototype, "rotateDuration", void 0);
__decorate([
    Property({ displayName: "版本号", group: "预制体信息", readonly: true })
], EasyRotate.prototype, "version", void 0);
EasyRotate = __decorate([
    Component
], EasyRotate);
var EasyRotate$1 = EasyRotate;

var foreign13 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    default: EasyRotate$1
});

var TeleportType;
(function (TeleportType) {
    TeleportType[TeleportType["None"] = 0] = "None";
    TeleportType[TeleportType["AtoB"] = 1] = "AtoB";
    TeleportType[TeleportType["BtoA"] = 2] = "BtoA";
})(TeleportType || (TeleportType = {}));
/**
 * 传送门组件脚本
 * @version v1.1.0
 */
let EasyTeleport = class EasyTeleport extends Script {
    constructor() {
        super(...arguments);
        this.startEvent = "";
        this.stopEvent = "";
        this.isOpen = true;
        this.isOneway = false;
        this.isServerObj = true;
        this.version = "v1.1.0";
        this.doorAGuid = "";
        this.doorBGuid = "";
        /** 传送类型 */
        this.teleportType = TeleportType.None;
        /** 传送门A */
        this.doorA = null;
        /** 传送门B */
        this.doorB = null;
    }
    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    onStart() {
        if (SystemUtil.isClient) {
            // UIService.show(NewUIScript);
            const effectAssetId = '271319'; //特效 光圈 14333 瞬移消失 271319
            const position = Player.localPlayer.character.worldTransform.position; // 获取角色当前位置
            console.log("position", position);
            //在角色当前位置播放特效
            EffectService.playAtPosition(effectAssetId, position);
            this.initDoor().then(() => {
                if (!(this.doorA && this.doorB)) {
                    console.log("传送门预制体存在组件缺失，请检查");
                    return;
                }
                if (this.isOpen) {
                    this.openDoor();
                }
                else {
                    this.closeDoor();
                }
                // 监听启动信号
                if (this.startEvent != "") {
                    Event.addLocalListener(this.startEvent, () => {
                        this.openDoor();
                    });
                }
                // 监听停止信号
                if (this.stopEvent != "") {
                    Event.addLocalListener(this.stopEvent, () => {
                        this.closeDoor();
                    });
                }
                // 下面的代码客户端运行即可
                if (SystemUtil.isServer()) {
                    return;
                }
                this.teleportType = TeleportType.None;
                this.doorA.onEnter.add((enterObject) => {
                    if (enterObject === Player.localPlayer.character && this.teleportType === TeleportType.None) {
                        this.teleportType = TeleportType.AtoB;
                        //黑屏1秒
                        this.blackScrene();
                        enterObject.worldTransform.position = this.doorB.worldTransform.position;
                    }
                });
                this.doorB.onEnter.add((enterObject) => {
                    if (this.isOneway) {
                        return;
                    }
                    if (enterObject === Player.localPlayer.character && this.teleportType === TeleportType.None) {
                        this.teleportType = TeleportType.BtoA;
                        //黑屏1秒
                        this.blackScrene();
                        enterObject.worldTransform.position = this.doorA.worldTransform.position;
                    }
                });
                this.doorA.onLeave.add((enterObject) => {
                    if (enterObject === Player.localPlayer.character && this.teleportType === TeleportType.BtoA) {
                        this.teleportType = TeleportType.None;
                    }
                });
                this.doorB.onLeave.add((enterObject) => {
                    if (enterObject === Player.localPlayer.character && this.teleportType === TeleportType.AtoB) {
                        this.teleportType = TeleportType.None;
                    }
                });
            });
        }
    }
    async initDoor() {
        this.doorA = this.gameObject.getChildByName("门A");
        this.doorB = this.gameObject.getChildByName("门B");
        if (this.doorA == null)
            this.doorA = await GameObject.asyncFindGameObjectById(this.doorAGuid);
        if (this.doorB == null)
            this.doorB = await GameObject.asyncFindGameObjectById(this.doorBGuid);
    }
    openDoor() {
        if (this.isServerObj) {
            this.doorA.enabled = true;
            this.doorB.enabled = true;
            this.doorA.setVisibility(true);
            this.doorB.setVisibility(true);
        }
        else {
            if (SystemUtil.isClient()) {
                this.doorA.enabled = true;
                this.doorB.enabled = true;
                this.doorA.setVisibility(true);
                this.doorB.setVisibility(true);
            }
        }
    }
    //黑屏
    blackScrene() {
        // 创建一个UI对象!
        let ui = mw.UserWidget.newObject();
        // 将UI添加到屏幕上
        ui.addToViewport(1);
        // 创建一个画布组件
        let rootCanvas = mw.Canvas.newObject();
        //获取全屏的大小赋值给画布组件
        rootCanvas.size = WindowUtil.getViewportSize();
        rootCanvas.position = Vector2.zero;
        //将Ui的根画布设置为rootCanvas
        ui.rootContent = rootCanvas;
        // 创建一个UI添加到画布上
        let image = mw.Image.newObject(rootCanvas);
        //获取全屏的大小赋值给image组件
        image.size = WindowUtil.getViewportSize();
        image.setImageColorDecimal(0, 0, 0, 255);
        const effectAssetId = '271319'; //特效 光圈 14333 瞬移消失 271319
        const position = Player.localPlayer.character.worldTransform.position; // 获取角色当前位置
        console.log("position", position);
        //在角色当前位置播放特效
        EffectService.playAtPosition(effectAssetId, position);
        setTimeout(() => {
            ui.destroyObject();
        }, 1000);
    }
    closeDoor() {
        if (this.isServerObj) {
            this.doorA.enabled = false;
            this.doorB.enabled = false;
            this.doorA.setVisibility(false);
            this.doorB.setVisibility(false);
        }
        else {
            if (SystemUtil.isClient()) {
                this.doorA.enabled = false;
                this.doorB.enabled = false;
                this.doorA.setVisibility(false);
                this.doorB.setVisibility(false);
            }
        }
    }
};
__decorate([
    Property({ displayName: "开启信号", group: "接收信号" })
], EasyTeleport.prototype, "startEvent", void 0);
__decorate([
    Property({ displayName: "关闭信号", group: "接收信号" })
], EasyTeleport.prototype, "stopEvent", void 0);
__decorate([
    Property({
        displayName: "是否自动开启",
        defaultValue: true,
        tooltip: "传送门是否默认开启",
        group: "传送门设置"
    })
], EasyTeleport.prototype, "isOpen", void 0);
__decorate([
    Property({
        displayName: "是否单向传送",
        tooltip: "开启后，传送门只能从A门传送至B门",
        defaultValue: false,
        group: "传送门设置"
    })
], EasyTeleport.prototype, "isOneway", void 0);
__decorate([
    Property({
        displayName: "开关是否影响所有玩家",
        tooltip: "默认影响所有人,也就是说只要有一个玩家打开传送门,其它所有玩家都可以使用\n"
            + "如果不勾选,这个传送门开启后只能由开启者通过",
        defaultValue: true,
        group: "传送门设置"
    })
], EasyTeleport.prototype, "isServerObj", void 0);
__decorate([
    Property({ displayName: "版本号", group: "预制体信息", readonly: true })
], EasyTeleport.prototype, "version", void 0);
__decorate([
    Property({ displayName: "传送门A", capture: true, group: "内置配置 (无需修改)" })
], EasyTeleport.prototype, "doorAGuid", void 0);
__decorate([
    Property({ displayName: "传送门B", capture: true, group: "内置配置 (无需修改)" })
], EasyTeleport.prototype, "doorBGuid", void 0);
EasyTeleport = __decorate([
    Component
], EasyTeleport);
var EasyTeleport$1 = EasyTeleport;

var foreign14 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    default: EasyTeleport$1
});

let GameObjectExample = class GameObjectExample extends Script {
    onStart() {
        let obj = this.gameObject;
        console.log(`obj.name = ${obj.name}`);
        console.log(`obj.tag = ${obj.tag}`);
        console.log(`obj.worldTransform = ${obj.worldTransform}`);
        console.log(`obj.localTransform = ${obj.localTransform}`);
        let children = obj.getChildren();
        children.forEach(child => {
            console.log(`obj child = ${child.name}`);
        });
        let path = "正方体/圆柱";
        let cylinderObj = GameObject.getGameObjectByPath(path);
        console.log(`getGameObjectByPath = ${cylinderObj ? cylinderObj.name : "undefined"}`);
        path = "圆柱/圆台";
        cylinderObj = obj.getChildByPath(path);
        console.log(`getChildByPath = ${cylinderObj ? cylinderObj.name : "undefined"}`);
        // cylinderObj.onDestroyDelegate.add(()=>{
        //     console.log(`destroyDelegate 1 = ${cylinderObj ? cylinderObj.name : "undefined"}`);
        // });
        // cylinderObj.onDestroyDelegate.add(()=>{
        //     console.log(`destroyDelegate 2 = ${cylinderObj ? cylinderObj.name : "undefined"}`);
        // });
        cylinderObj.destroy();
    }
};
GameObjectExample = __decorate([
    Component
], GameObjectExample);
var GameObjectExample$1 = GameObjectExample;

var foreign15 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    default: GameObjectExample$1
});

/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * ATTENTION: onStart 等UI脚本自带函数不可改写为异步执行，有需求的异步逻辑请使用函数封装，通过函数接口在内部使用
 * UI: UI/TestUI.ui
*/
let TestUI_Generate = class TestUI_Generate extends UIScript {
    get putPet() {
        if (!this.putPet_Internal && this.uiWidgetBase) {
            this.putPet_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/putPet');
        }
        return this.putPet_Internal;
    }
    get textBlock() {
        if (!this.textBlock_Internal && this.uiWidgetBase) {
            this.textBlock_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/putPet/textBlock');
        }
        return this.textBlock_Internal;
    }
    /**
    * onStart 之前触发一次
    */
    onAwake() {
    }
};
TestUI_Generate = __decorate([
    UIBind('UI/TestUI.ui')
], TestUI_Generate);
var TestUI_Generate$1 = TestUI_Generate;

var foreign31 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    default: TestUI_Generate$1
});

/**
 * 撸猫按钮处理
 */
class TestUIScript extends TestUI_Generate$1 {
    /**
     * 构造UI文件成功后，在合适的时机最先初始化一次
     */
    onStart() {
        //设置能否每帧触发onUpdate
        this.canUpdate = true;
        this.layer = UILayerMiddle;
        this.putPet.onClicked.add(() => {
            // this.textBlock.text = "爱抚中";
            //    //寻找宠物对象
            //    let pet = GameObject.asyncFindGameObjectById("2F7DBECC") as unknown as Character;
            //      console.log("美国短毛猫", pet.assetId);
            //    //寻找宠物床交互物对象
            //    let petBed = GameObject.findGameObjectByName("petBedInt") as Interactor;
            //    console.log("petBed", petBed.name); // AssetId:181302
            //    petBed.enter(pet);
            // //    console.log("Pet bedding" );
            Event.dispatchToLocal("开始撸猫");
        });
    }
    /**
     * 构造UI文件成功后，onStart之后
     * 对于UI的根节点的添加操作，进行调用
     * 注意：该事件可能会多次调用
     */
    onAdded() {
    }
    /**
     * 构造UI文件成功后，onAdded之后
     * 对于UI的根节点的移除操作，进行调用
     * 注意：该事件可能会多次调用
     */
    onRemoved() {
    }
    /**
    * 构造UI文件成功后，UI对象再被销毁时调用
    * 注意：这之后UI对象已经被销毁了，需要移除所有对该文件和UI相关对象以及子对象的引用
    */
    onDestroy() {
    }
}

var foreign23 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    default: TestUIScript
});

let GameStart = class GameStart extends Script {
    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    async onStart() {
        if (SystemUtil.isClient) {
            UIService.hide(TestUIScript);
            //UIService.show(TestUIScript);
        }
        //     if (SystemUtil.isServer()) {
        //         // 存数据
        //         DataStorage.asyncSetData("name", "空伊伊");
        //          // 取数据
        //          let result = await DataStorage.asyncGetData("name")
        //          // 将获取到的数据打印出来
        //          console.log(result.data)
        //          let data1 = new DataInfo("空伊伊", 22, 300, "手枪", "飞镖", "瓶子")
        //         // 传入自定义的键值
        //         DataStorage.asyncSetData("Player1", data1)
        //         let data = (await DataStorage.asyncGetData("Player1")).data
        //         console.log("玩家信息: ", data["roleName"], data["level"],data["gold"],data["bag"])
        //     }
        // GameObject.asyncSpawn<Model>("360758");
        // InputUtil.onKeyDown(Keys.Q,async()=>{
        //     const h =await GameObject.asyncSpawn<Model>("360498");
        //     h.worldTransform.position = new Vector(100,100,100);
        // }
        // GameObject.asyncSpawn<Model>("120619"); 
    }
    /**
     * 周期函数 每帧执行
     * 此函数执行需要将this.useUpdate赋值为true
     * @param dt 当前帧与上一帧的延迟 / 秒
     */
    onUpdate(dt) {
    }
    /** 脚本被销毁时最后一帧执行完调用此函数 */
    onDestroy() {
    }
};
GameStart = __decorate([
    Component
], GameStart);
var GameStart$1 = GameStart;

var foreign16 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    default: GameStart$1
});

let Interact01 = class Interact01 extends Script {
    constructor() {
        super(...arguments);
        this.parentID = null;
    }
    //TargetID:any;
    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    async onStart() {
        if (SystemUtil.isClient()) {
            //parent :此对象父对象
            let parent = this.gameObject.parent;
            //parentID :此对象父对象ID
            let parentID = parent.gameObjectId;
            // let yDistance:Vector ;
            //let child1 :GameObject;
            let foundItem;
            let character1 = Player.localPlayer.character;
            let ch1 = parent;
            // this.useUpdate = true;
            // 创建一个事件监听器
            Event.addLocalListener("chairSit", () => {
                let playerPos = character1.localTransform.position;
                //console.log("当前角色位置：" + playerPos);
                let goArray = QueryUtil.sphereOverlap(playerPos, 70, false, [], false, character1);
                for (const item of goArray) {
                    // item: 检测到的对象;   foundItem: 被选取的触发器信号对象
                    if (item.name == "触发器信号") {
                        foundItem = item;
                        // console.log("当前foundItem ：" + foundItem.name );
                        break;
                    }
                }
                //选取的触发器信号对象的父对象
                let selectitemID = foundItem.parent.gameObjectId;
                // 判定('字符串相等')
                if (parentID == selectitemID) {
                    // console.log('字符串相等');
                    ch1.enter(character1); //,HumanoidSlotType.Buttocks,"280682"
                    //console.log("坐下的本地交互物ID： "+parentID)
                    //setTimeout函数被用来延迟2秒后执行一个回调函数，回调函数中调用了ch1.leave方法，将角色从椅子上移开。
                    // setTimeout(() => {
                    //     ch1 .leave( );
                    // }, 2000);
                    //}
                }
            });
            Event.addLocalListener("LeaveChair", () => {
                ch1.leave();
            });
        }
    }
};
Interact01 = __decorate([
    Component
], Interact01);
var Interact01$1 = Interact01;
/** 脚本被销毁时最后一帧执行完调用此函数 */

var foreign17 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    default: Interact01$1
});

var MoveFacingDirection_1;
let MoveFacingDirection = MoveFacingDirection_1 = class MoveFacingDirection extends Script {
    // 当脚本被实例后，会在第一帧更新前调用此函数
    onStart() {
        // 下列代码仅在客户端执行
        if (SystemUtil.isClient()) {
            // 获取当前客户端的玩家(自己)
            let myPlayer = Player.localPlayer;
            // 获取当前玩家控制的角色
            let myCharacter = myPlayer.character;
            // 设置定轴方向
            //myCharacter.movementAxisDirection = new Vector(1, 0, 0);
            // 打印当前角色的运动轴和面朝方向
            console.log("当前角色的运动面朝方向 " + MoveFacingDirection_1[myCharacter.moveFacingDirection]);
            console.log("当前角色的运动时依据的正方向 " + MovementDirection[myCharacter.movementDirection]);
            // 添加一个按键方法:按下键盘“1”，切换角色的运动面朝方向
            InputUtil.onKeyDown(Keys.One, () => {
                myCharacter.moveFacingDirection = (myCharacter.moveFacingDirection + 1) % 3;
                console.log("当前角色的运动 " + MoveFacingDirection_1[myCharacter.moveFacingDirection] + " + " + MovementDirection[myCharacter.movementDirection]);
            });
            // 添加一个按键方法:按下键盘“2”，切换角色的运动时依据的正方向
            InputUtil.onKeyDown(Keys.Two, () => {
                myCharacter.movementDirection = (myCharacter.movementDirection + 1) % 3;
                console.log("当前角色的运动 " + MoveFacingDirection_1[myCharacter.moveFacingDirection] + " + " + MovementDirection[myCharacter.movementDirection]);
                if (myCharacter.movementDirection == 0) {
                    console.log("当前角色的运动 " + MoveFacingDirection_1[myCharacter.moveFacingDirection] + " + " + MovementDirection[myCharacter.movementDirection] + " 定轴方向 " + myCharacter.movementAxisDirection);
                }
            });
        }
    }
};
MoveFacingDirection = MoveFacingDirection_1 = __decorate([
    Component
], MoveFacingDirection);
var MoveFacingDirection$1 = MoveFacingDirection;

var foreign18 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    default: MoveFacingDirection$1
});

let peBeding = class peBeding extends Script {
    //thisInteractor: any;
    //播放让宠物在指定对象位置上播放动画
    async onStart() {
        if (SystemUtil.isClient) ;
    }
    /**
     * 周期函数 每帧执行
     * 此函数执行需要将this.useUpdate赋值为true
     * @param dt 当前帧与上一帧的延迟 / 秒
     */
    onUpdate(dt) {
    }
    /** 脚本被销毁时最后一帧执行完调用此函数 */
    onDestroy() {
    }
};
peBeding = __decorate([
    Component
], peBeding);
var peBeding$1 = peBeding;

var foreign19 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    default: peBeding$1
});

/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * ATTENTION: onStart 等UI脚本自带函数不可改写为异步执行，有需求的异步逻辑请使用函数封装，通过函数接口在内部使用
 * UI: UI/petBedUI.ui
*/
let petBedUI_Generate = class petBedUI_Generate extends UIScript {
    get putPet() {
        if (!this.putPet_Internal && this.uiWidgetBase) {
            this.putPet_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/putPet');
        }
        return this.putPet_Internal;
    }
    get textBlock() {
        if (!this.textBlock_Internal && this.uiWidgetBase) {
            this.textBlock_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/putPet/textBlock');
        }
        return this.textBlock_Internal;
    }
    /**
    * onStart 之前触发一次
    */
    onAwake() {
    }
};
petBedUI_Generate = __decorate([
    UIBind('UI/petBedUI.ui')
], petBedUI_Generate);
var petBedUI_Generate$1 = petBedUI_Generate;

var foreign30 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    default: petBedUI_Generate$1
});

/**
petBedUI的UI脚本
 */
class petBdeIntUIScript extends petBedUI_Generate$1 {
    constructor() {
        super(...arguments);
        //表示当前对象的交互功能被关闭或者开启,默认为假。
        this.isInteractive = false;
    }
    onStart() {
        let petObject = GameObject.findGameObjectById("2EAFFFF9");
        let petPos = petObject.worldTransform.position;
        let petAnimation = petObject.loadAnimation("181303");
        Event.addLocalListener("宠物放入床", (param) => {
            // console.info(param.name)
            //接收空锚点对象
            this.anchor = param;
            this.anchor.asyncReady();
            // 设置物体的位置信息
            // if (this.anchor) {
            // 	this.anchorPos = this.anchor.worldTransform.position;
            // 	console.log("anchor anchorPos " + this.anchorPos);
            // } else {
            // 	console.log("anchor is undefined");
            // }
        });
        //let anchorPos = this.anchor.worldTransform.position;
        this.putPet.onClicked.add(() => {
            //如果isInteractive为真，这段代码会执行离开交互模式的操作，然后从InterActiveBtn的子元素中获取第一个TextBlock对象，并将其文本内容改为"放入宠物"。
            if (this.isInteractive) {
                //this.thisInteractor.leave()
                const txtUI = this.putPet.getChildAt(0);
                txtUI.text = "放入宠物";
                // petAnimal.play();
                petObject.worldTransform.position = petPos;
                //let petAnimation = petObject.loadAnimation("181303");
                petAnimation.loop = 0;
                petAnimation.stop();
            }
            else {
                //如果isInteractive为假，这段代码会执行进入交互模式的操作，然后从InterActiveBtn的子元素中获取第一个TextBlock对象，并将其文本内容改为"拿起宠物"。
                if (!this.isInteractive) {
                    // 空锚点对象的坐标赋值给宠物对象坐标
                    petObject.worldTransform.position = this.anchorPos;
                    petAnimation.loop = 0;
                    petAnimation.play();
                    const txtUI = this.putPet.getChildAt(0);
                    txtUI.text = "拿起宠物";
                }
                else {
                    console.error("thisInteractor is Null");
                }
            }
            //点击后，isInteractive的值会反转。
            this.isInteractive = !this.isInteractive;
        });
    }
}

var foreign20 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    default: petBdeIntUIScript
});

let petBedTrigger = class petBedTrigger extends Script {
    /** 宠物放入床按钮处理，监听 petBed 标签的触发器的进入和离开事件 宠物放入床 */
    onStart() {
        let trigger = this.gameObject;
        this.gameObject.getChildByName("空锚点");
        //console.log("emp"+emp.name);
        trigger.onEnter.add((obj) => {
            if (trigger.tag == "petBed") {
                if (SystemUtil.isClient()) {
                    if (obj == Player.localPlayer.character) {
                        // let userUI=new petBdeIntUIScript().rootCanvas
                        setTimeout(() => {
                        }, 1000);
                        //TimeUtil.delaySecond(0.3);
                        UIService.show(petBdeIntUIScript);
                        //发送空锚点对象
                        Event.dispatchToLocal("宠物放入床", this.gameObject.getChildByName("空锚点")); //   as Interactor
                    }
                }
            }
        });
        trigger.onLeave.add((obj) => {
            if (trigger.tag == "petBed") {
                if (SystemUtil.isClient()) {
                    if (obj == Player.localPlayer.character) {
                        UIService.hide(petBdeIntUIScript);
                    }
                }
            }
        });
    }
};
petBedTrigger = __decorate([
    Component
], petBedTrigger);
var petBedTrigger$1 = petBedTrigger;

var foreign21 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    default: petBedTrigger$1
});

let TestTrace = class TestTrace extends Script {
    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    onStart() {
        if (SystemUtil.isClient()) {
            InputUtil.onKeyDown(Keys.G, () => {
                //this.lineTraceByCharacter();
                this.overlapByCharacter();
            });
            InputUtil.onKeyDown(Keys.H, () => {
                this.lineTraceByCharacter();
            });
        }
    }
    lineTraceByCharacter() {
        const player = Player.localPlayer;
        const playerPos = player.character.worldTransform.position;
        const front = player.character.localTransform.getForwardVector();
        const results = QueryUtil.lineTrace(playerPos, playerPos.clone().add(front.multiply(500)), true, true, null, null, null, player.character);
        for (let res of results) {
            console.log("碰撞点", res.position);
            EffectService.playAtPosition("4330", res.position);
        }
    }
    overlapByCharacter() {
        const player = Player.localPlayer;
        const playerPos = player.character.worldTransform.position;
        const results = QueryUtil.sphereOverlap(playerPos, 150, true, null, false, player.character);
        for (const result of results) {
            console.log("球形检测中的游戏对象的名字", result.name);
        }
    }
};
TestTrace = __decorate([
    Component
], TestTrace);
var TestTrace$1 = TestTrace;

var foreign22 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    default: TestTrace$1
});

/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * ATTENTION: onStart 等UI脚本自带函数不可改写为异步执行，有需求的异步逻辑请使用函数封装，通过函数接口在内部使用
 * UI: UI/TriggerUI.ui
*/
let TriggerUI_Generate = class TriggerUI_Generate extends UIScript {
    get sit() {
        if (!this.sit_Internal && this.uiWidgetBase) {
            this.sit_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/sit');
        }
        return this.sit_Internal;
    }
    get textBlock() {
        if (!this.textBlock_Internal && this.uiWidgetBase) {
            this.textBlock_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/sit/textBlock');
        }
        return this.textBlock_Internal;
    }
    /**
    * onStart 之前触发一次
    */
    onAwake() {
    }
};
TriggerUI_Generate = __decorate([
    UIBind('UI/TriggerUI.ui')
], TriggerUI_Generate);
var TriggerUI_Generate$1 = TriggerUI_Generate;

var foreign32 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    default: TriggerUI_Generate$1
});

class TriggerUI extends TriggerUI_Generate$1 {
    constructor() {
        super(...arguments);
        //表示当前对象的交互功能被关闭或者开启,默认为假。
        this.isInteractive = false;
    }
    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    onStart() {
        Event.addLocalListener("Sit", (param) => {
            // console.info(param.name)
            this.thisInteractor = param;
        });
        this.sit.onClicked.add(() => {
            //如果isInteractive为真，这段代码会执行离开交互模式的操作，然后从InterActiveBtn的子元素中获取第一个TextBlock对象，并将其文本内容改为"坐下"。
            if (this.isInteractive) {
                this.thisInteractor.leave();
                const txtUI = this.sit.getChildAt(0);
                txtUI.text = "坐下";
            }
            else {
                //如果isInteractive为假，会异步下载一个资源（ID为227508），下载成功后让交互器进入（enter方法），
                AssetUtil.asyncDownloadAsset("227508").then((res) => {
                    if (res) {
                        this.thisInteractor.enter(Player.localPlayer.character);
                    }
                });
                const txtUI = this.sit.getChildAt(0);
                txtUI.text = "起身";
            }
            //点击后，isInteractive的值会反转。
            this.isInteractive = !this.isInteractive;
        });
    }
    /**
     * 周期函数 每帧执行
     * 此函数执行需要将this.useUpdate赋值为true
     * @param dt 当前帧与上一帧的延迟 / 秒
     */
    onUpdate(dt) {
    }
    /** 脚本被销毁时最后一帧执行完调用此函数 */
    onDestroy() {
    }
}

var foreign26 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    default: TriggerUI
});

let TriggerEvent = 
/**
 * 坐下站起按钮处理，监听Sit触发器的进入和离开事件
 */
class TriggerEvent extends Script {
    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    onStart() {
        let trigger = this.gameObject;
        trigger.onEnter.add((obj) => {
            if (trigger.tag == "Sit") {
                if (SystemUtil.isClient()) {
                    if (obj == Player.localPlayer.character) {
                        UIService.show(TriggerUI);
                        Event.dispatchToLocal("Sit", this.gameObject.parent);
                    }
                }
            }
        });
        trigger.onLeave.add((obj) => {
            if (trigger.tag == "Sit") {
                if (SystemUtil.isClient()) {
                    if (obj == Player.localPlayer.character) {
                        UIService.hide(TriggerUI);
                    }
                }
            }
        });
    }
    /**
     * 周期函数 每帧执行
     * 此函数执行需要将this.useUpdate赋值为true
     * @param dt 当前帧与上一帧的延迟 / 秒
     */
    onUpdate(dt) {
    }
    /** 脚本被销毁时最后一帧执行完调用此函数 */
    onDestroy() {
    }
};
TriggerEvent = __decorate([
    Component
    /**
     * 坐下站起按钮处理，监听Sit触发器的进入和离开事件
     */
], TriggerEvent);
var TriggerEvent$1 = TriggerEvent;

var foreign24 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    default: TriggerEvent$1
});

let Trigger$1 = class Trigger extends Script {
    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    onStart() {
        if (SystemUtil.isClient()) {
            //通过 GameObject  获取触发器对象
            let localGameObject = this.gameObject;
            let trigger = localGameObject;
            // 处理Trigger对象
            //为触发器绑定 有物体进入时 会触发的监听事件
            trigger.onEnter.add(this.onTriggerEnter);
            //为触发器绑定 有物体离开时 会触发的监听事件
            trigger.onLeave.add(this.onTriggerLeave);
        }
    }
    //有物体进入了触发区域,other 为进入触发区域的物体对象
    onTriggerEnter(other) {
        //这里判断一下进入区域的物体是不是一名角色
        if (other instanceof Character) {
            //修改角色名称
            UIService.show(TestUIScript);
            console.log("Character onTriggerEnter");
        }
    }
    //有物体离开了触发区域
    onTriggerLeave(other) {
        //这里判断一下离开区域的物体是不是一名角色
        if (other instanceof Character) {
            //修改角色名称
            UIService.hide(TestUIScript);
            console.log("Character onTriggerLeave");
        }
    }
};
Trigger$1 = __decorate([
    Component
], Trigger$1);
var Trigger$2 = Trigger$1;

var foreign25 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    default: Trigger$2
});

/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * ATTENTION: onStart 等UI脚本自带函数不可改写为异步执行，有需求的异步逻辑请使用函数封装，通过函数接口在内部使用
 * UI: UI/DefaultUI.ui
*/
let DefaultUI_Generate = class DefaultUI_Generate extends UIScript {
    /**
    * onStart 之前触发一次
    */
    onAwake() {
    }
};
DefaultUI_Generate = __decorate([
    UIBind('UI/DefaultUI.ui')
], DefaultUI_Generate);
var DefaultUI_Generate$1 = DefaultUI_Generate;

var foreign27 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    default: DefaultUI_Generate$1
});

/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * ATTENTION: onStart 等UI脚本自带函数不可改写为异步执行，有需求的异步逻辑请使用函数封装，通过函数接口在内部使用
 * UI: UI/EasyPrefabV1/按钮.ui
*/
let 按钮_Generate = class 按钮_Generate extends UIScript {
    /**
    * onStart 之前触发一次
    */
    onAwake() {
    }
};
按钮_Generate = __decorate([
    UIBind('UI/EasyPrefabV1/按钮.ui')
], 按钮_Generate);
var 按钮_Generate$1 = 按钮_Generate;

var foreign28 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    default: 按钮_Generate$1
});

/**
 * AUTO GENERATE BY UI EDITOR.
 * WARNING: DO NOT MODIFY THIS FILE,MAY CAUSE CODE LOST.
 * ATTENTION: onStart 等UI脚本自带函数不可改写为异步执行，有需求的异步逻辑请使用函数封装，通过函数接口在内部使用
 * UI: UI/LadderControlUI.ui
*/
let LadderControlUI_Generate = class LadderControlUI_Generate extends UIScript {
    get downBtn() {
        if (!this.downBtn_Internal && this.uiWidgetBase) {
            this.downBtn_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/downBtn');
        }
        return this.downBtn_Internal;
    }
    get upBtn() {
        if (!this.upBtn_Internal && this.uiWidgetBase) {
            this.upBtn_Internal = this.uiWidgetBase.findChildByPath('RootCanvas/upBtn');
        }
        return this.upBtn_Internal;
    }
    /**
    * onStart 之前触发一次
    */
    onAwake() {
    }
};
LadderControlUI_Generate = __decorate([
    UIBind('UI/LadderControlUI.ui')
], LadderControlUI_Generate);
var LadderControlUI_Generate$1 = LadderControlUI_Generate;

var foreign29 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    default: LadderControlUI_Generate$1
});

const MWModuleMap = { 
     'E724B300475210A81A8AE79F3D8AFBEB': foreign1,
     '234749C04CA8B5F3BA0397BBF97B8E31': foreign2,
     '8061A2F74F631568FEDFEAB138E383B6': foreign3,
     '21E0839CC41DC4DC27D94186544C9915': foreign4,
     'D3FF63A34C4585F8E3A72EBD7BE68038': foreign5,
     'B1CA5CEB437A89CDD2AB79AD84A4013E': foreign6,
     '2264788F42037A0B1E694094CE050E1A': foreign7,
     'BA90B8AA4E10D4DD4DECB39BBEB99489': foreign8,
     'E793F4E748068B7014AF149815249190': foreign9,
     'EC54FB9741D8A3C60F87C4818CCA0145': foreign10,
     '21EE2A844A9617940BC087A21C32CE17': foreign11,
     '409102604FFC52CE452300800A3FF65F': foreign12,
     'A0BB249D40B91EC143B005ABD3DB445C': foreign13,
     '27EEC88D426C15AA32527DB73B6DA957': foreign14,
     '77E1AE94477BAD5DE4CC67ACB786A2F6': foreign15,
     'BA58687549F8591949C129A9016A3B64': foreign16,
     '1DC44E5A451FE2B3A88139A3200F307A': foreign17,
     '185562974F0D70FAF70F64992DF4A455': foreign18,
     'FD2DD47E423ED346200F309FB8A19AC7': foreign19,
     '72705B534FF1CCC2B081098432386832': foreign20,
     '0C18DB834C54A08B8F164EBE7D4AE2BB': foreign21,
     '9DE73E9A4637B73E89D8648F33DFBBA7': foreign22,
     '30D39ED54F188E21207A158B18BA6A6F': foreign23,
     'C15D9C23447E281B357A76BB0852ED46': foreign24,
     '5C710BA9434EC88FB67BA4AD720D2B36': foreign25,
     '61E9D248443BC225F28E4BBC6C18340C': foreign26,
     'B698B35841B3356314C8608FCD7A810E': foreign27,
     '6A49E02441C0887A321D1DA5D02EE094': foreign28,
     '95B6D9B84A2501592EE2F0ABC25C2EB6': foreign29,
     'DA7BF61E4FCF9C1B75B0FF9523DB63E1': foreign30,
     '1C5E488F40D7870D1B0F0F859243901F': foreign31,
     'EAA605B24F661FDFEB58C2946EF25935': foreign32,
};
const MWFileMapping = new WeakMap([[foreign1 || {}, "JavaScripts/Completed/actionScript"],
[foreign2 || {}, "JavaScripts/Completed/DoorTrigger"],
[foreign3 || {}, "JavaScripts/Completed/follow"],
[foreign4 || {}, "JavaScripts/Completed/GravityArea"],
[foreign5 || {}, "JavaScripts/Completed/Launch"],
[foreign6 || {}, "JavaScripts/Completed/petScript"],
[foreign7 || {}, "JavaScripts/Completed/Trigger"],
[foreign8 || {}, "JavaScripts/Completed/TriggerEvent"],
[foreign9 || {}, "JavaScripts/DefaultUI"],
[foreign10 || {}, "JavaScripts/EasyButton1"],
[foreign11 || {}, "JavaScripts/EasyPrefabV1/EasyButton"],
[foreign12 || {}, "JavaScripts/EasyPrefabV1/EasyEvent"],
[foreign13 || {}, "JavaScripts/EasyPrefabV1/EasyRotate"],
[foreign14 || {}, "JavaScripts/EasyPrefabV1/EasyTeleport"],
[foreign15 || {}, "JavaScripts/GameObjectExample"],
[foreign16 || {}, "JavaScripts/GameStart"],
[foreign17 || {}, "JavaScripts/Interact01"],
[foreign18 || {}, "JavaScripts/MoveFacingDirection"],
[foreign19 || {}, "JavaScripts/peBeding"],
[foreign20 || {}, "JavaScripts/petBdeIntUIScript"],
[foreign21 || {}, "JavaScripts/petBedTrigger"],
[foreign22 || {}, "JavaScripts/TestTrace"],
[foreign23 || {}, "JavaScripts/TestUIScript"],
[foreign24 || {}, "JavaScripts/TriggerEvent"],
[foreign25 || {}, "JavaScripts/TriggerTest"],
[foreign26 || {}, "JavaScripts/TriggerUI"],
[foreign27 || {}, "JavaScripts/ui-generate/DefaultUI_generate"],
[foreign28 || {}, "JavaScripts/ui-generate/EasyPrefabV1/按钮_generate"],
[foreign29 || {}, "JavaScripts/ui-generate/LadderControlUI_generate"],
[foreign30 || {}, "JavaScripts/ui-generate/petBedUI_generate"],
[foreign31 || {}, "JavaScripts/ui-generate/TestUI_generate"],
[foreign32 || {}, "JavaScripts/ui-generate/TriggerUI_generate"]]);

exports.MWFileMapping = MWFileMapping;
exports.MWModuleMap = MWModuleMap;
//# sourceMappingURL=game.js.map
