class TrackManager
{
    constructor()
    {
        this.track = null;

        this.centerPoints = null;
        this.leftPoints = null;
        this.rightPoints = null;
        this.numPoints = 0;

        this.centerSegments = null;
        this.leftSegments = null;
        this.rightSegments = null;
        this.numSegments = 0;

        this.trapezoids = null;
        this.segLengths = null;
        this.segStarts = null;
        this.segTotalLength = 0;
    }

    loadTrack(filename, resultCallback)
    {
        let req = new XMLHttpRequest();
        let that = this;
        req.addEventListener('load', function(ev){
            // console.log(ev);
            // console.log(this);
            if (200 == this.status)
            {
                let parseOk = that._importTrack(this.responseText);
                if (resultCallback) resultCallback(parseOk);
            }
            else
            {
                if (resultCallback) resultCallback(false);
            }
        });
        req.open('GET', filename);
        req.send();
    }

    _parseTrack(trackText)
    {
        let track = JSON.parse(trackText);

        if (!Array.isArray(track)) {
            console.log("TrackManager._parseTrack ERROR: track should be an array");
            return null;
        }

        for (let i = 0; i < track.length; i++) {
            let elem = track[i];
            if (!Array.isArray(elem)) {
                console.log("TrackManager._parseTrack ERROR: track elements should be an array");
                return null;
            }
    
            if (elem.length != 3) {
                console.log("TrackManager._parseTrack ERROR: track elements should be arrays of 3");
                return null;
            }

            for (let j = 0; j < 3; j++) {
                let elemvalue = elem[j];
                if (!Number.isFinite(elemvalue)) {
                    console.log("TrackManager._parseTrack ERROR: track elements should be arrays of 3 finite numbers");
                    return null;
                }

            }
        }

        return track;
    }

    _importTrack(trackText)
    {
        this.track = this._parseTrack(trackText);
        if (this.track == null)
            return false;

        this.centerPoints = [];

        for (let i = 0; i < this.track.length; i++) {
            let elem = this.track[i];
            this.centerPoints.push([elem[0], elem[1]]);
        }

        this.numPoints = this.centerPoints.length;
        this.leftPoints = this._calculateParallelTrack(this.track, -0.5);
        this.rightPoints = this._calculateParallelTrack(this.track, 0.5);

        this._calculateSegments();
        this._calculateTrapezoids();
        this._calculateSegmentStartLengths();

        return true;
    }

    _calculateParallelTrack(track, factor) {
        let len = track.length;
        if (len < 2) return [];
    
        let imax = len - 1;
    
        let para = [];
    
        for (let i = 0; i <= imax; i++) {
            let e = track[i];
            let ep = (i != 0   ) ? track[i-1] : track[i];
            let en = (i != imax) ? track[i+1] : track[i];
    
            let dx = en[0] - ep[0];
            let dy = en[1] - ep[1];
            let dist = Math.sqrt(dx*dx + dy*dy);
            let tw = e[2];
    
            let x = e[0] - dy * tw * factor / dist;
            let y = e[1] + dx * tw * factor / dist;
    
            para.push([x, y]);
        }
    
        return para;
    }
    
    _calculateSegments() {
        this.numSegments = this.numPoints - 1;
        if (this.numSegments < 1) {
            this.numSegments = 0;
            return;
        }

        this.leftSegments = new Array(this.numSegments);
        this.rightSegments = new Array(this.numSegments);
        this.centerSegments = new Array(this.numSegments);
    
                

//        this.centerSegmentStarts = [];
//        let totalLength = 0;

        let p1x, p1y, p2x, p2y, seg;
        for (let i = 0; i < this.numSegments; i++) {
            p1x = this.centerPoints[i+0][0];
            p1y = this.centerPoints[i+0][1];
            p2x = this.centerPoints[i+1][0];
            p2y = this.centerPoints[i+1][1];
            this.centerSegments[i] = Segment2.newFrom4Values(p1x, p1y, p2x, p2y);
//            this.centerSegmentStarts.push(totalLength);
//            totalLength += seg.p1.distanceTo(seg.p2);
        }

        for (let i = 0; i < this.numSegments; i++) {
            p1x = this.leftPoints[i+0][0];
            p1y = this.leftPoints[i+0][1];
            p2x = this.leftPoints[i+1][0];
            p2y = this.leftPoints[i+1][1];
            this.leftSegments[i] = Segment2.newFrom4Values(p1x, p1y, p2x, p2y);
        }

        for (let i = 0; i < this.numSegments; i++) {
            p1x = this.rightPoints[i+0][0];
            p1y = this.rightPoints[i+0][1];
            p2x = this.rightPoints[i+1][0];
            p2y = this.rightPoints[i+1][1];
            this.rightSegments[i] = Segment2.newFrom4Values(p1x, p1y, p2x, p2y);
        }
/*
        for (let i = 1; i < this.leftPoints.length; i++) {
            p1x = this.leftPoints[i-1][0];
            p1y = this.leftPoints[i-1][1];
            p2x = this.leftPoints[i+0][0];
            p2y = this.leftPoints[i+0][1];
            seg = new Segment2();
            seg.setFrom4Values(p1x, p1y, p2x, p2y);
            this.leftSegments.push(seg);
        }

        for (let i = 1; i < this.rightPoints.length; i++) {
            p1x = this.rightPoints[i-1][0];
            p1y = this.rightPoints[i-1][1];
            p2x = this.rightPoints[i+0][0];
            p2y = this.rightPoints[i+0][1];
            seg = new Segment2();
            seg.setFrom4Values(p1x, p1y, p2x, p2y);
            this.rightSegments.push(seg);
        }
*/        
    }

    _calculateTrapezoids() {
        this.trapezoids = new Array(this.numSegments);

        for (let i = 0; i < this.numSegments; i++) {
            this.trapezoids[i] = Trapezoid.newFrom2Segments(
                this.leftSegments[i], this.rightSegments[i]
            );
        }
    }

    _calculateSegmentStartLengths() {
        this.segLengths = new Array(this.numSegments);
        this.segStarts  = new Array(this.numSegments);
        this.segTotalLength = 0;
        for (let i = 0; i < this.numSegments; i++) {
            let seg = this.centerSegments[i];
            let len = seg.p1.distanceTo(seg.p2);
            this.segLengths[i] = len;
            this.segStarts[i] = this.segTotalLength;
            this.segTotalLength += len;
        }
    }

    getTrackPointList()
    {
        let list = [];

        if (this.centerPoints != null) {
            list.push(this.leftPoints);
            //list.push(this.centerPoints);
            list.push(this.rightPoints);
        }

        return list;
    }
/*
    getTrackSegmentList()
    {
        return this.segments;
    }
*/
    getInitialCarPosition()
    {
        if (this.centerPoints.length < 1)
            return new Vec2(0, 0);

        // let p0 = this.centerPoints[0];
        // return new Vec2(p0[0], p0[1]);
        let p0 = this.centerPoints[0];
        let p1 = this.centerPoints[1];
        return new Vec2(0.5 * (p1[0] + p0[0]), 0.5 * (p1[1] + p0[1]));
    }

    getInitialCarDirection()
    {
        if (this.centerPoints.length < 2)
            return new Vec2(0, 0);

        let p0 = this.centerPoints[0];
        let p1 = this.centerPoints[1];
        return new Vec2(p1[0] - p0[0], p1[1] - p0[1]);
    }

    getIntersectionsWithSegment(seg)
    {
        let isecs = [];
/*        
        for (let i = 0; i < this.leftSegments.length; i++) {
            let isec = this.leftSegments[i].getIntersectionWithSegment2(seg);
            if (isec != null)
                isecs.push(isec);
        }
        for (let i = 0; i < this.rightSegments.length; i++) {
            let isec = this.rightSegments[i].getIntersectionWithSegment2(seg);
            if (isec != null)
                isecs.push(isec);
        }
*/        
        let aabb = AABB.newFromSegment(seg);

        let isec;
        for (let i = 0; i < this.numSegments; i++) {
            let tpzd = this.trapezoids[i];
            if (!aabb.intersectsOtherAABB(tpzd.aabb))
                continue;
            isec = tpzd.segL.getIntersectionWithSegment2(seg);
            if (isec != null) isecs.push(isec);
            isec = tpzd.segR.getIntersectionWithSegment2(seg);
            if (isec != null) isecs.push(isec);
        }

        return isecs;
    }

    getNearestIntersectionWithSegment(seg)
    {
        let isecs = this.getIntersectionsWithSegment(seg);
        if (isecs.length == 0) return null;
        if (isecs.length == 1) return isecs[0];

        let minlen = 1e10;
        let isec = null;
        for (let i = 0; i < isecs.length; i++) {
            let len = seg.p1.distanceTo(isecs[i]);
            if (len < minlen) {
                minlen = len;
                isec = isecs[i];
            }
        }
        return isec;
    }

/*    
    findMirrorPointWithTrackCenter(point) {
        if (this.centerSegments == null)
            return null;

        let norseg = new Segment2();
        norseg.p1 = point;
        for (let i = 0; i < this.centerSegments.length; i++) {
            let seg = this.centerSegments[i];
            norseg.p2 = seg.getMirrorPoint(norseg.p1);
            let isec = seg.getIntersectionWithSegment2(norseg);
            if (isec != null) {
                return isec;
            }
        }
        return null;
    }
*/
    getCompletionFromPosition(pos)
    {
        let currLenPos = null;
        for (let i = 0; i < this.numSegments; i++) {
            let tpzd = this.trapezoids[i];
            if (!tpzd.isPointInsideAABB(pos)) continue;

            let mpos = tpzd.map(pos);
            if (mpos.x >= 0 && mpos.x <= 1 && mpos.y >= 0 && mpos.y <= 1) {
                currLenPos = this.segStarts[i] + mpos.x * this.segLengths[i];
                break;
            }
        }

        if (currLenPos != null) {
            return currLenPos / this.segTotalLength;
        }
        else {
            return null;
        }
    }
}