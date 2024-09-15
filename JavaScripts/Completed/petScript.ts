@Component
export default class petScript extends Script {


    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected async onStart(): Promise<void> {
        if (SystemUtil.isClient()) {



            let npc3 = await this.gameObject as Character;

            //加载角色动画资源

            const character1 = Player.localPlayer.character;

            let chara = character1;

            //将坐着打招呼的动画资源转为二级姿态
            let chara_stance = chara.loadSubStance("285631");//姿态 下蹲285631
            //加载一个角色动画
            let chara_animation = chara.loadAnimation("285185");//动画 喂食285185

            //const CC = npc3.loadAnimation("181295");//动画 猫吃东西 181295 
            let CC2 = npc3.loadAnimation("181298");  //动画   懒腰 181298
            let catStand = npc3.loadStance("181291");// 姿态 猫姿态 181291
            //let lazy = npc3.loadSubStance("181298");  //姿态   懒腰 181298
            let animation = npc3.loadAnimation("181289");///动画 奔跑 181289
            // 定义一个放姿态 assetId 的变量，后面引用

            // 假设这个是宠物
            let pet = npc3;

            await AssetUtil.asyncDownloadAsset("181298");
            await AssetUtil.asyncDownloadAsset("106699");//特效 升级  106699

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
                let playerPos = chara.worldTransform.position;
                myCamera.lookAt(npc3);
 
                // 计算出宠物和玩家之间的向量
                // 计算宠物朝向
                let rotation = chara.worldTransform.position.clone().subtract(pet.worldTransform.position).toRotation();
               
                // 宠物朝向赋值，设置 rotation　y= 0
                rotation.y = 0;
                pet.worldTransform.rotation = rotation;

                // 玩家朝向赋值,返回一个与原来的旋转对象互补的旋转对象
                
                let PlayerRotation = rotation;

                PlayerRotation = PlayerRotation.subtract(new Rotation(0,0,180));
                
                chara.worldTransform.rotation = PlayerRotation;

                 //让NPC3动画播放
                playCat();

               
                chara_stance.blendMode = StanceBlendMode.BlendLower;
                //播放姿态
                chara_stance.play();
                setTimeout(() => {
                    chara_stance.stop();
                }, 3500)

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
                    SoundService.playSound("135489",1) ;
                    //在对象上播放特效（特效ID，目标对象）
                    EffectService.playOnGameObject("106699", npc3,
                        {
                            //特效播放得插槽位置
                            slotType: HumanoidSlotType.Root,
                            //特效的旋转角度
                            rotation: new Rotation(0, 0, -90)
                        });
                });
           };

        }


    }
}