@Component
export default class MoveFacingDirection extends Script {
    // 当脚本被实例后，会在第一帧更新前调用此函数
    protected onStart(): void {
        // 下列代码仅在客户端执行
        if(SystemUtil.isClient()) {
            // 获取当前客户端的玩家(自己)
            let myPlayer = Player.localPlayer;
            // 获取当前玩家控制的角色
            let myCharacter = myPlayer.character;
            // 设置定轴方向
            //myCharacter.movementAxisDirection = new Vector(1, 0, 0);
            // 打印当前角色的运动轴和面朝方向
            console.log("当前角色的运动面朝方向 " + MoveFacingDirection[myCharacter.moveFacingDirection]);
            console.log("当前角色的运动时依据的正方向 " + MovementDirection[myCharacter.movementDirection]);
            // 添加一个按键方法:按下键盘“1”，切换角色的运动面朝方向
            InputUtil.onKeyDown(Keys.One, () => {
                myCharacter.moveFacingDirection = (myCharacter.moveFacingDirection + 1) % 3;
                console.log("当前角色的运动 " + MoveFacingDirection[myCharacter.moveFacingDirection] + " + " + MovementDirection[myCharacter.movementDirection]);
            });
            // 添加一个按键方法:按下键盘“2”，切换角色的运动时依据的正方向
            InputUtil.onKeyDown(Keys.Two, () => {
                myCharacter.movementDirection = (myCharacter.movementDirection + 1) % 3;
                console.log("当前角色的运动 " + MoveFacingDirection[myCharacter.moveFacingDirection] + " + " + MovementDirection[myCharacter.movementDirection]);
                if(myCharacter.movementDirection == 0) {
                    console.log("当前角色的运动 " + MoveFacingDirection[myCharacter.moveFacingDirection] + " + " + MovementDirection[myCharacter.movementDirection] + " 定轴方向 " + myCharacter.movementAxisDirection);
                }
            });
        }
    }
}