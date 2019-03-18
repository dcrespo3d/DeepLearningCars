class AfXform   // Affine transform
{
    constructor() {
        this.P = new Vec2(0,0);
        this.U = new Vec2(1,0);
        this.V = new Vec2(0,1);
    }

    setupTransform() {
        this.corrX = 1.0 / this.fwd_nocorr(this.P.add(this.U)).x;
        this.corrY = 1.0 / this.fwd_nocorr(this.P.add(this.V)).y;
    }

    fwd_nocorr(A)
    {
        let B = new Vec2(0,0);
        let invden = 1.0 / (this.V.x * this.U.y - this.U.x - this.V.y);
        B.x = this.V.x * (A.y - this.P.y) - this.V.y * (A.x - this.P.x);
        B.x *= invden;
        B.y = this.U.x * (A.y - this.P.y) - this.U.y * (A.x - this.P.x);
        B.y *= -invden;
        return B;
    }

    fwd(A)
    {
        let B = this.fwd_nocorr(A);
        B.x *= this.corrX;
        B.y *= this.corrY;
        return B;
    }

    inv(B)
    {
        let A = new Vec2(0,0);
        A.x = this.P.x + this.U.x * B.x + this.V.x * B.y;
        A.y = this.P.y + this.U.y * B.x + this.V.y * B.y;
        return A;
    }
}

/*

Transformación afín de coordenadas
entre
un sistema S1 ortogonal con coordenadas x, y
y
un sistema S2 con coordenadas u, v
cuyo origen está en P
y definido por los vectores U, V
que no tienen en general por qué ser ortogonales

Dado un punto 
A = [ax, ay];

El origen de coordenadas del sistema S2 es
P = [px, py];

Y sus vectores son
U = [ux, uy];
V = [vx, vy];

El punto A en el sistema S1 se corresponde con B en S2:
B = [bu, bv]

dado B, calculo A

ax = px + ux·bu + vx·bv (1)
ay = py + uy·bu + vy·bv (2)

dado A, quiero calcular B

       vx(ay-py) - vy(ax-px)
bu = -------------------------
           vx·uy - ux·vy


       ux·(ay-py) - uy(ax-px)
bv = --------------------------
            ux·vy - vx·uy

proceso de cálculo:             

multiplico (1) por vy
ax·vy = px·vy + ux·vy·bu + vx·vy·bv (1)
despejo
vx·vy·bv = ax·vy - px·vy - ux·vy·bu (1)

multiplico (2) por vx
ay·vx = py·vx + vx·uy·bu + vx·vy·bv (2)
despejo
vx·vy·bv = ay·vx - py·vx - vx·uy·bu (2)

igualo para despejar bu
ax·vy - px·vy - ux·vy·bu = ay·vx - py·vx - vx·uy·bu

vx·uy·bu - ux·vy·bu = ay·vx - py·vx - ax·vy + px·vy

bu(vx·uy - ux·vy) = ay·vx - py·vx - ax·vy + px·vy

       ay·vx - py·vx - ax·vy + px·vy
bu = ---------------------------------
            vx·uy - ux·vy

       vx(ay-py) - vy(ax-px)
bu = -------------------------
           vx·uy - ux·vy

multiplico (1) por uy
ax·uy = px·uy + ux·uy·bu + vx·uy·bv (1)
despejo
ux·uy·bu = ax·uy - px·uy - vx·uy·bv (1)

multiplico (2) por ux
ay·ux = py·ux + ux·uy·bu + ux·vy·bv (2)
despejo
ux·uy·bu = ay·ux - py·ux - ux·vy·bv (2)

igualo para despejar bv
ax·uy - px·uy - vx·uy·bv = ay·ux - py·ux - ux·vy·bv

ux·vy·bv - vx·uy·bv = ay·ux - py·ux - ax·uy + px·uy

bv·(ux·vy - vx·uy) = ay·ux - py·ux - ax·uy + px·uy

       ay·ux - py·ux - ax·uy + px·uy
bv = ---------------------------------
               ux·vy - vx·uy

       ux·(ay-py) - uy(ax-px)
bv = --------------------------
            ux·vy - vx·uy


*/