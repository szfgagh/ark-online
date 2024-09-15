@Component
export default class actionScript extends Script {
//绑定玩家
    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected onStart(): void {

        // 获取玩家
        const character1 = Player.localPlayer.character;
         
        // let myPlayer = Player.localPlayer;
        //     // 获取玩家控制角色
        //     let myCharacter = myPlayer.character;
        //this.character = this.gameObject.addComponent('Character');
        let chara = character1 ;
        
        //将坐着打招呼的动画资源转为二级姿态
        let stance = chara.loadSubStance("285631");//姿态 下蹲285631
        //加载一个挥手的角色动画
        let animation = chara.loadAnimation("285185");//动画 喂食285185

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
            setTimeout(()=>{
                stance.stop();
            },3500)

            //设置动画的播放部位为下半身
            animation.slot = AnimSlot.Upper;
            //播放动画
            animation.play();      
            
             
                // 发送本地事件，事件名我们可以随便自定义，但是要保证发送方和接收方的事件名一致，否则接收不到事件	
                // 这里我们定义事件名为"client_local_event_feed"喂食	
                Event.dispatchToLocal("client_local_event_feed");	
             
        });
    }
}