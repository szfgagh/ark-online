/**
 * 触发器信号脚本
 * @version v1.0.2
 */
@Component
export default class EasyEvent extends Script {

    @Property({ displayName: "角色进入信号", group: "发出信号" })
    public enterEvent: string = "";
    
    

    @Property({ displayName: "角色离开信号", group: "发出信号" })
    public leaveEvent: string = "";

    @Property({ displayName: "版本号", group: "预制体信息", readonly: true })
    public version: string = "v1.0.2";

    protected onStart(): void {
        

        // 判断是否挂载在触发器上
        if (this.gameObject instanceof Trigger) {
            if (this.enterEvent != "") {
                this.gameObject.onEnter.add((character: GameObject) => {
                    if (character instanceof Character) {
                        if (StringUtil.isEmpty(this.enterEvent)) return;
                        character.asyncReady().then((char) => {
                            if (character.player == null) return;
                            Event.dispatchToLocal(this.enterEvent, char.player.userId);
                        });
                    }
                });
            }

            if (this.leaveEvent != "") {
                this.gameObject.onLeave.add((character: GameObject) => {
                    if (character instanceof Character) {
                        if (StringUtil.isEmpty(this.leaveEvent)) return;
                        character.asyncReady().then((char) => {
                            if (character.player == null) return;
                            Event.dispatchToLocal(this.leaveEvent, char.player.userId);
                        });
                    }
                });
            }

        } else {
            console.error("[EasyEvent]:脚本必须挂载在触发器上!");
        }
    }


}