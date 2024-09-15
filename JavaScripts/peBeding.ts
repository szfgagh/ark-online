import Interact01 from './Interact01';

@Component
export default class peBeding extends Script {

    //thisInteractor: any;
    
    //播放让宠物在指定对象位置上播放动画

    protected async onStart(): Promise<void> {
        if(SystemUtil.isClient){
       

        // const petObject = GameObject.findGameObjectById("2EAFFFF9") as Character;// 2EAFFFF9
        // const anchor = this.gameObject.getChildByPath("触发器/空锚点") as GameObject;
        // await petObject.asyncReady()
        // await anchor.asyncReady()

        // console.log("anchor"+anchor.name);
          
        // let anchorPos = anchor.worldTransform.position;

        // console.info("anchorPos"+anchorPos)

        // petObject.worldTransform.position = anchorPos;
        //     //猫睡觉 ("181294");
        // let petAnimation=petObject.loadAnimation("181303");

        // await TimeUtil.delaySecond(1);

        // petAnimation.loop=0;
        // petAnimation.play();
    }
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