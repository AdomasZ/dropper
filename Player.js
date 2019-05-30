class Player {
    constructor(object){
        this.object = object;
        this.bullets = [];
        this.object.displayHeight = 50;
        this.object.displayWidth = 50;
        // Cuts the body into a circle
        this.object.body.setCircle(130,5,10);

        this.object.setCollideWorldBounds(true);
        this.pickup = (power) => {
            if(power.texture.key == 'bullet'){
                this.bullets.push(power);
            }
            power.destroy();
        };
        this.shoot = (stage) => {
            if(this.bullets.length > 0){
                var bullet = stage.physics.add.sprite(this.object.x, this.object.y, 'bullet');
                stage.shapeBulletSprite(bullet);
                stage.flyingBullets.add(bullet);
                this.bullets.pop();
            }
        }
    };

}