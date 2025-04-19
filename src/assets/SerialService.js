class SerialService {
    constructor() {
        this.port = null;
        this.reader = null;
        this.isReading = false;
        this.isSimulate = false;
        this.cacheSize = 100;
        this.data = [];
        this.buffer='';
        this.onDataRecived = () => { };
    }
    async reqPort() {
        if (!("serial" in navigator)) {
            throw new Error("WSA no es compatible");
        }
        this.port = await navigator.serial.requestPort();
        return this.port;
    }
    async connect(baudRate = 9600) {
        this.isSimulate = false;
        if (!this.port)
            throw new Error("No se selecciono un puerto");
        await this.port.open({ baudRate });
        this.reader = this.port.readable.getReader();
        this.isReading = true;
        this.readLoop();

    }

    async readLoop() {
        const decoder = new TextDecoder()
        while (this.isReading) {
            try {
                const { value, done } = await this.reader.read();
                if (done) break;
                let text = await decoder.decode(value).trim();
                if (text) {
                    this.processData(text);
                    //console.log('SERIAL SERVICE JS');
                    //console.log(text);
                }
            } catch (error) {
                console.error("read error:", error)
                this.isReading = false;
            }
        }
    }
    async disconnect() {
        this.isReading = false;
        if (this.reader) {
            await this.reader.cancel();
            this.reader.releaseLock();
        }
        if (this.port)
            await this.port.close();
        this.port = null;
    }
    processData(value) {
        try {

            this.buffer = this.buffer + value;
            //console.log(this.buffer);
            if(this.buffer.length > 4){
                if(this.buffer.substring(this.buffer.length-4) =='UMSA'){
                    //console.log(this.buffer);
                    this.addCaheData(this.buffer);
                    this.onDataRecived(this.buffer);       
                    this.buffer='';
                }
            }

        } catch (error) {
            console.warn("dato no valido", value)
        }
    }
    addCaheData(data) {
        if (this.data.length >= this.cacheSize) {
            this.data.shift();
        }
        this.data.push(data);
    }
    getCache() {
        return this.data;
    }
    setDataReceived(callback) {
        this.onDataRecived = callback;
    }

    simulating(interval = 1000) {
        this.isSimulate = true;
        this.isReading = false;
        this.port = null;
        let count = 0;
        let h = 0;
        let t = 0;
        let dt = 0.1;
        this.generateData(interval, t, count, h,dt);
    }
    generateData(interval, t, count, h,dt) {
        if (!this.isSimulate) return;
        //<teamid>,<time>,<count>,<estado>,<altitud>,<temp>,<presion>,<voltage>,<CO2>,<AX>,<AY>,<AZ>,<GX>,<GY>,<GZ>
        const simulateData = "17480," + t + "," + count + ",SIM," + h + ",0,0,100,0,0,0,0,0,0,0";
        count++;
        t = t + interval;
        h = h + dt * 2;
        if (h < 0 || h > 400) {
            dt = dt * -1;
        }
        this.addCaheData(simulateData);
        this.setDataReceived(simulateData);
        console.log(simulateData);
        setTimeout(() => this.generateData(interval, t, count, h,dt), interval);
    }


    async listPorts() {
        if (!("serial" in navigator)) {
            throw new Error("WSA no es compatible");
        }
        const ports = await navigator.serial.getPorts();
        return ports.map((port, index) => ({ id: index, port }));
    }

    async reqPrueba() {
      if (!("serial" in navigator)) {
          throw new Error("WSA no es compatible");
      }
      console.log("PASO PRUEBA");

  }
}
const serialService = new SerialService();
export default serialService;
