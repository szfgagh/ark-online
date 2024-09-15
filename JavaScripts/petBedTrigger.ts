import petBdeIntUIScript from "./petBdeIntUIScript";


@Component
export default class petBedTrigger extends Script {

    /** 宠物放入床按钮处理，监听 petBed 标签的触发器的进入和离开事件 宠物放入床 */
    protected onStart(): void {
        let trigger=this.gameObject as Trigger;
        

        let emp = this.gameObject.getChildByName("空锚点")
        //console.log("emp"+emp.name);
        trigger.onEnter.add((obj)=>{
            if (trigger.tag=="petBed"){
                if (SystemUtil.isClient()){
                    if (obj==Player.localPlayer.character){
                        
                        // let userUI=new petBdeIntUIScript().rootCanvas
                        setTimeout(() => {
                             
                        }, 1000);
                        //TimeUtil.delaySecond(0.3);
                        UIService.show(petBdeIntUIScript);  
                        //发送空锚点对象
                        Event.dispatchToLocal("宠物放入床",this.gameObject.getChildByName("空锚点") );//   as Interactor
                    }
                   
                }        
               
            }
            
        });
        trigger.onLeave.add((obj)=>{
            if (trigger.tag=="petBed"){
                if (SystemUtil.isClient()){
                    if(obj==Player.localPlayer.character){
                       
                        UIService.hide(petBdeIntUIScript);
                    }
                }
                
            }
        })
    }
}
