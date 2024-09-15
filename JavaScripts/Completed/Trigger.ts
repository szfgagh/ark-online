@Component
export default class TriggerTest extends Script {

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected onStart(): void {
        //这里在服务端进行示例

        trigger: Trigger;
        if (SystemUtil.isClient()) {
            //通过上面复制的 GameObjectID 获取触发器对象
            let trigger = this.gameObject as Trigger
            // 处理Trigger对象

            //为触发器绑定 有物体进入时 会触发的监听事件
            trigger.onEnter.add(this.onTriggerEnter);
            //为触发器绑定 有物体离开时 会触发的监听事件
            trigger.onLeave.add(this.onTriggerLeave);


        }


    }

    //有物体进入了触发区域,other 为进入触发区域的物体对象
    private onTriggerEnter(other: GameObject) {
        //这里判断一下进入区域的物体是不是一名角色
        if (other instanceof Character) {
            //是的话，转成角色类型
            const character = other as Character;
            //修改角色名称
            character.displayName = "进入区域";
            
        }
    }

    //有物体离开了触发区域
    private onTriggerLeave(other: GameObject) {
        //这里判断一下离开区域的物体是不是一名角色
        if (other instanceof Character) {
            //是的话，转成角色类型
            const character = other as Character;
            //修改角色名称
            character.displayName = "离开区域";
        }
    }
}