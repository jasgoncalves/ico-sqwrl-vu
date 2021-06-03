import { Clazz } from "./clazz";

export class ClazzResponse {

    data: Clazz[];
    error: any[];
    
    constructor(data: Clazz[], error: any[])
    {
        this.data = data;
        this.error = error;
    }

}