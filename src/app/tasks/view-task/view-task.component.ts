  import {Component, OnInit,ElementRef, ViewChild} from '@angular/core';
  import {Sort} from '@angular/material/sort';
  import {Task} from '../../model/task';
  import {TasksService} from "../../tasks.service";
  import {EditTaskComponent} from "../edit-task/edit-task.component";
  import {Observable} from 'rxjs';
  import {map, startWith} from 'rxjs/operators';
  import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
  import { FormArray,FormGroup, FormControl,  FormBuilder, Validators } from "@angular/forms";
  
  @Component({
    selector: 'app-view-task',
    templateUrl: './view-task.component.html',
    styleUrls: ['./view-task.component.css']
  })
  
  
  export class ViewTaskComponent implements OnInit {
  
    searchTaskString= new FormControl();
    tasks:Task[];
    searchAlltasks:Task[];
  
    constructor(private tasksService:TasksService,public dialog: MatDialog) { }
  
    ngOnInit() {
      this.gettasks();
    }
    edittask(taskIdDialog: any): void {
      console.log("getting task ::"+taskIdDialog);
      this.gettaskById(taskIdDialog);    
    }
  
    gettaskById(taskId : any): void {
      
      this.tasksService.gettaskById(taskId).subscribe((newtask:Task) => {
        console.log('get new taskIdDialog');
        console.log(JSON.stringify(newtask));
       
        const dialogRef = this.dialog.open(EditTaskComponent, {
          width: '600px',
          height: '610px',
          data: newtask
        }); 
      
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
           
        });
      }, err=>console.log(err));
       
     
    }
    gettasks(): void {
      console.log('fetched task');
      this.tasksService.gettasks().subscribe(tasks => {this.tasks = tasks;
        this.searchAlltasks=tasks;       
      });
      
    }
    searchTask():void{
      console.log('search tasks::'+this.searchTaskString.value);
     
      this.tasksService.searchtask(this.searchTaskString.value).subscribe(tasks => {this.tasks = tasks;
        this.searchAlltasks=tasks;       
      });
    }
  
    sortData(sort: Sort) {
      console.log('sort usersort::'+sort);
      const data = this.tasks.slice();
      if (!sort.active || sort.direction === '') {
        this.tasks = data;
        return;
      }
  
      this.tasks = data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'taskName': return compare(a.taskName, b.taskName, isAsc);
          case 'startDate': return compare(a.startDate, b.startDate, isAsc);
          case 'endDate': return compare(a.endDate, b.endDate, isAsc);
          case 'priority': return compare(a.priority, b.priority, isAsc);
          case 'userName': return compare(a.userName, b.userName, isAsc);
          case 'projectName': return compare(a.projectName, b.projectName, isAsc);
          case 'parentTaskName': return compare(a.parentTaskName, b.parentTaskName, isAsc);
          default: return 0;
        }
      });
    }
  }
  
  function compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  
