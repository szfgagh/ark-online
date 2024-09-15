
/** 
petBedUI的UI脚本
 */

import petBedUI_Generate from "./ui-generate/petBedUI_generate";

export default class petBdeIntUIScript extends petBedUI_Generate {


	private anchorPos: Vector;
	// private petPos: Vector;
	private anchor: GameObject;
	//表示当前对象的交互功能被关闭或者开启,默认为假。
	private isInteractive: Boolean = false;

	protected onStart(): void {
		let petObject = GameObject.findGameObjectById("2EAFFFF9") as Character;

		let petPos =petObject.worldTransform.position;
		let petAnimation = petObject.loadAnimation("181303");

		Event.addLocalListener("宠物放入床", (param: any) => {
			// console.info(param.name)
			//接收空锚点对象
			this.anchor = param;
			this.anchor.asyncReady();
			// 设置物体的位置信息
		// if (this.anchor) {
		// 	this.anchorPos = this.anchor.worldTransform.position;
		// 	console.log("anchor anchorPos " + this.anchorPos);
		// } else {
		// 	console.log("anchor is undefined");
		// }
		});
		//let anchorPos = this.anchor.worldTransform.position;
		this.putPet.onClicked.add(() => {
			//如果isInteractive为真，这段代码会执行离开交互模式的操作，然后从InterActiveBtn的子元素中获取第一个TextBlock对象，并将其文本内容改为"放入宠物"。
			if (this.isInteractive) {
				//this.thisInteractor.leave()
				const txtUI = this.putPet.getChildAt(0) as TextBlock;
				txtUI.text = "放入宠物"
				// petAnimal.play();
				petObject.worldTransform.position = petPos;


				//let petAnimation = petObject.loadAnimation("181303");
				petAnimation.loop = 0;
				petAnimation.stop();
				
			} else {
				//如果isInteractive为假，这段代码会执行进入交互模式的操作，然后从InterActiveBtn的子元素中获取第一个TextBlock对象，并将其文本内容改为"拿起宠物"。
				if (!this.isInteractive) {

					// 空锚点对象的坐标赋值给宠物对象坐标
					petObject.worldTransform.position = this.anchorPos;

					petAnimation.loop = 0;
					petAnimation.play();
					const txtUI = this.putPet.getChildAt(0) as TextBlock;
					txtUI.text = "拿起宠物"
				} else {
					console.error("thisInteractor is Null")
				}

			}
			//点击后，isInteractive的值会反转。
			this.isInteractive = !this.isInteractive;
		});
	}


}
