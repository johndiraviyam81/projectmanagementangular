  import {Component, OnInit,ElementRef, ViewChild} from '@angular/core';
  import {Sort} from '@angular/material/sort';
  import {Task} from '../../model/task';
  import {TasksService} from "../../tasks.service";
  import { DatePipe  } from '@angular/common';
  import {EditTaskComponent} from "../edit-task/edit-task.component";
  import {Observable} from 'rxjs';
  import {map, startWith} from 'rxjs/operators';
  import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
  import { FormArray,FormGroup, FormControl,  FormBuilder, Validators } from "@angular/forms";
  import {MatSnackBar} from '@angular/material/snack-bar';
  import {Router} from "@angular/router";
  import {MatPaginator} from '@angular/material/paginator';
  import {MatSort} from '@angular/material/sort';
  import {MatTableDataSource} from '@angular/material/table';
  import {ENUMERATION_TYPES} from '../../model/projectappconstants';

  @Component({
    selector: 'app-view-task',
    templateUrl: './view-task.component.html',
    styleUrls: ['./view-task.component.css']
  })
  
  
  export class ViewTaskComponent implements OnInit {
  
    searchTaskString= new FormControl();
    tasks:Task[];
    searchAlltasks:Task[];
    pipe=new DatePipe('en-US');
    
    displayedColumns: string[] = ['taskName','startDate', 'endDate','priority', 'status','projectName','parentTaskName','taskId'];
  
     dataSource: MatTableDataSource<Task>;
  
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    constructor(private _snackBar: MatSnackBar,private tasksService:TasksService,public dialog: MatDialog,private router: Router) { }
  
    ngOnInit() {
      this.gettasks();
    }
    edittask(taskIdDialog: any): void {
      console.log("getting task ::"+taskIdDialog);
      this.gettaskById(taskIdDialog);    
    }
  
    gettaskById(taskId : any): void {
      
      this.tasksService.gettaskById(taskId).subscribe((newtask:Task) => {
        console.log('eidting the task for updating it:::');
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

    endtask(taskId : any): void {
      
      this.tasksService.gettaskById(taskId).subscribe((updatetask:Task) => {
        console.log('get new taskIdDialog');
        console.log(JSON.stringify(updatetask));
        updatetask.endDate=this.pipe.transform(new Date(),"yyyy-MM-dd");
        updatetask.status=ENUMERATION_TYPES[2];
        this.tasksService.updatetask(updatetask).subscribe(task => {
          console.log(JSON.stringify(task));
          this._snackBar.open(task.message, "!!!!", {
            duration: 2000,
          });
          this.router.navigateByUrl('/projects', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/viewtasks']);
        });    
        
      }, err=>console.log(err));  
    }, err=>console.log(err)); 
  }
       
     
    
    gettasks(): void {
      console.log('fetched task');
      this.tasksService.gettasks().subscribe(tasks => {this.tasks = tasks;
        this.searchAlltasks=tasks;     
        this.dataSource = new MatTableDataSource(this.tasks);   
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
      
    }

    applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
  
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
    searchTask():void{
      console.log('search tasks::'+this.searchTaskString.value);
     
      this.tasksService.searchtask(this.searchTaskString.value).subscribe(tasks => {this.tasks = tasks;
        this.searchAlltasks=tasks;     
        this.dataSource = new MatTableDataSource(this.tasks);   
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;  
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
  
