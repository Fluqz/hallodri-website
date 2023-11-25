

/** Math Utilities */
export class M {

    /** Calculates a angle from two points where the third point is { x=radius, y=0 }. Center { cx, cy } and edge { ex, ey } */
    static getAngle(cx:number, cy:number, ex:number, ey:number) {

        let theta = Math.atan2(ey - cy, ex - cx) // range (-PI, PI]
        // theta *= 180 / Math.PI // rads to degs, range (-180, 180]
        
        if (theta < 0) theta = (Math.PI*2) + theta // range [0, 360)
        
        return theta % (Math.PI * 2)
    }

    /** Map a value from one range (min, max) to another. 
     * @param iMin Input min value
     * @param iMin Input max value
     * @param iMin Output min value
     * @param iMin Output max value
     * @param v Value to map
    */
    static map(iMin:number, iMax:number, oMin:number, oMax:number, v:number) {

	    return oMin + (oMax - oMin) * ((v-iMin) / (iMax-iMin))
    }

    /** Clambs a value to a min and max. Meaning it wont exeed the min and max values */
    static clamb(min:number, max:number, v:number) {

        if(v > max) v = max
        else if(v < min) v = min
        return v
    }


    // static getDirectionVector = (() => {

    //     let v = {}
        
    //     return (v1, v2) => {

    //         v.x = v2.x - v1.x
    //         v.y = v2.y - v1.y

    //         return v
    //     }
    // })()

    // static getNormalizedVector = (() => {

    //     let n = {}
        
    //     return (v) => {

    //         if(v.x == 0 && v.y == 0) return v

    //         // u = (x/(x^2 + y^2)^(1/2), y/(x^2 + y^2)^(1/2))
    //         n.x = v.x / Math.pow((Math.pow(v.x, 2) + Math.pow(v.y, 2)), (1/2))
    //         n.y = v.y / Math.pow((Math.pow(v.x, 2) + Math.pow(v.y, 2)), (1/2))
    //         return n
    //     }
    // })()

    // static getDistanceVector = ((v) => {

    //     let d

    //     return (v1, v2) => {

    //         return Math.sqrt(Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2))
    //     }
    // })()
}

