 
@Component

 
export default class Launch extends Script {
    // 填写触发器的 GameObjectId this.gameObject as Trigger
    triggerGameObjectId = "31C3778E";
    // 填写交互物的 GameObjectId
    interactiveGameObjectId = "2771854A"
    

    
    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected async onStart() {
        // 因为是坐下是个动作，我们只需要在客户端表现，这里就在客户端运行
        if (SystemUtil.isClient()) {

            let Interactor1 = this.gameObject as Interactor;
            const character1 = Player.localPlayer.character;
            //   动画 坐姿鬼脸 280682
              await AssetUtil.asyncDownloadAsset("280682");
            // 获取交互物
           // const interactive = (await GameObject.asyncFindGameObjectById(this.interactiveGameObjectId)) as Interactor;
            // 获取触发器
            const trigger = (await GameObject.asyncFindGameObjectById(this.triggerGameObjectId)) as Trigger;
            // 触发器事件绑定
           trigger.onEnter.add(go => {
                // 判断进入碰撞区域的对象是否为角色
                if (!(character1 instanceof Character)) {
                    // 不是角色，停止执行
                    return;
                }
                // 让该角色进入交互 坐姿鬼脸 280682
                Interactor1 .enter(character1,HumanoidSlotType.Buttocks,"280682");
                
                
                console.log("onInteractiveStarted");
                 
                //5000 毫秒后离开交互，并移动到(0,0,100)
                setTimeout(() => {
                    Interactor1 .leave();//new Vector(0, 0, 100)
                }, 5000);
            }
        )
        }
    }
}
