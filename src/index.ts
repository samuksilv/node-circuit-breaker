import axios, { AxiosInstance } from "axios";
import moment from "moment";
import CircuitBreaker from "opossum";
import { ChuckNorrisPhrase } from "./models/chuck-norris-phrase-response";

const baseURL: string = "https://api.chucknorris.io";

const api: AxiosInstance = axios.create({
    baseURL
});

const promise = async () => {
    setInterval(searchChuckNorrisPhrase, 1);
};

async function searchChuckNorrisPhrase(): Promise<void> {
    const response = await api.get('jokes/random')

    const data: ChuckNorrisPhrase = response.data as ChuckNorrisPhrase;
    const date: string = moment().format("DD/MM/YYYY HH:mm:ss");

    console.log(`[${date}] - ${data.value}`);
}


const circuit = new CircuitBreaker(promise, {
    cache: true,
    timeout: 60000,
    errorThresholdPercentage: 20,
    resetTimeout: 30000,
});

circuit.fallback(() => `${baseURL} unavailable right now. Try later.`);

circuit.on("fire", () => {

    const date: string = moment().format("DD/MM/YYYY HH:mm:ss");

    console.log(`[${date}] - circuit has fired event`);
});

circuit.on("close", () => {

    const date: string = moment().format("DD/MM/YYYY HH:mm:ss");

    console.log(`[${date}] - circuit is closed`);
});

circuit.on("open", () => {

    const date: string = moment().format("DD/MM/YYYY HH:mm:ss");

    console.log(`[${date}] - circuit is opened`);
});

circuit.on("halfOpen", () => {

    const date: string = moment().format("DD/MM/YYYY HH:mm:ss");

    console.log(`[${date}] - circuit is closed`);
});

circuit.on("timeout", () => {

    const date: string = moment().format("DD/MM/YYYY HH:mm:ss");

    console.log(`[${date}] - timeout occurred`);
});

circuit.fire().then().catch(console.error)


