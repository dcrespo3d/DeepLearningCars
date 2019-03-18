class Population
{
    constructor(numIndividuals)
    {
        this.individuals = new Array(numIndividuals);
        for (let i = 0; i < this.individuals.length; i++) {
            this.individuals[i] = new AICar;
        }

        this.generationIndex = 0;

        this.trackmgr = null;
    }

    setTrackForIntersections(trackmgr) {
        this.trackmgr = trackmgr;
    }

    setInitialPosDir(pos, dir) {
        this.inipos = pos;
        this.inidir = dir;
        this.resetAllCars();
    }

    resetAllCars() {
        for (let i = 0; i < this.individuals.length; i++) {
            let car = this.individuals[i];
            car.setInitialPosition(this.inipos);
            car.setInitialDirection(this.inidir);
            car.setEngine01(0);
            car.setSteer01(0);
            car.crashed = false;
            car.finished = false;
            car.outside = false;
            car.frameCount = 0;
        }
    }

    setEngineAndSteer(engine01, steer01) {
        for (let i = 0; i < this.individuals.length; i++) {
            let car = this.individuals[i];
            car.setEngine01(engine01);
            car.setSteer01(steer01);
        }
    }

    recombineWeights(src0, src1, dst0, dst1, swapProb)
    {
        for (let i = 0; i < src0.length; i++) {
            if (Math.random() < swapProb) {
                dst0[i] = src1[i];
                dst1[i] = src0[i];
            }
            else {
                dst0[i] = src0[i];
                dst1[i] = src1[i];
            }
        }
    }

    mutateWeights(warr, mutProb, mutAmount)
    {
        for (let i = 0; i < warr.length; i++) {
            if (Math.random() < mutProb) {
                warr[i] += -mutAmount + Math.random() * 2 * mutAmount;
            }
        }
    }

    recombination() {
        let car0 = this.individuals[0];
        let car1 = this.individuals[1];
        let src0 = car0.nn.getWeights();
        let src1 = car1.nn.getWeights();
        let numWeights = src0.length;
        let dst0 = new Array(numWeights);
        let dst1 = new Array(numWeights);

        let swapProb = 0.6;
        let mutProb = 0.3;
        let mutAmount = 2.0;

        if (car0.finished && car1.finished)
        {
            mutProb = 0.1;
            mutAmount = 0.5;
        }

        for (let i = 0; i < this.individuals.length/2; i++) {
            let car0 = this.individuals[2*i+0];
            let car1 = this.individuals[2*i+1];
            this.recombineWeights(src0, src1, dst0, dst1, swapProb);
            this.mutateWeights(dst0, mutProb, mutAmount);
            this.mutateWeights(dst1, mutProb, mutAmount);
            car0.nn.setWeights(dst0);
            car1.nn.setWeights(dst1);
            //car.nn.doRandomMutation(0.5);
        }
    }

    darwinize() {
        this.recombination();
        /*
        let bestCar = this.individuals[0];
        let warr = bestCar.nn.getWeights();
        for (let i = 0; i < this.individuals.length; i++) {
            let car = this.individuals[i];
            car.nn.setWeights(warr);
            car.nn.doRandomMutation(0.5);
        }
        */
    }

    getTotalCount() {
        return this.individuals.length;
    }

    getCrashedCount() {
        let crashedCount = 0;
        for (let i = 0; i < this.individuals.length; i++)
            if (this.individuals[i].crashed)
                crashedCount++;
        return crashedCount;
    }

    getFinishedCount() {
        let finishedCount = 0;
        for (let i = 0; i < this.individuals.length; i++)
            if (this.individuals[i].finished)
                finishedCount++;
        return finishedCount;
    }

    updateWithDeltaTime(deltaTime) {
        let anyCarAliveIntoCircuit = false;

        for (let i = 0; i < this.individuals.length; i++) {
            let car = this.individuals[i];
            if (car.crashed)
                continue;

            car.runNN();

            car.updateWithDeltaTime(deltaTime);
            car.calculateCarTrackCollisions(trackmgr);
            car.calculateCarRaysTrackCollisions(trackmgr);
            car.calculateCarCompletion(trackmgr);

            if (car.engine01 <= 0.1) {
                car.crashed = true;
            }

            if (!car.finished) {
                anyCarAliveIntoCircuit = true;
                this.frameCount++;
            }
        }

        this.individuals.sort(function(firstEl, secondEl) {
            if (!firstEl.finished && !secondEl.finished)
                // no one has finished, use completion for comparing
                return secondEl.comp01 - firstEl.comp01;

            if (firstEl.finished && secondEl.finished)
                // both have finished, use framecount for comparing
                return firstEl.frameCount - secondEl.frameCount;

            if (firstEl.finished && !secondEl.finished)
                return -1;
            else
                return 1;
        });
        if (!anyCarAliveIntoCircuit) {
            let bestCar = this.individuals[0];
            //console.log("best car completion: " + bestCar.comp01);
            //console.log("logging weights");
            //console.log(bestCar.nn.getWeights());
            this.darwinize();
            this.resetAllCars();
            this.generationIndex++;
        }
    }

}
