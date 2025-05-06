import dataset from '../testData/testLoginData.json';
export type Scenario = keyof typeof dataset;


export interface DataCard {
    username: string;
    password: string;
    product: string;
}