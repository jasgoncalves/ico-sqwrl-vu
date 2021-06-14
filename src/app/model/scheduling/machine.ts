export class Machine {

    id: string;
    dataType: string;
    value: string;
    machineId: number;
    index:number;
    canBeEdited: boolean;

    constructor(id: string, dataType: string, value: string, machineId: number, index:number, canBeEdited: boolean){
        this.id = id
        this.dataType = dataType
        this.value = value
        this.machineId = machineId
        this.index = index
        this.canBeEdited = canBeEdited
    }
}