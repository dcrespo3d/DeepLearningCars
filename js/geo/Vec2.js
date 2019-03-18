class Vec2
{
    constructor(x=0, y=0) {
        this.x = x;
        this.y = y;
    }

    copy() {
        return new Vec2(this.x, this.y);
    }

    setFromVec2(vec) {
        this.x = vec.x;
        this.y = vec.y;
    }

    setFrom2Values(val1, val2) {
        this.x = val1;
        this.y = val2;
    }

    lengthSquared() {
        return this.x*this.x + this.y*this.y;
    }

    length() {
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }

    normalize() {
        let len = Math.sqrt(this.x*this.x + this.y*this.y)
        if (len != 0)
            return new Vec2(this.x / len, this.y / len);
        else
            return new Vec2(NaN, NaN);
    }

    normalizeInPlace() {
        let len = Math.sqrt(this.x*this.x + this.y*this.y)
        if (len != 0) {
            this.x /= len;
            this.y /= len;
        }
        else
            this.x = this.y = NaN;
    }

    add(vec) {
        return new Vec2(this.x + vec.x, this.y + vec.y);
    }

    addInPlace(vec) {
        this.x += vec.x;
        this.y += vec.y;
    }

    sub(vec) {
        return new Vec2(this.x - vec.x, this.y - vec.y);
    }

    subInPlace(vec) {
        this.x -= vec.x;
        this.y -= vec.y;
    }

    mulScalar(scalar) {
        return new Vec2(this.x * scalar, this.y * scalar);
    }

    mulScalarInPlace(scalar) {
        this.x *= scalar;
        this.y *= scalar;
    }

    distanceTo(vec) {
        let dx = vec.x - this.x;
        let dy = vec.y - this.y;
        return Math.sqrt(dx*dx + dy*dy);
    }

    angle() {
        return Math.atan2(this.y, this.x);
    }

    setFromAngle(angle) {
        this.x = Math.cos(angle);
        this.y = Math.sin(angle);
    }

    setFromPolar(radius, angle) {
        this.x = radius * Math.cos(angle);
        this.y = radius * Math.sin(angle);
    }

    // canvas helpers

    moveTo(ctx) {
        ctx.moveTo(this.x, this.y);
    }

    lineTo(ctx) {
        ctx.lineTo(this.x, this.y);
    }


}