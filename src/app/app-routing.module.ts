import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SqwrlComponent } from './sqwrl/sqwrl.component'
import { SchedulingComponent } from './scheduling/scheduling.component'

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot( [
    {path: 'scheduling', component: SchedulingComponent},
    {path: 'sqwrl', component: SqwrlComponent},
    ],
    {
      enableTracing: false // <-- debugging purposes only
      
    })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
