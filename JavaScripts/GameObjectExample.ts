@Component
export default class GameObjectExample extends Script {
    protected onStart(): void {
        let obj: GameObject = this.gameObject;
        console.log(`obj.name = ${obj.name}`);
        console.log(`obj.tag = ${obj.tag}`);
        console.log(`obj.worldTransform = ${obj.worldTransform}`);
        console.log(`obj.localTransform = ${obj.localTransform}`);
        let children = obj.getChildren();
        children.forEach(child => {
            console.log(`obj child = ${child.name}`);
        });
        let path = "正方体/圆柱"
        let cylinderObj = GameObject.getGameObjectByPath(path);
        console.log(`getGameObjectByPath = ${cylinderObj ? cylinderObj.name : "undefined"}`);
        path = "圆柱/圆台"
        cylinderObj = obj.getChildByPath(path);
        console.log(`getChildByPath = ${cylinderObj ? cylinderObj.name : "undefined"}`);
        // cylinderObj.onDestroyDelegate.add(()=>{
        //     console.log(`destroyDelegate 1 = ${cylinderObj ? cylinderObj.name : "undefined"}`);
        // });
        // cylinderObj.onDestroyDelegate.add(()=>{
        //     console.log(`destroyDelegate 2 = ${cylinderObj ? cylinderObj.name : "undefined"}`);
        // });
        cylinderObj.destroy();
    }
}