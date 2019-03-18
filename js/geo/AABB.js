class AABB
{
    constructor()
    {
        this.xmin = 0;
        this.xmax = 0;
        this.ymin = 0;
        this.ymax = 0;
    }

    defFirstPoint(p)
    {
        this.xmin = p.x;
        this.xmax = p.x;
        this.ymin = p.y;
        this.ymax = p.y;
    }

    defNextPoint(p)
    {
        if (this.xmin > p.x) this.xmin = p.x;
        if (this.xmax < p.x) this.xmax = p.x;
        if (this.ymin > p.y) this.ymin = p.y;
        if (this.ymax < p.y) this.ymax = p.y;
    }

    defFirstSegment(seg)
    {
        this.defFirstPoint(seg.p1);
        this.defNextPoint (seg.p2);
    }

    isPointInside(p)
    {
        if (this.xmin > p.x) return false;
        if (this.xmax < p.x) return false;
        if (this.ymin > p.y) return false;
        if (this.ymax < p.y) return false;
        return true;
    }

    intersectsOtherAABB(other) {
        if (other.xmin > this.xmax) return false;
        if (other.xmax < this.xmin) return false;
        if (other.ymin > this.ymax) return false;
        if (other.ymax < this.ymin) return false;
        return true;
    }
}

AABB.newFromSegment = function(seg) {
    let aabb = new AABB();
    aabb.defFirstSegment(seg);
    return aabb;
}