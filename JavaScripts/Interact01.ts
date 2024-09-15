

@Component
export default class Interact01 extends Script {
    private parent: GameObject; 

    parentID:string =null;

    ch1:Interactor;
    
    //TargetID:any;
    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected async onStart(): Promise<void> {
        if (SystemUtil.isClient()) {

        //parent :此对象父对象
        let parent = this.gameObject.parent;



        //parentID :此对象父对象ID
        let parentID =  parent.gameObjectId;
        // let yDistance:Vector ;

        //let child1 :GameObject;

        let foundItem:GameObject ; 
 
       let character1 = Player.localPlayer.character;

 

  
        let ch1 = parent as Interactor;


        // this.useUpdate = true;
      

        
        // 创建一个事件监听器
       Event.addLocalListener("chairSit",()=>{

        let playerPos  = character1.localTransform.position;
        //console.log("当前角色位置：" + playerPos);

        let goArray = QueryUtil.sphereOverlap(playerPos, 70, false,  [], false, character1);
        for (const item of goArray) {
        // item: 检测到的对象;   foundItem: 被选取的触发器信号对象
            
            if (item.name == "触发器信号") {  
              
                foundItem = item;
               // console.log("当前foundItem ：" + foundItem.name );
                break;
            }
            
            
        }
        //选取的触发器信号对象的父对象
    let selectitemID = foundItem.parent.gameObjectId;   

        // 判定('字符串相等')
        if (parentID ==  selectitemID ) {
            // console.log('字符串相等');


            
        ch1.enter(character1);//,HumanoidSlotType.Buttocks,"280682"

            
        //console.log("坐下的本地交互物ID： "+parentID)
                 

 

            //setTimeout函数被用来延迟2秒后执行一个回调函数，回调函数中调用了ch1.leave方法，将角色从椅子上移开。
            // setTimeout(() => {
                
            //     ch1 .leave( );
             
            // }, 2000);
        //}
        }
           });

           Event.addLocalListener("LeaveChair",( )=>{
            

            ch1 .leave(  );
            
            
           });
           
    }

  
    


}
        

    }

    /** 脚本被销毁时最后一帧执行完调用此函数 */

