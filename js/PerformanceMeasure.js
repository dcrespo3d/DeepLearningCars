class PeriodicPerf
{
    constructor(tag = "PeriodicPerf", periodMillis = 100)
    {
        this.tag = tag
        this.periodMillis = periodMillis;
        this.accumTime = 0.0;
        this.count = 0;
    }

    beginMeasure()
    {
        this.beginTime = performance.now();
    }

    endMeasure()
    {
        this.endTime = performance.now();
        this.count += 1;
        let interval = this.endTime - this.beginTime;
        this.accumTime += interval;
        if (this.accumTime >= this.periodMillis) {
            console.log('==================================================');
            console.log('PeriodicPerf: measured tag ' + this.tag);
            console.log('' + this.count + ' measures in ' + 0.001 * this.accumTime + ' second');
            console.log('mean time: ' + this.accumTime / this.count + ' milliseconds');
            this.accumTime = 0.0;
            this.count = 0;
        }
    }

}