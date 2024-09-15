/**
 * 旋转组件脚本
 * @version v1.0.0
 */
@Component
export default class EasyRotate extends Script {

    @Property({ displayName: "开启信号", group: "接收信号" })
    public startEvent: string = ""

    @Property({ displayName: "停止信号", group: "接收信号" })
    public stopEvent: string = ""


    @Property({ displayName: "是否自动开启", defaultValue: true, group: "旋转组件设置" })
    public isOpen = true

    @Property({
        displayName: "旋转模式",
        enumType: {
            "持续旋转": 301,
            "目标角度": 302,
        },
        defaultValue: 10,
        tooltip: "选中【持续旋转】时，【固定角度】不生效,选中【目标角度】时，固定角度参数生效,物体会转动到指定角度",
        group: "旋转组件设置"
    })
    public rotateMode = 301

    @Property({
        displayName: "旋转方向",
        enumType: {
            "向前": 0,
            "向后": 1,
            "向左": 2,
            "向右": 3,
            "顺时针": 4,
            "逆时针": 5,
            "左前": 6,
            "右前": 7,
            "左后": 8,
            "右后": 9,
        },
        defaultValue: 0,
        tooltip: "【向前】是绕y轴顺时针旋转，【向后】是绕y轴逆时针旋转(绕轴是从箭头方向面向原点判断顺时针还是逆时针)" +
            "\n【向左】是绕X轴顺时针旋转，【向右】是绕X轴逆时针旋转" +
            "\n【顺时针】是绕Z轴顺时针旋转，【逆时针】是绕Z轴逆时针旋转",
        group: "旋转组件设置"
    })
    public rotateDirection: number = 0

    @Property({
        displayName: "基础轴向",
        enumType: {
            "本地轴向": 10,
            "世界轴向": 11
        },
        defaultValue: 10,
        tooltip: "可以在工具栏选中不同轴向预览坐标轴方向,若选择【固定角度】模式，则默认为世界轴向",
        group: "旋转组件设置"
    })
    public baseAxial = 10

    @Property({
        displayName: "固定角度",
        tooltip: "【旋转模式】选中固定角度后生效",
        defaultValue: 360,
        group: "旋转组件设置"
    })
    public rotateAngle: number = 360

    @Property({
        displayName: "旋转耗时(秒)",
        tooltip: "转到【固定角度】所需时间" +
            "\n若勾选了【是否保持运动】，则代表转一圈的时间",
        defaultValue: 2,
        group: "旋转组件设置"
    })
    public rotateDuration: number = 2

    @Property({ displayName: "版本号", group: "预制体信息", readonly: true })
    public version: string = "v1.0.0";

    // 定时器ID-定时取消运动器
    private timeoutId: number;

    //终点角度
    private endRotation: Rotation = Rotation.zero;

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected onStart(): void {
        if (SystemUtil.isClient()) {
            // 客户端端，不执行动作
            return
        }
        if (this.rotateDuration <= 0) {
            // 移动时长为0，不进行移动
            console.error("组件旋转一圈时长设置为0，不进行移动");
        }

        const rotateObj = this.gameObject as IntegratedMover;
        // 关闭往返运动
        rotateObj.rotationRepeat = false;

        // 轴向设置
        rotateObj.motionCoordinate = this.baseAxial == 11 ? MotionAxis.WorldAxis : MotionAxis.LocalAxis;

        rotateObj.rotationDelayStartTime = 0
        // 旋转速度（速度为360时，1秒一圈，所以速度等于一秒要转多少角度）
        let rotateSpeed = 1
        if (this.rotateMode === 301) {
            // 持续旋转

            // 不重复
            rotateObj.rotationRepeat = false
            // 设置旋转速度(360 / 单圈时长)
            rotateSpeed = 360 / this.rotateDuration
        } else {
            // 固定角度
            rotateObj.motionCoordinate = MotionAxis.WorldAxis
            // 设置旋转速度(角度 * 单圈时长)
            rotateSpeed = this.rotateAngle / this.rotateDuration
            // 单程循环时间(旋转角度 / 360 * 单圈时间)
            rotateObj.rotationRepeatTime = this.rotateDuration
        }

        //根据设定方向，
        rotateObj.rotationSpeed = this.rotateDirectionCheck(rotateSpeed);

        let rotation: Rotation = new Rotation(rotateObj.rotationSpeed.x * this.rotateDuration, rotateObj.rotationSpeed.y * this.rotateDuration, rotateObj.rotationSpeed.z * this.rotateDuration)

        this.endRotation = rotateObj.parent.worldTransform.rotation.add(rotation)

        if (this.isOpen) {
            // 自动开启状态，马上执行
            this.startRotate(rotateObj);
        }

        // 监听启动信号
        if (!StringUtil.isEmpty(this.startEvent)) {
            Event.addLocalListener(this.startEvent, () => {

                if (this.rotateMode === 302) {
                    if (this.gameObject.parent.worldTransform.rotation.equals(this.endRotation, 2)) {
                        this.gameObject.parent.worldTransform.rotation = this.endRotation
                        return;
                    }
                }

                this.startRotate(rotateObj);
            })
        }

        // 监听停止信号
        if (!StringUtil.isEmpty(this.stopEvent)) {
            Event.addLocalListener(this.stopEvent, () => {
                if (this.timeoutId) {
                    clearTimeout(this.timeoutId);
                }
                rotateObj.enable = false;
            })
        }

    }

    private startRotate(rotateObj: mw.IntegratedMover) {

        let rotateDistance: Rotation = Rotation.subtract(this.endRotation, this.gameObject.parent.worldTransform.rotation.clone());

        rotateObj.rotationSpeed = new Vector(rotateDistance.x / this.rotateDuration, rotateDistance.y / this.rotateDuration, rotateDistance.z / this.rotateDuration)

        rotateObj.enable = true;

        if (!rotateObj.rotationRepeat && this.rotateMode !== 301) {
            // 若不重复，并且也不持续，那规定时间后就停止
            this.timeoutId = setTimeout(() => {
                if (this.rotateMode === 302) {
                    // 判断角度是否相等
                    if (this.gameObject.parent.worldTransform.rotation.equals(this.endRotation, 1)) {
                        this.gameObject.parent.worldTransform.rotation = this.endRotation;
                    }
                }
                rotateObj.enable = false
            }, this.rotateDuration * 1000 - 2)
        }
    }


    /**
     * 将单向旋转速度根据所选的旋转方向，生成最终Rotation向量
     * @param rotateSpeed 单向旋转速度
     * @returns Rotation向量
     */
    private rotateDirectionCheck(rotateSpeed: number): Vector {
        let rotationSpeed: Vector = Vector.zero;
        switch (this.rotateDirection) {
            case 0:
                // 向前，绕y轴顺时针旋转
                rotationSpeed = new Vector(0, -rotateSpeed, 0)
                break;
            case 1:
                // 向后，绕y轴逆时针旋转
                rotationSpeed = new Vector(0, rotateSpeed, 0)
                break;
            case 2:
                // 向左，绕X轴顺时针旋转
                rotationSpeed = new Vector(-rotateSpeed, 0, 0)
                break;
            case 3:
                // 向右，绕X轴逆时针旋转
                rotationSpeed = new Vector(rotateSpeed, 0, 0)
                break;
            case 4:
                // 顺时针，绕Z轴顺时针旋转
                rotationSpeed = new Vector(0, 0, rotateSpeed)
                break;
            case 5:
                // 逆时针，绕Z轴逆时针旋转
                rotationSpeed = new Vector(0, 0, -rotateSpeed)
                break;
            case 6:
                // 左前，绕y轴顺时针旋转，绕X轴顺时针旋转
                rotationSpeed = new Vector(-rotateSpeed, -rotateSpeed, 0)
                break;
            case 7:
                // 右前，绕y轴顺时针旋转，绕X轴逆时针旋转
                rotationSpeed = new Vector(rotateSpeed, -rotateSpeed, 0)
                break;
            case 8:
                // 左后，绕y轴逆时针旋转，绕X轴顺时针旋转
                rotationSpeed = new Vector(-rotateSpeed, rotateSpeed, 0)
                break;
            case 9:
                // 右后，绕y轴逆时针旋转，绕X轴逆时针旋转
                rotationSpeed = new Vector(rotateSpeed, rotateSpeed, 0)
                break;
        }
        return rotationSpeed;

    }
}