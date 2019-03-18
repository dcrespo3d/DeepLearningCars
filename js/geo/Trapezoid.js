class Trapezoid
{
    constructor(segL = new Segment2(), segR = new Segment2()) {
        this.segL = segL;
        this.segR = segR;

        this.afxL1 = new AfXform();
        this.afxL2 = new AfXform();
        this.afxR1 = new AfXform();
        this.afxR2 = new AfXform();

        this.aabb = new AABB();
    }

    setupTransform() {
        this.afxL1.P.setFromVec2(this.segL.p1);
        this.afxL1.U = this.segL.p2.sub(this.segL.p1);
        this.afxL1.V = this.segR.p1.sub(this.segL.p1);
        this.afxL1.setupTransform();

        this.afxL2.P.setFromVec2(this.segL.p2);
        this.afxL2.U = this.segL.p1.sub(this.segL.p2);
        this.afxL2.V = this.segR.p2.sub(this.segL.p2);
        this.afxL2.setupTransform();

        this.afxR1.P.setFromVec2(this.segR.p1);
        this.afxR1.U = this.segR.p2.sub(this.segR.p1);
        this.afxR1.V = this.segL.p1.sub(this.segR.p1);
        this.afxR1.setupTransform();

        this.afxR2.P.setFromVec2(this.segR.p2);
        this.afxR2.U = this.segR.p1.sub(this.segR.p2);
        this.afxR2.V = this.segL.p2.sub(this.segR.p2);
        this.afxR2.setupTransform();

        this.aabb.defFirstPoint(this.segL.p1);
        this.aabb.defNextPoint (this.segL.p2);
        this.aabb.defNextPoint (this.segR.p1);
        this.aabb.defNextPoint (this.segR.p2);
    }

    map(point) {
        let mpL1 = this.afxL1.fwd(point);
        let mpL2 = this.afxL2.fwd(point);
        let mpR1 = this.afxR1.fwd(point);
        let mpR2 = this.afxR2.fwd(point);

        let nearL1 = (mpL1.x + mpL1.y) <= 1;
        let nearL2 = (mpL2.x + mpL2.y) <= 1;
        let nearR1 = (mpR1.x + mpR1.y) <= 1;
        let nearR2 = (mpR2.x + mpR2.y) <= 1;

        mpL2.x = 1 - mpL2.x;
        mpR1.y = 1 - mpR1.y;
        mpR2.x = 1 - mpR2.x;
        mpR2.y = 1 - mpR2.y;

        let mpoints = [];
        if (nearL1) mpoints.push(mpL1);
        if (nearL2) mpoints.push(mpL2);
        if (nearR1) mpoints.push(mpR1);
        if (nearR2) mpoints.push(mpR2);

        let count = mpoints.length;
        if (count == 0) return new Vec2(NaN, NaN);

        let res = new Vec2(0,0);
        for (let i = 0; i < count; i++)
            res.addInPlace(mpoints[i]);

        res.mulScalarInPlace(1.0 / count);
        return res;
    }

    unmap(point) {
        let upoints = [];

        let mpL1 = point.copy();
        let mpL2 = point.copy();
        let mpR1 = point.copy();
        let mpR2 = point.copy();

        mpL2.x = 1 - mpL2.x;
        mpR1.y = 1 - mpR1.y;
        mpR2.x = 1 - mpR2.x;
        mpR2.y = 1 - mpR2.y;
        
        let nearL1 = (mpL1.x + mpL1.y) < 1;
        let nearL2 = (mpL2.x + mpL2.y) < 1;
        let nearR1 = (mpR1.x + mpR1.y) <= 1;
        let nearR2 = (mpR2.x + mpR2.y) <= 1;

        if (nearL1) { upoints.push(this.afxL1.inv(mpL1)); }
        if (nearL2) { upoints.push(this.afxL2.inv(mpL2)); }
        if (nearR1) { upoints.push(this.afxR1.inv(mpR1)); }
        if (nearR2) { upoints.push(this.afxR2.inv(mpR2)); }

        let count = upoints.length;
        if (count == 0) return new Vec2(NaN, NaN);

        let res = new Vec2(0,0);
        for (let i = 0; i < count; i++)
            res.addInPlace(upoints[i]);

        res.mulScalarInPlace(1.0 / count);
        return res;
    }

    isPointInsideAABB(point) {
        return this.aabb.isPointInside(point);
    }

    isPointInside(point) {
        if (!this.aabb.isPointInside(point))
            return false;
        let mpoint = this.map(point);
        if (mpoint.x < 0) return false;
        if (mpoint.x > 1) return false;
        if (mpoint.y < 0) return false;
        if (mpoint.y > 1) return false;
        return true;
    }

    multimap(point) {
        let mpoints = [];

        let mpL1 = this.afxL1.fwd(point);
        let mpL2 = this.afxL2.fwd(point);
        let mpR1 = this.afxR1.fwd(point);
        let mpR2 = this.afxR2.fwd(point);
/*
        let nearL1 = true;
        let nearL2 = true;
        let nearR1 = true;
        let nearR2 = true;
*/
        let nearL1 = (mpL1.x + mpL1.y) <= 1;
        let nearL2 = (mpL2.x + mpL2.y) <= 1;
        let nearR1 = (mpR1.x + mpR1.y) <= 1;
        let nearR2 = (mpR2.x + mpR2.y) <= 1;

        mpL2.x = 1 - mpL2.x;
        mpR1.y = 1 - mpR1.y;
        mpR2.x = 1 - mpR2.x;
        mpR2.y = 1 - mpR2.y;

        if (nearL1) mpoints.push(mpL1);
        if (nearL2) mpoints.push(mpL2);
        if (nearR1) mpoints.push(mpR1);
        if (nearR2) mpoints.push(mpR2);

        return mpoints;
    }

    multiunmap(point) {
        let upoints = [];

        let mpL1 = point.copy();
        let mpL2 = point.copy();
        let mpR1 = point.copy();
        let mpR2 = point.copy();

        mpL2.x = 1 - mpL2.x;
        mpR1.y = 1 - mpR1.y;
        mpR2.x = 1 - mpR2.x;
        mpR2.y = 1 - mpR2.y;
/*
        let nearL1 = true;
        let nearL2 = true;
        let nearR1 = true;
        let nearR2 = true;
*/        
        
        let nearL1 = (mpL1.x + mpL1.y) <= 1;
        let nearL2 = (mpL2.x + mpL2.y) <= 1;
        let nearR1 = (mpR1.x + mpR1.y) <= 1;
        let nearR2 = (mpR2.x + mpR2.y) <= 1;


        if (nearL1) { upoints.push(this.afxL1.inv(mpL1)); }
        if (nearL2) { upoints.push(this.afxL2.inv(mpL2)); }
        if (nearR1) { upoints.push(this.afxR1.inv(mpR1)); }
        if (nearR2) { upoints.push(this.afxR2.inv(mpR2)); }

        return upoints;
    }
}

Trapezoid.newFrom2Segments = function(seg1, seg2) {
    let t = new Trapezoid(seg1, seg2);
    t.setupTransform();
    return t;
}