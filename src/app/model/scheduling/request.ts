export class Request {

    name: string;
    schedulingProblem: Model;
    machines: Array<Model>;
    order: Model;
    jobFamilies:Array<Model>;
    jobs:Array<Model>;
    tasks:Array<Model>;
    objectiveFunction: Model;

    constructor(name: string, schedulingProblem: Model, machines: Array<Model>, order: Model, jobFamilies:Array<Model>, jobs:Array<Model>, tasks:Array<Model>, objectiveFunction: Model){
        this.name = name
        this.schedulingProblem = schedulingProblem
        this.machines = machines
        this.order = order
        this.jobFamilies = jobFamilies
        this.jobs = jobs
        this.tasks = tasks
        this.objectiveFunction = objectiveFunction
    }
}

export class Model {
    name:string
    properties:Array<Property>
    constructor(name: string){
        this.name = name
        this.properties = []
    }
}

export class Property {
    name:string
    value:string
    type:string

    constructor(){
        this.name = ""
        this.value = ""
        this.type = ""
    }
}