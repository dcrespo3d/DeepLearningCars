class NeuralNetwork
{
    // topology is an array of numbers representing
    // the number of nodes in each layer.
    // example: [4 6 5 2] for 3 layers,
    // with 4 nodes in input layer,
    // 6 nodes in first hidden layer,
    // 5 nodes in second hidden layer,
    // 2 nodes in output layer
    constructor(topology)
    {
        this.topology = topology;

        // calculate overall weight count
        this.weightCount = 0;
        for (let i = 1; i < topology.length; i++)
            this.weightCount += ((1 + topology[i-1]) * topology[i]);

        // initialize layers
        this.layers = new Array(topology.length - 1);
        for (let i = 0; i < this.layers.length; i++)
            this.layers[i] = new NeuralLayer(topology[i], topology[i + 1]);
    }

    processInputs(inputs)
    {
        // check arguments
        if (inputs.length != this.layers[0].neuronCount)
            throw "NeuralNetwork error at processInputs: bad number of inputs";

        // process inputs by forward propagating values thru all layers
        let outputs = inputs;
        for (let i = 0; i < this.layers.length; i++)
            outputs = this.layers[i].processInputs(outputs);

        return outputs;
    }

    setRandomWeights(minValue, maxValue)
    {
        for (let i = 0; i < this.layers.length; i++)
            this.layers[i].setRandomWeights(minValue, maxValue);
    }

    getNumWeights()
    {
        let numWeights = 0;
        for (let i = 0; i < this.layers.length; i++)
            numWeights += this.layers[i].getNumWeights();
        return numWeights;
    }

    getWeights()
    {
        let warr = new Array(this.getNumWeights());
        let idx = 0;
        for (let i = 0; i < this.layers.length; i++) {
            let layer = this.layers[i];
            layer.getWeights(warr, idx);
            idx += layer.getNumWeights();
        }
        return warr;
    }

    setWeights(warr)
    {
        let idx = 0;
        for (let i = 0; i < this.layers.length; i++) {
            let layer = this.layers[i];
            layer.setWeights(warr, idx);
            idx += layer.getNumWeights();
        }
    }

    doRandomMutation(range)
    {
        for (let i = 0; i < this.layers.length; i++) {
            let layer = this.layers[i];
            layer.doRandomMutation(range);
        }
    }

}

var testNeuralNetwork = function()
{
    let nn, inputs, outputs;
    nn = new NeuralNetwork([5, 4, 3, 2]);
    nn.setRandomWeights(-1,1);
    inputs = [1,2,3,4,5];
    outputs = nn.processInputs(inputs);
    //console.log(nn.getNumWeights());
}