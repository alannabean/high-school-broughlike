class Monster{
    constructor(tile, sprite, hp){
        this.move(tile);
        this.sprite = sprite;
        this.hp = hp;
        this.teleportCounter = 2;
        this.offsetX = 0;
        this.offsetY = 0;
    }

    update(){
        this.teleportCounter--;
        if (this.teleportCounter > 0){
            return;
        }
        this.doStuff();
    }

    doStuff(){
        let neighbors = this.tile.getAdjacentPassableNeighbors();
        neighbors = neighbors.filter(t => !t.monster || t.monster.isPlayer);
        if (neighbors.length){
            neighbors.sort((a,b) => a.dist(player.tile) - b.dist(player.tile));
            let newTile = neighbors[0];
            this.tryMove(newTile.x - this.tile.x, newTile.y - this.tile.y);
        }
    }   

    getDisplayX(){
        return this.tile.x + this.offsetX;
    }

    getDisplayY(){
        return this.tile.y + this.offsetY;
    }

    draw(){
        if(this.teleportCounter > 0){
            drawSprite(14,this.getDisplayX(),this.getDisplayY());
        }else{
            drawSprite(this.sprite,this.getDisplayX(),this.getDisplayY());
            this.drawHp();
        }
        this.offsetX -= Math.sign(this.offsetX)*(1/8);
        this.offsetY -= Math.sign(this.offsetY)*(1/8);
    }

    drawHp(){
        for(let i = 0; i<this.hp; i++){
            drawSprite(
                9,
                this.getDisplayX() + (i%3)*(5/16)-(5/16),
                this.getDisplayY() - (Math.floor(i/3)*(5/16))+(11/16)
            );
        }
    }


    tryMove(dx, dy){
    let newTile = this.tile.getNeighbor(dx,dy);
    if(newTile.passable){
        if(!newTile.monster){
            this.move(newTile);
        }else{
            if(this.isPlayer != newTile.monster.isPlayer){
                newTile.monster.hit(1);

                shakeAmount = 3;

                this.offsetX = (newTile.x - this.tile.x)/4;
                this.offsetY = (newTile.y - this.tile.y)/4;
             }
        }
        return true;
        }
    }

    hit(damage){
        this.hp -= damage;
        if(this.hp <= 0){
            this.die();
        }
    }

    die(){
        this.dead = true;
        this.tile.monster = null;
        this.sprite = 1;
    }

    move(tile){
        if(this.tile){
            this.tile.monster = null;
            this.offsetX = this.tile.x - tile.x;
            this.offsetY = this.tile.y - tile.y;

        }
        this.tile = tile;
        tile.monster = this;
        tile.stepOn(this);
    }   
}

class Player extends Monster{
    constructor(tile){
        super(tile, 0, 3);
        this.isPlayer = true;
        this.teleportCounter = 0;
    }
    tryMove(dx, dy){
        if(super.tryMove(dx, dy)){
            tick();
        }
    }
}

class Bully extends Monster{
    constructor(tile){
        super(tile, 4, 2);
        //basic damage reduction
    }
}

class Friend extends Monster{
    constructor(tile){
        super(tile, 5, 2);
        //healing powers (could also have a 50/50 chance of reducing health - frenemy class?)
    }
}

class Crush extends Monster{
    constructor(tile){
        super(tile, 6, 2);
    }

    doStuff(){
        let neighbors = this.tile.getAdjacentPassableNeighbors();
        if(neighbors.length){
            this.tryMove(neighbors[0].x - this.tile.x, neighbors[0].y - this.tile.y);
        }
    }
}

class Jock extends Monster{
    constructor(tile){
        super(tile, 7, 2);
        //stink rays
    }
}

class Teacher extends Monster{
    constructor(tile){
        super(tile, 8, 3);
        //random letter grades fly at you, doing a random amount of damage
    }
}