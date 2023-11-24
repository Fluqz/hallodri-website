

export class Vec2 {

    x: number
    y: number

    constructor(x:number = 0, y:number = 0) {

        this.x = x
        this.y = y
    }

    public add(v: Vec2) : Vec2 {

        this.x += v.x
        this.y += v.y

        return this
    }

    public sub(v: Vec2) : Vec2 {

        this.x -= v.x
        this.y -= v.y

        return this
    }

    public multiply(v: Vec2) : Vec2 {

        this.x *= v.x
        this.y *= v.y

        return this
    }

    public multiplyScalar(s: number) : Vec2 {

        this.x *= s
        this.y *= s

        return this
    }

    public divide(v: Vec2) : Vec2 {

        this.x /= v.x
        this.y /= v.y

        return this
    }

    public divideScalar(s: number) : Vec2 {

        this.x /= s
        this.y /= s

        return this
    }

    public set(x:number, y:number) : Vec2 {

        this.x = x
        this.y = y

        return this
    }

    public copy(v: Vec2) : Vec2 {

        this.x = v.x
        this.y = v.y

        return this
    }

    public clone() : Vec2 { return new Vec2(this.x, this.y) }

    public getDirectionVector = (v1: Vec2, v2: Vec2) : Vec2 => {

        const v = new Vec2()
        
        v.x = v2.x - v1.x
        v.y = v2.y - v1.y

        return v
    }

    public normalizeVector = (v: Vec2) : Vec2 => {

        if(v.x == 0 && v.y == 0) return v

        let n = new Vec2()

        // u = (x/(x^2 + y^2)^(1/2), y/(x^2 + y^2)^(1/2))
        n.x = v.x / Math.pow((Math.pow(v.x, 2) + Math.pow(v.y, 2)), (1/2))
        n.y = v.y / Math.pow((Math.pow(v.x, 2) + Math.pow(v.y, 2)), (1/2))
        
        return v.copy(n)
    }

    public normalize = () : Vec2 => {

        return this.normalizeVector(this)
    }

    public getDistance = (v1: Vec2, v2: Vec2) : number => {

        return Math.sqrt(Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2))
    }


    public distanceTo = (v: Vec2) : number => {

        return this.getDistance(this, v)
    }

    public angleTo(v: Vec2) : number {

        let theta = Math.atan2(v.y - this.y, v.x - this.x) // range (-PI, PI]
        
        if (theta < 0) theta = (Math.PI*2) + theta // range [0, 360)
        
        return theta % (Math.PI * 2)
    }
}