/**
 * 按钮UI组件脚本
 * @version v1.0.0
 */
@Component
export default class EasyButton1 extends Script {

    @Property({ displayName: "显示按钮信号", group: "接收信号" })
    public showEvent: string = ""

    @Property({ displayName: "关闭按钮信号", group: "接收信号" })
    public hideEvent: string = ""

    @Property({ displayName: "按键按下信号", group: "发出信号" })
    public clickEvent: string = ""

    @Property({ displayName: "按键抬起信号", group: "发出信号" })
    public clickEdEvent: string = ""

    @Property({ displayName: "是否默认显示按钮", group: "按钮设置" })
    public isAutoenable: boolean = true;

    @Property({ displayName: "背景图资源ID", group: "按钮设置", defaultValue: "289278" })
    public bgPicGuid: string = "289278";

    @Property({ displayName: "按钮位置", tooltip: "屏幕大小默认为 1920x1080,这里可以设置按钮的位置\n按钮位置默认与右下角对齐", group: "按钮设置" })
    public btnPos: Vector2 = new Vector2(1600, 550);

    @Property({ displayName: "按钮文本", group: "按钮设置" })
    public btnName: string = "按钮";

    @Property({ displayName: "按钮大小", tooltip: "", group: "按钮设置" })
    public btnSize: Vector2 = new Vector2(256, 256);

    @Property({ displayName: "版本号", group: "预制体信息", readonly: true })
    public version: string = "v1.0.0";

    private _btnCom: StaleButton = null;

    //public child1ID: string= null;
   static child1ID: string= null;

    static child1 :GameObject;

   // public eventMutex = false;

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected onStart(): void {

        if (SystemUtil.isClient()) {
            // 获取UI文件
            const uiObj = this.gameObject.getChildByPath("/按钮") as UIObject;
            if (uiObj) {
                this._btnCom = uiObj.uiWidgetBase.findChildByPath("RootCanvas/Btn") as StaleButton;
                if (this._btnCom == null) {
                    console.error("[EasyButton]:按钮组件获取失败!,id:", this.gameObject.gameObjectId);
                    return;
                } else {
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
                        Event.addLocalListener(this.hideEvent, (userId: string) => {
                            if (userId != Player.localPlayer.userId) return;
                            this._btnCom.visibility = SlateVisibility.Collapsed;
                        });
                    }
                    
                    // 显示 UI
                    if (this.showEvent != "") {
                        Event.addLocalListener(this.showEvent, (userId: string) => {
                            if (userId != Player.localPlayer.userId) return;
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
                            Event.dispatchToLocal(this.clickEvent,Player.localPlayer.userId);
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
            } else {
                console.error("[EasyButton]:按钮文件获取失败!,id:", this.gameObject.gameObjectId);
                return;
            }
        }

    }

    @RemoteFunction(Server)
    private serverEventEmit(userId: string, eventStr: string): void {
        Event.dispatchToLocal(eventStr, userId);
    }

}