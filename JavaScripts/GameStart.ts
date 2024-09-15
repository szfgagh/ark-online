import TestUIScript from "./TestUIScript";

@Component
export default class GameStart extends Script {

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
     protected async onStart(): Promise<void> {
        if(SystemUtil.isClient){
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
    protected onUpdate(dt: number): void {

    }

    /** 脚本被销毁时最后一帧执行完调用此函数 */
    protected onDestroy(): void {

    }
    
}