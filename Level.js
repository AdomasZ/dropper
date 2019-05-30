class Level {
    constructor(p1, p2, power){
        this.p1 = p1;
        this.p2 = p2;

        this.power = power;

        this.move = () => {
            this.p1.y--;
            this.p2.y--;
            this.power.y--;
        };
        this.destroy = () => {
            this.p1.destroy();
            this.p2.destroy();
            this.power.destroy();
        };
    }
}