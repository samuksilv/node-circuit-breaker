import axios, { AxiosInstance } from "axios";
import moment from "moment";
import CircuitBreaker from "opossum";
import { ChuckNorrisPhrase } from "./models/chuck-norris-phrase-response";

class App {

    circuit: CircuitBreaker;

    constructor() {

        this.circuit = new CircuitBreaker(this.searchChuckNorrisPhrase, {
            timeout: 6000,
            errorThresholdPercentage: 50,
            resetTimeout: 8000,
        });

        this.subscriveEvents();

    }


    public run() {

        setInterval(() => {
            this.circuit.fire().then(console.log).catch(console.error);
        }, 5000);
    }

    searchChuckNorrisPhrase(): Promise<string> {

        const date: string = moment().format("DD/MM/YYYY HH:mm:ss");

        return new Promise<string>(async (resolve, reject) => {

            const baseURL: string = "https://api.chucknorris.io";

            const api = axios.create({
                baseURL
            });

            const response = await api.get('jokes/random');

            const data: ChuckNorrisPhrase = response.data as ChuckNorrisPhrase;

            resolve(`RUNNING - [${date}] - ${data.value}`);

        });

    }

    subscriveEvents() {

        this.circuit.fallback(async () => {
            console.log("teste");
        });

        this.circuit.on('fallback', (data) => console.log(`unavailable right now. Try later.`, "fallback"));

        this.circuit.on("healthCheckFailed", () => {
            const date: string = moment().format("DD/MM/YYYY HH:mm:ss");

            console.log(`[${date}] - healthCheckFailed`);
        });

        this.circuit.on("success", () => {

            const date: string = moment().format("DD/MM/YYYY HH:mm:ss");

            console.log(`[${date}] - circuit success`);
        });

        this.circuit.on("fire", () => {

            const date: string = moment().format("DD/MM/YYYY HH:mm:ss");

            console.log(`[${date}] - circuit has fired event`);
        });

        this.circuit.on("failure", () => {

            const date: string = moment().format("DD/MM/YYYY HH:mm:ss");

            console.log(`[${date}] - circuit has failure`);
        });

        this.circuit.on("close", () => {

            const date: string = moment().format("DD/MM/YYYY HH:mm:ss");

            console.log(`[${date}] - circuit is closed`);
        });

        this.circuit.on("open", () => {

            const date: string = moment().format("DD/MM/YYYY HH:mm:ss");

            console.log(`[${date}] - circuit is opened`);
        });

        this.circuit.on("halfOpen", () => {

            const date: string = moment().format("DD/MM/YYYY HH:mm:ss");

            console.log(`[${date}] - circuit is halfopen`);
        });

        this.circuit.on("timeout", () => {

            const date: string = moment().format("DD/MM/YYYY HH:mm:ss");

            console.log(`[${date}] - timeout occurred`);
        });
    }

}

new App().run();