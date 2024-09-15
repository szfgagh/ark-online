enum TeleportType {
    None = 0,
    AtoB = 1,
    BtoA = 2
}
/**
 * 传送门组件脚本
 * @version v1.1.0
 */
@Component
export default class EasyTeleport extends Script {
    @Property({ displayName: "开启信号", group: "接收信号" })
    public startEvent: string = ""

    @Property({ displayName: "关闭信号", group: "接收信号" })
    public stopEvent: string = ""

    @Property({
        displayName: "是否自动开启",
        defaultValue: true,
        tooltip: "传送门是否默认开启",
        group: "传送门设置"
    })
    public isOpen = true

    @Property({
        displayName: "是否单向传送",
        tooltip: "开启后，传送门只能从A门传送至B门",
        defaultValue: false,
        group: "传送门设置"
    })
    public isOneway = false

    @Property({
        displayName: "开关是否影响所有玩家",
        tooltip: "默认影响所有人,也就是说只要有一个玩家打开传送门,其它所有玩家都可以使用\n"
            + "如果不勾选,这个传送门开启后只能由开启者通过",
        defaultValue: true,
        group: "传送门设置"
    })
    public isServerObj = true;

    @Property({ displayName: "版本号", group: "预制体信息", readonly: true })
    public version: string = "v1.1.0";

    @Property({ displayName: "传送门A", capture: true, group: "内置配置 (无需修改)" })
    private doorAGuid: string = "";
    @Property({ displayName: "传送门B", capture: true, group: "内置配置 (无需修改)" })
    private doorBGuid: string = "";

    /** 传送类型 */
    private teleportType: TeleportType = TeleportType.None
    /** 传送门A */
    private doorA: Trigger = null;
    /** 传送门B */
    private doorB: Trigger = null;
    /** 按钮是否被按下 */
    private isButtonClick: boolean = false;

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected onStart(): void {
        if (SystemUtil.isClient) {

            // UIService.show(NewUIScript);



            const effectAssetId = '271319'; //特效 光圈 14333 瞬移消失 271319
            const position = Player.localPlayer.character.worldTransform.position; // 获取角色当前位置
            console.log("position", position)

            //在角色当前位置播放特效
            EffectService.playAtPosition(effectAssetId, position);

            this.initDoor().then(() => {
                if (!(this.doorA && this.doorB)) {
                    console.log("传送门预制体存在组件缺失，请检查");
                    return;
                }

                if (this.isOpen) {
                    this.openDoor();
                } else {
                    this.closeDoor();
                }

                // 监听启动信号
                if (this.startEvent != "") {
                    Event.addLocalListener(this.startEvent, () => {
                        this.openDoor();

                    })
                }

                // 监听停止信号
                if (this.stopEvent != "") {
                    Event.addLocalListener(this.stopEvent, () => {
                        this.closeDoor()
                    })
                }

                // 下面的代码客户端运行即可
                if (SystemUtil.isServer()) {
                    return;
                }

                this.teleportType = TeleportType.None;
                //传送开始
                this.doorA.onEnter.add((enterObject: GameObject) => {
                    if (enterObject === Player.localPlayer.character && this.teleportType === TeleportType.None) {

                        if (this.isButtonClick) {
                            this.teleportType = TeleportType.AtoB;
                            //黑屏1秒
                            this.blackScrene();

                            enterObject.worldTransform.position = this.doorB.worldTransform.position;
                        }
                    }
                })

                this.doorB.onEnter.add((enterObject: GameObject) => {
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

                this.doorA.onLeave.add((enterObject: GameObject) => {
                    if (enterObject === Player.localPlayer.character && this.teleportType === TeleportType.BtoA) {
                        this.teleportType = TeleportType.None;
                    }
                });

                this.doorB.onLeave.add((enterObject: GameObject) => {
                    if (enterObject === Player.localPlayer.character && this.teleportType === TeleportType.AtoB) {
                        this.teleportType = TeleportType.None;
                    }
                });

            });

        }
    }

    private async initDoor(): Promise<void> {

        this.doorA = this.gameObject.getChildByName("门A") as Trigger;
        this.doorB = this.gameObject.getChildByName("门B") as Trigger;

        if (this.doorA == null) this.doorA = await GameObject.asyncFindGameObjectById(this.doorAGuid) as Trigger;
        if (this.doorB == null) this.doorB = await GameObject.asyncFindGameObjectById(this.doorBGuid) as Trigger;
    }

    private openDoor() {
        if (this.isServerObj) {
            this.doorA.enabled = true;
            this.doorB.enabled = true;
            this.doorA.setVisibility(true);
            this.doorB.setVisibility(true);
        } else {
            if (SystemUtil.isClient()) {
                this.doorA.enabled = true;
                this.doorB.enabled = true;
                this.doorA.setVisibility(true);
                this.doorB.setVisibility(true);
            }
        }
    }
    //黑屏
    private blackScrene() {
        // 创建一个UI对象!
        let ui = mw.UserWidget.newObject();
        // 将UI添加到屏幕上
        ui.addToViewport(1)
        // 创建一个画布组件
        let rootCanvas = mw.Canvas.newObject()
        //获取全屏的大小赋值给画布组件
        rootCanvas.size = WindowUtil.getViewportSize();

        rootCanvas.position = Vector2.zero
        //将Ui的根画布设置为rootCanvas
        ui.rootContent = rootCanvas
        // 创建一个UI添加到画布上
        let image = mw.Image.newObject(rootCanvas)
        //获取全屏的大小赋值给image组件
        image.size = WindowUtil.getViewportSize();

        image.setImageColorDecimal(0, 0, 0, 255);



        const effectAssetId = '271319'; //特效 光圈 14333 瞬移消失 271319
        const position = Player.localPlayer.character.worldTransform.position; // 获取角色当前位置
        console.log("position", position)

        //在角色当前位置播放特效
        EffectService.playAtPosition(effectAssetId, position);




        setTimeout(() => {
            ui.destroyObject();
        }, 1000);


    }

    private closeDoor() {
        if (this.isServerObj) {
            this.doorA.enabled = false;
            this.doorB.enabled = false;
            this.doorA.setVisibility(false);
            this.doorB.setVisibility(false);
        } else {
            if (SystemUtil.isClient()) {
                this.doorA.enabled = false;
                this.doorB.enabled = false;
                this.doorA.setVisibility(false);
                this.doorB.setVisibility(false);
            }
        }

    }
}
