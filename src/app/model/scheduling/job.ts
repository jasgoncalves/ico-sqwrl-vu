export class Job {

    id: string;
    dataType: string;
    value: string;
    jobId: number;
    index:number;
    dataTypeProperty:string;
    rangeId:string;
    canBeEdited: boolean;

    constructor(id: string, dataType: string, value: string, jobId: number, index:number, dataTypeProperty:string, rangeId:string, canBeEdited: boolean){
        this.id = id
        this.dataType = dataType
        this.value = value
        this.jobId = jobId
        this.index = index
        this.dataTypeProperty = dataTypeProperty
        this.rangeId = rangeId
        this.canBeEdited = canBeEdited
    }
}