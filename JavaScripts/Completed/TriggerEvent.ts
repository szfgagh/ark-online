// import TriggerUI from "./TriggerUI";
// @Component
// export default class TriggerEvent extends Script {

//     /** 当脚本被实例后，会在第一帧更新前调用此函数 */
//     protected onStart(): void {
//         let trigger=this.gameObject as Trigger;
        
//         trigger.onEnter.add((obj)=>{
//             if (trigger.tag=="Sit"){
//                 if (SystemUtil.isClient()){
//                     if (obj==Player.localPlayer.character){
//                         UIService.show(TriggerUI)
//                         Event.dispatchToLocal("Sit",this.gameObject.parent);
//                     }
                   
//                 }        
               
//             }
            
//         });
//         trigger.onLeave.add((obj)=>{
//             if (trigger.tag=="Sit"){
//                 if (SystemUtil.isClient()){
//                     if(obj==Player.localPlayer.character){
//                         UIService.destroyUI(TriggerUI);
//                     }
//                 }
                
//             }
//         })
//     }

//     /**
//      * 周期函数 每帧执行
//      * 此函数执行需要将this.useUpdate赋值为true
//      * @param dt 当前帧与上一帧的延迟 / 秒
//      */
//     protected onUpdate(dt: number): void {

//     }

//     /** 脚本被销毁时最后一帧执行完调用此函数 */
//     protected onDestroy(): void {

//     }
// }