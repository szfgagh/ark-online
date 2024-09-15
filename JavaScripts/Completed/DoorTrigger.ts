@Component
//当玩家进入触发器时，门会旋转100度打开；当玩家离开触发器时，门会旋转回0度关闭。
export default class DoorTrigger extends Script {
    private door: GameObject;
    //isDoorOpen用于切换门的开关状态，
    private isDoorOpen: boolean = false;

    protected onStart(): void {

        this.door = this.gameObject.getChildByName("门") as GameObject;
        let localGameObject = this.gameObject;       
        let trigger = localGameObject as Trigger;

   
        if (SystemUtil.isClient()) {
            trigger.onEnter.add((other: GameObject) => {
                if (other instanceof Character) {
                    this.openDoor();
                }
            });

            trigger.onLeave.add((gameObject: GameObject) => {
                if (gameObject instanceof Character) {                    
                    setTimeout(() => {
                        this.closeDoor();    
                    }, 1000);
                    
                   
                }
            });
        }
    }
    //开门
    private openDoor(): void {
        if (this.isDoorOpen==false) {
            this.isDoorOpen = true;
            this.door.worldTransform.rotation = new Rotation(0, 0, 100);
        }
    }
    //关门
    private closeDoor(): void {
        if (this.isDoorOpen) {
            this.isDoorOpen = false;
            this.door.worldTransform.rotation = new Rotation(0, 0, 0);
        }
    }
}
