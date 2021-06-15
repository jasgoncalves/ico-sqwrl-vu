import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Problem } from '../model/scheduling/problem';
import { Order } from '../model/scheduling/order';
import { ObjectiveFunction } from '../model/scheduling/objective-function';
import { Machine } from '../model/scheduling/machine';
import { Job } from '../model/scheduling/job';
import { Task } from '../model/scheduling/task';
import { Response } from '../model/scheduling/response';
import { QueryBody, SQWRLQueryElement, QueryResponse } from '../model/query-body';
import { Request, Model, Property } from '../model/scheduling/request';
import * as FileSaver from 'file-saver';


@Component({
  selector: 'app-scheduling',
  templateUrl: './scheduling.component.html',
  styleUrls: ['./scheduling.component.css']
})
export class SchedulingComponent implements OnInit {

  constructor(private http: HttpClient) { }

  url : string = 'http://localhost:8080/semantic/api/v1'
  alertMessage: string = ""
  alertType: string = ""

  schedulingProblemName: string = "MySchedulingProblem"
  isSchedulingProblemNameEditable: boolean = true
  
  isProblemCompleted: boolean = false
  problems: Array<Problem> = []
  problemProperties: Array<Problem> = []
  newProblem: Problem = new Problem('', '', '', false)

  isMachineCompleted: boolean = false
  machinePropertiesList: Array<Machine> = []
  machineProperties: Array<Machine> = []
  newMachineProperties: Array<Machine> = []

  isOrderCompleted: boolean = false
  orderPropertiesList: Array<Order> = []
  orderProperties: Array<Order> = []
  newOrder: Order = new Order('', '', '', false)

  isJobCompleted: boolean = false
  jobPropertiesList: Array<Job> = []
  jobProperties: Array<Job> = []
  newJobProperties: Array<Job> = []

  isTaskCompleted: boolean = false
  taskPropertiesList: Array<Task> = []
  taskProperties: Array<Task> = []
  newTaskProperties: Array<Task> = []

  isObjectiveFunctionCompleted: boolean = false
  objectiveFunctionPropertiesList: Array<ObjectiveFunction> = []
  objectiveFunctionProperties: Array<ObjectiveFunction> = []
  newObjectiveFunction: ObjectiveFunction = new ObjectiveFunction('', false)

  jobFamiliesList: Array<number> = []
  jobsList: Array<number> = []
  tasksList: Array<number> = []

  ngOnInit(): void {

    this.getSchedulingProblemProperties()
    this.getMachineProperties()
    this.getOrderProperties()
    this.getJobProperties()
    this.getTaskProperties()
    this.getObjectiveFunctionProperties()

  }

  // Scheduling Problem

  addSchedulingProblemProperty() {

    if(this.newProblem.id === "" || this.newProblem.value === ""){
      this.showAlert('warning', "You must select the problem property type and value")
      return
    }

    this.problemProperties.push(this.newProblem); 
    this.newProblem = new Problem('', '', '', false)
    console.log(this.problemProperties);

  }

  deleteSchedulingProblemProperty(index:number) {  
    this.problemProperties.splice(index, 1);  
  }

  editSchedulingProblemProperty(index:number) {  
    this.problemProperties[index].canBeEdited = true;  
  }

  confirmChangesSchedulingProblemProperty(index:number) {  
    this.problemProperties[index].canBeEdited = false;  
  }

  async getSchedulingProblemProperties() {

    var response = await this.http.get<Response>(this.url+'/datatype-properties').toPromise()
    this.problems = response.data.filter(element => element.domainId === "SchedulingProblem")
      
  }

  onNewProblemPropertyChange(event: any){
    console.log(event.target.attributes.id);
    console.log(this.newProblem);
    var row = this.newProblem;
    row.dataType = this.problems.filter(x=> x.id === row.id)[0].dataType;
  }

  setProblemCompleted(){

    if(this.problemProperties.length===0){
      this.showAlert('danger', "You must add at least one problem property")
      return
    }

    if(this.schedulingProblemName === ""){
      this.showAlert('danger', "You should fill in the scheduling problem name.")
      return
    }

    this.isProblemCompleted = true
    this.isSchedulingProblemNameEditable = false
    var hasNumberOfMachines = this.problemProperties.filter(element => element.id === 'hasNumberOfMachines')
    this.newMachineProperties = []
    if(hasNumberOfMachines.length>0){
      for (let i = 1; i < (hasNumberOfMachines[0].value as unknown as number + 1); i++) {
        this.newMachineProperties.push(new Machine('','','', i, 0, false))
      }
    } else this.isMachineCompleted = true

    this.closeAlert()
    
  }

  // Machine

  async getMachineProperties() {

    var response = await this.http.get<Response>(this.url+'/datatype-properties').toPromise()
    this.machinePropertiesList = response.data.filter(element => element.domainId === "Machine")
      
  }

  addMachineProperty(machine: number) {

    var index = this.newMachineProperties.findIndex(element=> element.machineId===machine)
    var newElement = this.newMachineProperties[index]

    if(newElement.id === "" || newElement.value === ""){
      this.showAlert('warning', "You must select the machine property type and value")
      return
    }
    newElement.machineId = machine
    newElement.index = this.machineProperties.filter(element=>element.machineId === machine).length
    this.machineProperties.push(newElement); 
    this.newMachineProperties[index] = new Machine('', '', '', machine, 0, false)
    console.log(this.machineProperties);
    this.closeAlert()

  }

  onNewMachinePropertyChange(event: any, machine: number){
    var newElement = this.newMachineProperties.filter(element=> element.machineId===machine)[0]
    console.log(event.target.attributes.id);
    console.log(newElement);
    var row = newElement;
    row.dataType = this.machinePropertiesList.filter(x=> x.id === row.id)[0].dataType;
  }
  
  deleteMachineProperty(machineIndex:number, machineId:number) { 
    var index =  this.machineProperties.findIndex(element=> element.machineId === machineId && element.index === machineIndex)
    this.machineProperties.splice(index, 1);  
  }

  editMachineProperty(machineIndex:number, machineId:number) {  
    var index =  this.machineProperties.findIndex(element=> element.machineId === machineId && element.index === machineIndex)
    this.machineProperties[index].canBeEdited = true;  
  }

  confirmChangesMachineProperty(machineIndex:number, machineId:number) {  
    var index =  this.machineProperties.findIndex(element=> element.machineId === machineId && element.index === machineIndex)
    this.machineProperties[index].canBeEdited = false;  
  }

  setMachineCompleted(){

    this.newMachineProperties.forEach(element => 
      {
        if(this.machineProperties.filter(machine=> machine.machineId === element.machineId).length===0){
          this.showAlert('danger', "You must add at least one machine property")
          this.isMachineCompleted = false 
          return  
        }
        this.isMachineCompleted = true 
        this.closeAlert()
      })
  }

  setProblemNotCompleted(){

    this.isProblemCompleted = false
    
  }

  // Order

  addOrderProperty() {

    if(this.newOrder.id === "" || this.newOrder.value === ""){
      this.showAlert('warning', "You must select the order property type and value")
      return
    }
    this.orderProperties.push(this.newOrder); 
    this.newOrder = new Order('', '', '', false)
    console.log(this.orderProperties);

  }

  deleteOrderProperty(index:number) {  
    this.orderProperties.splice(index, 1);  
  }

  editOrderProperty(index:number) {  
    this.orderProperties[index].canBeEdited = true;  
  }

  confirmChangesOrderProperty(index:number) {  
    this.orderProperties[index].canBeEdited = false;  
  }

  async getOrderProperties() {

    var response = await this.http.get<Response>(this.url+'/datatype-properties').toPromise()
    this.orderPropertiesList = response.data.filter(element => element.domainId === "Order")
      
  }

  onNewOrderPropertyChange(event: any){
    console.log(event.target.attributes.id);
    console.log(this.newOrder);
    var row = this.newOrder;
    row.dataType = this.orderPropertiesList.filter(x=> x.id === row.id)[0].dataType;
  }

  setOrderCompleted(){

    if(this.orderProperties.length===0){
      this.showAlert('danger', "You must add at least one problem property")
      return
    }

    this.isOrderCompleted = true
    var hasNumberOfJobs = this.orderProperties.filter(element => element.id === 'hasNumberOfJobs')
    var hasJobFamilies = this.orderProperties.filter(element => element.id === 'hasJobFamilies')
    this.jobsList = []
    this.jobFamiliesList = []

    if(hasJobFamilies.length>0){
      for (let i = 1; i < (hasJobFamilies[0].value as unknown as number + 1); i++) {
        this.jobFamiliesList.push(i)
      }
    }

    if(hasNumberOfJobs.length>0){
      for (let i = 1; i < (hasNumberOfJobs[0].value as unknown as number + 1); i++) {
        this.newJobProperties.push(new Job('','','', i, 0, '', '', false))
        this.jobsList.push(i)
      }
    } else this.isJobCompleted = true
    
  }

  setMachineNotCompleted(){

    this.isOrderCompleted = false
    var hasNumberOfMachines = this.problemProperties.filter(element => element.id === 'hasNumberOfMachines')
    if(hasNumberOfMachines.length===0){
      this.isProblemCompleted = false 
    }
    this.isMachineCompleted = false
    
  }

  // Job

  async getJobProperties() {

    var response = await this.http.get<Response>(this.url+'/datatype-properties').toPromise()
    var data = response.data.filter(element => element.domainId === "Job")

    data.forEach(element=> this.jobPropertiesList.push(new Job(element.id, element.dataType, '', 0, 0, 'DatatypeProperty', '', false)))

    response = await this.http.get<Response>(this.url+'/object-properties').toPromise()
    data = response.data.filter(element => element.domainId === "Job")

    data.forEach(element=> this.jobPropertiesList.push(new Job(element.id, '', '', 0, 0, 'ObjectProperty', element.rangeId, false)))
      
  }

  addJobProperty(job: number) {

    var index = this.newJobProperties.findIndex(element=> element.jobId===job)
    var newElement = this.newJobProperties[index]

    if(newElement.id === "" || newElement.value === ""){
      this.showAlert('warning', "You must select the job property type and value")
      return
    }
    newElement.jobId = job
    newElement.index = this.jobProperties.filter(element=>element.jobId === job).length
    this.jobProperties.push(newElement); 
    this.newJobProperties[index] = new Job('', '', '', job, 0, '', '', false)
    console.log(this.jobProperties);

  }

  onNewJobPropertyChange(event: any, job: number){
    var newElement = this.newJobProperties.filter(element=> element.jobId===job)[0]
    console.log(event.target.attributes.id);
    console.log(newElement);
    var row = newElement;
    row.dataType = this.jobPropertiesList.filter(x=> x.id === row.id)[0].dataType;
    row.dataTypeProperty = this.jobPropertiesList.filter(x=> x.id === row.id)[0].dataTypeProperty;
    row.rangeId = this.jobPropertiesList.filter(x=> x.id === row.id)[0].rangeId;
  }
  
  deleteJobProperty(jobIndex:number, jobId:number) { 
    var index =  this.jobProperties.findIndex(element=> element.jobId === jobId && element.index === jobIndex)
    this.jobProperties.splice(index, 1);  
  }

  editJobProperty(jobIndex:number, jobId:number) {  
    var index =  this.jobProperties.findIndex(element=> element.jobId === jobId && element.index === jobIndex)
    this.jobProperties[index].canBeEdited = true;  
  }

  confirmChangesJobProperty(jobIndex:number, jobId:number) {  
    var index =  this.jobProperties.findIndex(element=> element.jobId === jobId && element.index === jobIndex)
    this.jobProperties[index].canBeEdited = false;  
  }

  setJobCompleted(){

    if(this.jobProperties.length===0){
      this.showAlert('danger', "You must add at least one job property")
      return
    }

    this.isJobCompleted = true
    var hasNumberOfTasks = this.jobProperties.filter(element => element.id === 'hasNumberOfTasks')
    this.tasksList = []
    this.taskProperties = []

    var j = 1
    if(hasNumberOfTasks.length>0){
      hasNumberOfTasks.forEach(element=>{
        for (let i = 1; i < (element.value as unknown as number + 1); i++) {
          this.newTaskProperties.push(new Task('','','', j, 0, '', '', false))
          this.taskProperties.push(new Task('belongsToJob', '', element.jobId as unknown as string, j, 0, 'ObjectProperty', 'Job', false))
          this.tasksList.push(j)
          j++
        }
      }
      )
    } else this.isTaskCompleted = true
    
  }

  setOrderNotCompleted(){

    this.isOrderCompleted = false
    
  }

   // Task

   async getTaskProperties() {

    var response = await this.http.get<Response>(this.url+'/datatype-properties').toPromise()
    var data = response.data.filter(element => element.domainId === "Task")

    data.forEach(element=> this.taskPropertiesList.push(new Task(element.id, element.dataType, '', 0, 0, 'DatatypeProperty', '', false)))

    response = await this.http.get<Response>(this.url+'/object-properties').toPromise()
    data = response.data.filter(element => element.domainId === "Task")

    data.forEach(element=> this.taskPropertiesList.push(new Task(element.id, '', '', 0, 0, 'ObjectProperty', element.rangeId, false)))
      
  }

  addTaskProperty(task: number) {

    var index = this.newTaskProperties.findIndex(element=> element.taskId===task)
    var newElement = this.newTaskProperties[index]

    if(newElement.id === "" || newElement.value === ""){
      this.showAlert('warning', "You must select the task property type and value")
      return
    }
    newElement.taskId = task
    newElement.index = this.taskProperties.filter(element=>element.taskId === task).length
    this.taskProperties.push(newElement); 
    this.newTaskProperties[index] = new Task('', '', '', task, 0, '', '', false)
    console.log(this.taskProperties);

  }

  onNewTaskPropertyChange(event: any, task:number){
    var newElement = this.newTaskProperties.filter(element=> element.taskId===task)[0]
    console.log(event.target.attributes.id);
    console.log(newElement);
    var row = newElement;
    row.dataType = this.taskPropertiesList.filter(x=> x.id === row.id)[0].dataType;
    row.dataTypeProperty = this.taskPropertiesList.filter(x=> x.id === row.id)[0].dataTypeProperty;
    row.rangeId = this.taskPropertiesList.filter(x=> x.id === row.id)[0].rangeId;
  }
  
  deleteTaskProperty(taskIndex:number, taskId:number) { 
    var index =  this.taskProperties.findIndex(element=> element.taskId === taskId && element.index === taskIndex)
    this.taskProperties.splice(index, 1);  
  }

  editTaskProperty(taskIndex:number, taskId:number) {  
    var index =  this.taskProperties.findIndex(element=> element.taskId === taskId && element.index === taskIndex)
    this.taskProperties[index].canBeEdited = true;  
  }

  confirmChangesTaskProperty(taskIndex:number, taskId:number) {  
    var index =  this.taskProperties.findIndex(element=> element.taskId === taskId && element.index === taskIndex)
    this.taskProperties[index].canBeEdited = false;  
  }

  setTaskCompleted(){

    this.isTaskCompleted = true
    
  }

  setJobNotCompleted(){

    this.isJobCompleted = false
    
  }

  // ObjectiveFunction

  addObjectiveFunctionProperty() {

    if(this.newObjectiveFunction.id === ""){
      this.showAlert('warning', "You must select the objectiveFunction property type and value")
      return
    }
    this.objectiveFunctionProperties.push(this.newObjectiveFunction); 
    this.newObjectiveFunction = new ObjectiveFunction('', false)
    console.log(this.objectiveFunctionProperties);

  }

  deleteObjectiveFunctionProperty(index:number) {  
    this.objectiveFunctionProperties.splice(index, 1);  
  }

  editObjectiveFunctionProperty(index:number) {  
    this.objectiveFunctionProperties[index].canBeEdited = true;  
  }

  confirmChangesObjectiveFunctionProperty(index:number) {  
    this.objectiveFunctionProperties[index].canBeEdited = false;  
  }

  async getObjectiveFunctionProperties() {

    const headers = this.prepareHeaders()

    const body = this.prepareBodyData()

    console.log(body)

    var response = await this.http
      .post<any>(this.url+'/sqrwl/query/run', body, {headers: headers})
      .toPromise()
      .catch(response => {
        console.log(response);
        this.showAlert('danger', response.error.error.description)}
        );

    var response = response.data.result
    this.objectiveFunctionPropertiesList = response
      
  }

  onNewObjectiveFunctionPropertyChange(event: any){
    console.log(event.target.attributes.id);
    console.log(this.newObjectiveFunction);
    var row = this.newObjectiveFunction;
  }

  setObjectiveFunctionCompleted(){

    this.isObjectiveFunctionCompleted = true
    this.getOntologyFile()
    
  }

  setTaskNotCompleted(){

    this.isObjectiveFunctionCompleted = false
    var hasNumberOfMachines = this.problemProperties.filter(element => element.id === 'hasNumberOfMachines')
    if(hasNumberOfMachines.length===0){
      this.isProblemCompleted = false 
    }
    this.isMachineCompleted = false
    
  }

  async getOntologyFile() {

    var schedulingProblemName = this.schedulingProblemName.replace(/[^\w\s]/gi, '')

    const headers = this.prepareHeaders()

    const body = this.prepareBodyRequest()

    console.log(body)

    var response = await this.http
      .post<Blob>(this.url+'/scheduling-problem', body, {headers: headers, responseType: 'blob' as 'json'})
      .toPromise();

    console.log(response)

    FileSaver.saveAs(response, schedulingProblemName+".owl");
 
  }

  prepareBodyRequest(){

    var schedulingProblemName = this.schedulingProblemName.replace(/[^\w\s]/gi, '')
    var schedulingProblem : Model = new Model(schedulingProblemName)

    this.problemProperties.forEach(element=> {  
      var property : Property = new Property()
      property.name = element.id
      property.value = element.value
      property.type = 'DatatypeProperty'
      schedulingProblem.properties.push(property)
    })

    var order : Model = new Model(schedulingProblemName+"Order")

    this.orderProperties.forEach(element=> { 
      var property : Property = new Property() 
      property.name = element.id
      property.value = element.value
      property.type = 'DatatypeProperty'
      order.properties.push(property)
    })

    var objectiveFunction : Model = new Model(schedulingProblemName+"ObjectiveFunction")

    this.objectiveFunctionProperties.forEach(element=> {
      var property : Property = new Property()  
      property.name = element.id
      property.value = element.id
      property.type = 'ObjectProperty'
      objectiveFunction.properties.push(property)
    })

    var machines : Array<Model> = []

    var machineId : Array<number> = []

    this.machineProperties.forEach(element=>{
      if((machineId.filter(id=> id === element.machineId).length===0))
        machineId.push(element.machineId)
    })

    console.log(machineId)

    machineId.forEach(id => {
      var machine : Model = new Model("Machine"+id)
      this.machineProperties.filter(x=>x.machineId===id).forEach(element=> { 
        var property : Property = new Property() 
        property.name = element.id
        property.value = element.value
        property.type = 'DatatypeProperty'
        machine.properties.push(property)
      })
      machines.push(machine)
    });

    var jobs : Array<Model> = []

    var jobId : Array<number> = []

    this.jobProperties.forEach(element=>{
      if((jobId.filter(id=> id === element.jobId).length===0))
        jobId.push(element.jobId)
    })

    console.log(this.jobProperties)

    jobId.forEach(id => {
      var job : Model = new Model("Job"+id)
      this.jobProperties.filter(x=>x.jobId===id).forEach(element=> {  
        var property : Property = new Property()
        property.name = element.id
        property.value = element.value
        property.type = element.dataTypeProperty
        job.properties.push(property)
      })
      jobs.push(job)
    });

    var tasks : Array<Model> = []

    var taskId : Array<number> = []

    this.taskProperties.forEach(element=>{
      if((taskId.filter(id=> id === element.taskId).length===0))
        taskId.push(element.taskId)
    })

    taskId.forEach(id => {
      var task : Model = new Model("Task"+id)
      this.taskProperties.filter(x=>x.taskId===id).forEach(element=> { 
        var property : Property = new Property() 
        property.name = element.id
        property.value = element.value
        property.type = element.dataTypeProperty
        task.properties.push(property)
      })
      tasks.push(task)
    });

    return JSON.stringify(new Request(schedulingProblemName, schedulingProblem, machines, order, [], jobs, tasks, objectiveFunction))
    
  }

  prepareBodyData(){

    var queryBody = new QueryBody();

    queryBody.name = "Scheduling Application"

    queryBody.query_parameters.push(
      new SQWRLQueryElement(
        "Class", 
        "ObjectiveFunction", 
        "id", 
        true,
        true, 
        ["o"]))
    
    return JSON.stringify(queryBody)

  }

  prepareHeaders(){
    return new HttpHeaders()
    .append(
      'Content-Type',
      'application/json'
    );
  }

  showAlert(type: string, message: string){
    this.alertMessage = message
    this.alertType = type
  }

  closeAlert(){
    this.alertMessage = ""
    this.alertType = ""
  }
}
