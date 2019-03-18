class RectXForm
{
    constructor()
    {
        this.sr = new Rect(0, 0, 1, 1);     // source rectangle
        this.dr = new Rect(0, 0, 1, 1);     // destination rectangle
    }

    fwdPoint(sp)
    {
        return new Vec2(
            this.dr.x + this.dr.w * (sp.x - this.sr.x) / this.sr.w,
            this.dr.y + this.dr.h * (sp.y - this.sr.y) / this.sr.h
        );
    }

    invPoint(dp)
    {
        return new Vec2(
            this.sr.x + this.sr.w * (dp.x - this.dr.x) / this.dr.w,
            this.sr.y + this.sr.h * (dp.y - this.dr.y) / this.dr.h
        );
    }

    fwdSize(ss)
    {
        return new Vec2(
            this.dr.w * ss.x / this.sr.w,
            this.dr.h * ss.y / this.sr.h
        );
    }

    invSize(ds)
    {
        return new Vec2(
            this.sr.w * ds.x / this.dr.w,
            this.sr.h * ds.y / this.dr.h
        );
    }

    fwdRect(isr)
    {
        return new Rect(
            this.dr.x + this.dr.w * (isr.x - this.sr.x) / this.sr.w,
            this.dr.y + this.dr.h * (isr.y - this.sr.y) / this.sr.h,
            this.dr.w * isr.w / this.sr.w,
            this.dr.h * isr.h / this.sr.h
        );
    }

    invRect(idr)
    {
        return new Rect(
            this.sr.x + this.sr.w * (idr.x - this.dr.x) / this.dr.w,
            this.sr.y + this.sr.h * (idr.y - this.dr.y) / this.dr.h,
            this.sr.w * idr.w / this.dr.w,
            this.sr.h * idr.h / this.dr.h
        )
    }
}

/*
package es.virtualcode.world2dtest;

import android.graphics.PointF;
import android.graphics.RectF;
import android.hardware.Camera.Size;

public class RectXform {
	public RectF sourceRect() {
		return sr;
	}
	public RectF destRect() {
		return dr;
	}
	public void setSourceRect(RectF r) {
		if (r != null)
			sr = r;
	}
	public void setDestRect(RectF r) {
		if (r != null)
			dr = r;
	}
	
	public PointF fwdXformPoint(PointF sp)
	{
		PointF res = new PointF(0,0);
		if (sp == null || sr == null || dr == null)
			return res;
		
	    res.x = dr.left + dr.width()  * (sp.x - sr.left) / sr.width();
	    res.y = dr.top  + dr.height() * (sp.y - sr.top ) / sr.height();
	    
		return res;
	}

	public PointF invXformPoint(PointF dp)
	{
		PointF res = new PointF(0,0);
		if (dp == null || sr == null || dr == null)
			return res;
		
	    res.x = sr.left + sr.width()  * (dp.x - dr.left) / dr.width();
	    res.y = sr.top  + sr.height() * (dp.y - dr.top ) / dr.height();
	    
		return res;
	}

	public PointF fwdXformSize(PointF ss)
	{
		PointF res = new PointF(0,0);
		if (ss == null || sr == null || dr == null)
			return res;
		
	    res.x = dr.width()  * ss.x / sr.width();
	    res.y = dr.height() * ss.y / sr.height();
	    
		return res;
	}
	
	public PointF invXformSize(PointF ds)
	{
		PointF res = new PointF(0,0);
		if (ds == null || sr == null || dr == null)
			return res;
		
	    res.x = sr.width()  * ds.x / dr.width();
	    res.y = sr.height() * ds.y / dr.height();
	    
		return res;
	}
	
	public RectF fwdXformRect(RectF isr)
	{
		RectF res = new RectF(0, 0, 1, 1);
		if (isr == null || sr == null || dr == null)
			return res;
		
	    res.left   = dr.left + dr.width()  * (isr.left   - sr.left) / sr.width();
	    res.top    = dr.top  + dr.height() * (isr.top    - sr.top ) / sr.height();
	    res.right  = dr.left + dr.width()  * (isr.right  - sr.left) / sr.width();
	    res.bottom = dr.top  + dr.height() * (isr.bottom - sr.top ) / sr.height();
		
		return res;
	}
	
	public RectF invXformRect(RectF idr)
	{
		RectF res = new RectF(0, 0, 1, 1);
		if (idr == null || sr == null || dr == null)
			return res;
		
	    res.left   = sr.left + sr.width()  * (idr.left   - dr.left) / dr.width();
	    res.top    = sr.top  + sr.height() * (idr.top    - dr.top ) / dr.height();
	    res.right  = sr.left + sr.width()  * (idr.right  - dr.left) / dr.width();
	    res.bottom = sr.top  + sr.height() * (idr.bottom - dr.top ) / dr.height();
		
		return res;
	}
	
	public RectF sr = new RectF(0, 0, 1, 1);
	public RectF dr = new RectF(0, 0, 1, 1);
}
*/

/*

CGPoint fwdXformPoint(const CGPoint* p, const CGRect* sr, const CGRect* dr)
{
    if (p == 0 || sr == 0 || dr == 0)
        return CGPointMake(0, 0);

    float x = dr->origin.x + dr->size.width  * (p->x - sr->origin.x) / sr->size.width;
    float y = dr->origin.y + dr->size.height * (p->y - sr->origin.y) / sr->size.height;
    
    return CGPointMake(x,y);
}

CGPoint invXformPoint(const CGPoint* p, const CGRect* sr, const CGRect* dr)
{
    if (p == 0 || sr == 0 || dr == 0)
        return CGPointMake(0, 0);
    
    float x = sr->origin.x + sr->size.width  * (p->x - dr->origin.x) / dr->size.width;
    float y = sr->origin.y + sr->size.height * (p->y - dr->origin.y) / dr->size.height;
    
    return CGPointMake(x,y);
}

CGSize  fwdXformSize (const CGSize*  s, const CGRect* sr, const CGRect* dr)
{
    if (s == 0 || sr == 0 || dr == 0)
        return CGSizeMake(0, 0);
    
    float x = dr->size.width  * s->width  / sr->size.width;
    float y = dr->size.height * s->height / sr->size.height;
    
    return CGSizeMake(x,y);
}

CGSize  invXformSize (const CGSize*  s, const CGRect* sr, const CGRect* dr)
{
    if (s == 0 || sr == 0 || dr == 0)
        return CGSizeMake(0, 0);
    
    float x = sr->size.width  * s->width  / dr->size.width;
    float y = sr->size.height * s->height / dr->size.height;
    
    return CGSizeMake(x,y);
}

CGRect  fwdXformRect (const CGRect*  r, const CGRect* sr, const CGRect* dr)
{
    if (r == 0 || sr == 0 || dr == 0)
        return CGRectMake(0, 0, 0, 0);
    
    CGRect resultRect;
    resultRect.origin = fwdXformPoint(&r->origin, sr, dr);
    resultRect.size   = fwdXformSize (&r->size,   sr, dr);
    
    return resultRect;
}

CGRect  invXformRect (const CGRect*  r, const CGRect* sr, const CGRect* dr)
{
    if (r == 0 || sr == 0 || dr == 0)
        return CGRectMake(0, 0, 0, 0);
    
    CGRect resultRect;
    resultRect.origin = invXformPoint(&r->origin, sr, dr);
    resultRect.size   = invXformSize (&r->size,   sr, dr);
    
    return resultRect;
}




*/

