// sigmoid activation function
var sigmoid = function(val)
{
    if (val < -10) return 0.0;
    if (val > 10) return 1.0;
    return 1.0 / (1.0 + Math.exp(-val));
}

// softsign function
var softsign = function(val)
{
    let res = val / (1 + Math.abs(val));
    return res;
    //return 0.5 + 0.5*res;
}

class NeuralLayer
{
    constructor(neuronCount,outputCount)
    {
        this.activation = sigmoid;
        this.neuronCount = neuronCount;
        this.outputCount = outputCount;

        this.weights = this.createTwoDimensionalArray(neuronCount + 1, outputCount); // + 1 for bias node
    }

    createTwoDimensionalArray(rowcount, colcount)
    {
        let rowarr = new Array(rowcount);
        for (let row = 0; row < rowcount; row++) {
            let colarr = new Array(colcount);
            for (let col = 0; col < colcount; col++) {
                colarr[col] = 0;
            }
            rowarr[row] = colarr;
        }
        return rowarr;
    }

    processInputs(inputs)
    {
        // check arguments
        if (inputs.length != this.neuronCount)
            throw "NeuralLayer error at processInputs: bad number of inputs";

        // calculate sum for each neuron from weighed inputs and bias
        let sums = new Array(this.outputCount);
        for (let i = 0; i < sums.length; i++)
            sums[i] = 0;

        // add bias (always on) neuron to inputs
        let biasedInputs = new Array(1 + this.neuronCount);
        biasedInputs[0] = 1;
        for (let i = 0; i < inputs.length; i++)
            biasedInputs[1+i] = inputs[i];

        // calculate sums
        let weirow = this.weights;
        for (let j = 0; j < weirow.length; j++) {
            let weicol = weirow[j];
            for (let i = 0; i < weicol.length; i++) {
                sums[i] += biasedInputs[j] * weicol[i];
                //console.log("input: " + biasedInputs[j] + "  weight: " + weicol[i]);
            }
        }

        // apply activation function to sums
        for (let i = 0; i < sums.length; i++)
            sums[i] = softsign(sums[i]);

        // return value
        return sums;
    }

    setRandomWeights(minValue, maxValue)
    {
        let range = maxValue - minValue;
        let weirow = this.weights;
        for (let j = 0; j < weirow.length; j++) {
            let weicol = weirow[j];
            for (let i = 0; i < weicol.length; i++) {
                weicol[i] = minValue + Math.random() * range;
            }
        }
    }

    getNumWeights() {
        return (this.neuronCount + 1) * this.outputCount;
    }

    getWeights(dstarr, idx)
    {
        let k = 0;
        let weirow = this.weights;
        for (let j = 0; j < weirow.length; j++) {
            let weicol = weirow[j];
            for (let i = 0; i < weicol.length; i++) {
                dstarr[idx + k++] = weicol[i];
            }
        }
        return dstarr;
    }

    setWeights(srcarr, idx)
    {
        let k = 0;

        let weirow = this.weights;
        for (let j = 0; j < weirow.length; j++) {
            let weicol = weirow[j];
            for (let i = 0; i < weicol.length; i++) {
                weicol[i] = srcarr[idx + k++];
            }
        }
    }

    doRandomMutation(range)
    {
        let weirow = this.weights;
        for (let j = 0; j < weirow.length; j++) {
            let weicol = weirow[j];
            for (let i = 0; i < weicol.length; i++) {
                weicol[i] += (-0.5 + Math.random()) * range;
            }
        }
    }
}

var testNeuralLayer = function() {
    nl = new NeuralLayer(3, 2);
    weights = [2.733668, -1.488085, -2.911528, -0.8307721, -0.514065, -3.503123, -0.7906049, 2.226407];
    nl.setWeights(weights, 0);

    inputs = [-0.5, 0.5, 1.5];
    outputs = nl.processInputs(inputs);

    console.log("weights: ", weights);
    console.log("inputs : ", inputs);
    console.log("outputs: ", outputs);
}