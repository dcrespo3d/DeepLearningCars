class Segment2
{
/*    
    constructor()
    {
        this.p1 = new Vec2();
        this.p2 = new Vec2();
    }
*/
    constructor(p1 = new Vec2(), p2 = new Vec2())
    {
        this.p1 = p1;
        this.p2 = p2;
    }
    
    setFrom2Vec2(vec1, vec2)
    {
        this.p1.setFromVec2(vec1);
        this.p2.setFromVec2(vec2);
    }

    setFrom4Values(val1, val2, val3, val4)
    {
        this.p1.setFrom2Values(val1, val2);
        this.p2.setFrom2Values(val3, val4);
    }

    getIntersectionWithSegment2(seg) {
        let res = getLineIntersection(
            this.p1.x, this.p1.y,
            this.p2.x, this.p2.y,
            seg.p1.x, seg.p1.y,
            seg.p2.x, seg.p2.y);
        if (res == null)
            return null;
        return new Vec2(res[0], res[1]);

    }

    getMirrorPoint(point) {
        let dx = this.p2.x - this.p1.x;
        let dy = this.p2.y - this.p1.y;
        let a = dy;
        let b = -dx;
        let c = this.p1.y * dx - this.p1.x * dy;
        let aux = -2 * (a * point.x + b * point.y + c) / (a * a + b * b);
        return new Vec2(aux * a + point.x, aux * b + point.y);
    }
}

Segment2.newFrom4Values = function(v1, v2, v3, v4) {
    return new Segment2(new Vec2(v1,v2), new Vec2(v3,v4));
}

/*
https://stackoverflow.com/a/1968345
// Returns 1 if the lines intersect, otherwise 0. In addition, if the lines 
// intersect the intersection point may be stored in the floats i_x and i_y.
char get_line_intersection(float p0_x, float p0_y, float p1_x, float p1_y, 
    float p2_x, float p2_y, float p3_x, float p3_y, float *i_x, float *i_y)
{
    float s1_x, s1_y, s2_x, s2_y;
    s1_x = p1_x - p0_x;     s1_y = p1_y - p0_y;
    s2_x = p3_x - p2_x;     s2_y = p3_y - p2_y;

    float s, t;
    s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
    t = ( s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1)
    {
        // Collision detected
        if (i_x != NULL)
            *i_x = p0_x + (t * s1_x);
        if (i_y != NULL)
            *i_y = p0_y + (t * s1_y);
        return 1;
    }

    return 0; // No collision
}
*/

function getLineIntersection(p0_x, p0_y, p1_x, p1_y, p2_x, p2_y, p3_x, p3_y)
{
    var s1_x, s1_y, s2_x, s2_y;
    s1_x = p1_x - p0_x;
    s1_y = p1_y - p0_y;
    s2_x = p3_x - p2_x;
    s2_y = p3_y - p2_y;
    var s, t;
    s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
    t = ( s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);
    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) { // Collision detected
        var intX = p0_x + (t * s1_x);
        var intY = p0_y + (t * s1_y);
        return [intX, intY];
    }
    return null; // No collision
}