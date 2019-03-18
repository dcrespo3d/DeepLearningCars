class Car
{
    constructor()
    {
        this.pos = new Vec2(0,0);
        this.dir = new Vec2(1,0);
        this.angle = 0;
        this.dir.setFromAngle(this.angle);

        this.length = 4.0;
        this.width = 2.0;

        this.engine01 = 0.0;
        this.steer01 = 0.0;

        this.maxSpeed = 60.0;
        this.acc = 50.0;
        this.speed = 0.0;

        this.curvRadius = 8.0;

        this.crashed = false;
        this.outside = false;
        this.finished = false;

        this.extraRays = 2; // 0 -> 1, 1 -> 3, 2-> 5...
        this.rayAngle = 22.5 * Math.PI / 180;
        this.rayLength = 30.0;

        this.probes = new Array(1 + 2 * this.extraRays);
        this.probes01 = new Array(1 + 2 * this.extraRays);
        for (let i = 0; i < this.probes.length; i++) {
            this.probes[i] = new Vec2();
            this.probes01[i] = 0;
        }

        this.comp01 = 0.0;  // completion in per-one-age
    }

    setInitialPosition(pos)
    {
        this.pos.setFromVec2(pos);
    }

    setInitialDirection(dir)
    {
        this.dir.setFromVec2(dir);
        this.dir.normalizeInPlace();
        this.angle = this.dir.angle();
    }

    getEngine01()
    {
        return this.engine01;
    }

    setEngine01(e01)
    {
        if (e01 < -1) e01 = -1;
        if (e01 >  1) e01 =  1;
        this.engine01 = e01;
    }

    getSteer01()
    {

    }

    setSteer01(s01)
    {
        if (s01 < -1) s01 = -1;
        if (s01 >  1) s01 =  1;
        this.steer01 = s01;
    }

    updateWithDeltaTime(deltaTime)
    {
        if (this.crashed)
            return;

        let targetSpeed = this.engine01 * this.maxSpeed;
        if (this.speed == targetSpeed) {}
        else if (this.speed < targetSpeed) {
            this.speed += this.acc * deltaTime;
            if (this.speed > targetSpeed)
                this.speed = targetSpeed;
        }
        else if (this.speed > targetSpeed) {
            this.speed -= this.acc * deltaTime;
            if (this.speed < targetSpeed)
                this.speed = targetSpeed;
        }

        //console.log(this.speed);

        let stepLen = this.speed * deltaTime;

        let turnAngle = this.steer01 * stepLen / this.curvRadius;

        this.angle += turnAngle;

        this.dir.setFromAngle(this.angle);

        let stepDir = this.dir.mulScalar(stepLen);

        this.pos.addInPlace(stepDir);
    }

    getCornersAsArray()
    {
        let ux = new Vec2(0,0);
        let uy = new Vec2(0,0);
        ux.setFromPolar(0.5 * this.length, this.angle);
        uy.setFromPolar(0.5 * this.width, this.angle + 0.5 * Math.PI);
        let arr = new Array(8);
        arr[0] = this.pos.x + ux.x + uy.x;
        arr[1] = this.pos.y + ux.y + uy.y;
        arr[2] = this.pos.x - ux.x + uy.x;
        arr[3] = this.pos.y - ux.y + uy.y;
        arr[4] = this.pos.x - ux.x - uy.x;
        arr[5] = this.pos.y - ux.y - uy.y;
        arr[6] = this.pos.x + ux.x - uy.x;
        arr[7] = this.pos.y + ux.y - uy.y;
        return arr;
    }

    getLimitSegments()
    {
        let arr = this.getCornersAsArray();
        let seg1 = new Segment2();
        let seg2 = new Segment2();
        let seg3 = new Segment2();
        let seg4 = new Segment2();
        seg1.setFrom4Values(arr[0], arr[1], arr[2], arr[3]);
        seg2.setFrom4Values(arr[2], arr[3], arr[4], arr[5]);
        seg3.setFrom4Values(arr[4], arr[5], arr[6], arr[7]);
        seg4.setFrom4Values(arr[6], arr[7], arr[0], arr[1]);
        return [seg1, seg2, seg3, seg4];
    }

    getRaySegments() {
        let rays = [];
        let ray = new Vec2(0,0);
        ray.setFromPolar(this.rayLength, this.angle);
        let seg = new Segment2();
        seg.p1.setFromVec2(this.pos);
        seg.p2 = this.pos.add(ray);
        rays.push(seg);
        for (let i = 1; i <= this.extraRays; i++) {
            ray.setFromPolar(this.rayLength, this.angle - i*this.rayAngle);
            seg = new Segment2();
            seg.p1.setFromVec2(this.pos);
            seg.p2 = this.pos.add(ray);
            rays.push(seg);
            ray.setFromPolar(this.rayLength, this.angle + i*this.rayAngle);
            seg = new Segment2();
            seg.p1.setFromVec2(this.pos);
            seg.p2 = this.pos.add(ray);
            rays.push(seg);
        }
        return rays;
    }

    setCrashed()
    {
        this.crashed = true;
    }

    calculateCarTrackCollisions(trackmgr) {
        let carSegList = this.getLimitSegments();

        for (let i = 0; i < carSegList.length; i++) {
            let isecs = trackmgr.getIntersectionsWithSegment(carSegList[i]);
            if (isecs.length > 0) {
                this.setCrashed();
                    break;
            }
        }    
    }

    calculateCarRaysTrackCollisions(trackmgr) {
        let rays = this.getRaySegments();

        for (let i = 0; i < rays.length; i++) {
            let ray = rays[i];
            let isec = trackmgr.getNearestIntersectionWithSegment(ray);
            if (isec != null)
                this.probes[i].setFromVec2(isec);
            else
                this.probes[i].setFromVec2(ray.p2);

            this.probes01[i] = ray.p1.distanceTo(this.probes[i]) / this.rayLength;
        }
    }

    calculateCarCompletion(trackmgr) {
        let comp01 = trackmgr.getCompletionFromPosition(this.pos);
        if (comp01 == null) {
            this.outside = true;
            if (this.comp01 > 0.5)
                this.finished = true;
            else
                this.crashed = true;
        }
        else
            this.comp01 = comp01;
    }
    
}