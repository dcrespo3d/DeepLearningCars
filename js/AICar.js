class AICar extends Car
{
    constructor()
    {
        super();
        this.topology = [5,4,3,2];
        this.nn = new NeuralNetwork(this.topology);

        this.nn.setRandomWeights(-1, 1);

        this.frameCount = 0;
    }

    runNN()
    {
        let inputs = new Array(this.probes01.length);
        for (let i = 0; i < inputs.length; i++) {
            inputs[i] = this.probes01[i] / 3.0;
        }
        let outputs = this.nn.processInputs(inputs);

        this.engine01 = outputs[0];
        this.steer01 = -1 + 2 * outputs[1];
    }
}