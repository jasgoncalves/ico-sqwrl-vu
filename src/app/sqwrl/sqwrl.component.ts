import { Component, OnInit } from '@angular/core';
import { QueryTable } from '../model/query-table'
import { HttpClient } from '@angular/common/http';
import { Clazz } from '../model/clazz';
import { DataPropety } from '../model/data-property';
import { ObjectPropety } from '../model/object-property';
import { RelationalOperator } from '../model/relational-operator';
import { Individual } from '../model/individual';
import { ClazzResponse } from '../model/clazz-response';
import { EntityType } from '../model/entity-type';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap'; 

@Component({
  selector: 'app-sqwrl',
  templateUrl: './sqwrl.component.html',
  styleUrls: ['./sqwrl.component.css']
})
export class SqwrlComponent implements OnInit {

  constructor(private http: HttpClient, private modalService: NgbModal) { }

      queryArray: Array<QueryTable> = [];  
      newRow: QueryTable = new QueryTable("","",false,false); 
      entityType: EntityType[] = []
      clazzes: Clazz[] = [];
      objectProperties: ObjectPropety[] = [];
      dataProperties: DataPropety[] = [];
      individuals: Individual[] = [];
      relationalOperators: RelationalOperator[] = [];
      url : string = 'http://localhost:8080/semantic/api/v1'
      loading : boolean = false

      ngOnInit(): void {  
        // this.addRow();  
      }  

      addRow() {     
        this.queryArray.push(this.newRow); 
        this.newRow = new QueryTable("","",false,false)  
        console.log(this.queryArray);  
      }  

      deleteRow(index:number) {  
        this.queryArray.splice(index, 1);   
      }

      async onChange(newValue : string){
        console.log(newValue);
        this.loading = true;
        document.getElementById('loadMe').
        switch(newValue) { 
          case "Class": { 
            var response = await this.http.get<ClazzResponse>(this.url+'/classes').toPromise();
            this.entityType = response.data;
            break; 
          } 
          case "ObjectProperty": { 
            var response = await this.http.get<ClazzResponse>(this.url+'//object-properties').toPromise();
            this.entityType = response.data;
            break; 
          } 
          case "DatatypeProperty": { 
            var response = await this.http.get<ClazzResponse>(this.url+'/datatype-properties').toPromise();
            this.entityType = response.data;
            break; 
          } 
          case "Individual": { 
            var response = await this.http.get<ClazzResponse>(this.url+'/individuals').toPromise();
            this.entityType = response.data;
            break; 
          } 
          case "RelationalOperator": { 
            var response = await this.http.get<ClazzResponse>(this.url+'/relational-operators').toPromise();
            this.entityType = response.data;
            break; 
          } 
          default: { 
            this.entityType = []
            break; 
          } 
       }
       this.loading = false; 
      }
      
}
