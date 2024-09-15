@Component

export default class follow extends Script {


    private pet = null

    private refreshtime: number = 0;

    private newVector: Vector = Vector.zero

    private catStandstanceID = "181291";// 动画 猫站立  181291
    private catRunstanceID = "181390";// 动画 猫跑步 181293 猫走路 181390

    /** 当脚本被实例后，会在第一帧更新前调用此函数  */
    protected async onStart(): Promise<void> {
        if (SystemUtil.isServer()) {
            return;
        }
        this.pet = this.gameObject as Character;
        await this.pet.asyncReady()
        this.pet.setCollision(PropertyStatus.On);

        this.useUpdate = true

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


    protected onUpdate(dt: number): void {
        let refresh: boolean = false
        if (this.refreshtime < 0) {
            refresh = true;
            this.refreshtime = 0.5
        } else {
            this.refreshtime -= dt
        }

        const player = mw.Player.getPlayer(Player.localPlayer.userId)
        if (player && player.character) {
            const trans = player.character.worldTransform

            //角色背对向量
            const charBackVec = trans.getForwardVector().negative

            const model: Model = this.pet;
            if (!model) {
                return
            }
            if (!model.getVisibility()) {
                model.setVisibility(true)
                model.worldTransform.rotation = trans.rotation
                //创建了一个向后移动50单位的新位置（基于Transform的正向向量）并且z轴为0的位置，并将角色的位置更新为此新位置。接着，新位置被重置为原始Transform的位置。
                this.newVector = trans.position.clone().add(charBackVec.clone().multiply(50))

                model.worldTransform.position = this.newVector
                this.newVector = trans.position
            }

            const prepos = model.worldTransform.position
            //宠物当前位置
            let nowpos = new Vector(prepos.x, prepos.y, player.character.worldTransform.position.z);// trans.position.z
            console.log("nowpos " + nowpos);

            let backv: Vector = Vector.zero
            let targetpos: Vector = Vector.zero
            //玩家身后位置
            backv = charBackVec
            //目标位置
            targetpos = this.newVector;



            if (refresh) {
                this.newVector = Vector.add(trans.position, Vector.multiply(backv, 90))
            }
            const dis = Vector.distance(nowpos, targetpos)

            //下一帧的新位置
            let newpos: Vector = Vector.zero
            if (dis > 3) {
                newpos = Vector.moveTowards(nowpos, targetpos, 0.05 * dis);
                //在本地客户端上触发名为petMove的事件
                Event.dispatchToLocal("petMove");
                console.log("nowpos " + nowpos);


            } else {
                Event.dispatchToLocal("petEndMove");
                newpos = nowpos
            }

            const offsetv = new Vector(0, 0, -60)
            model.worldTransform.position = Vector.add(newpos, offsetv)
            //console.log("newpos:"+newpos);
            model.worldTransform.rotation = backv.toRotation().add(new Rotation(0, 0, 180))

            console.log("model.worldTransform.position " + model.worldTransform.position);
        }


    }

}




