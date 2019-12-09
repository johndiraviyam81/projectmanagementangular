import {Component, OnInit,ElementRef, ViewChild} from '@angular/core';
import { DatePipe } from '@angular/common';
import {Project} from '../../model/project';
import {ProjectsService} from "../../projects.service";
import {EditProjectComponent} from "../edit-project/edit-project.component";
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
  selector: 'app-list-projects',
  templateUrl: './list-projects.component.html',
  styleUrls: ['./list-projects.component.css']
})
export class ListProjectsComponent implements OnInit {
  searchProjectString= new FormControl();
  pipe=new DatePipe('en-US');
  projects:Project[];
  
  searchAllProjects:Project[];
  displayedColumns: string[] = ['projectName','startDate', 'endDate','priority', 'userName','noOfTasks','status','projectId'];
  

  dataSource: MatTableDataSource<Project>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private _snackBar: MatSnackBar,private projectsService:ProjectsService,public dialog: MatDialog,private router: Router) {
    
     
   }

  ngOnInit() {
    this.getProjects();    
  }
  editProject(projectIdDialog: any): void {
    console.log("getting project ::"+projectIdDialog);
    this.getProjectById(projectIdDialog);    
  }

  getProjectById(projectId : any): void {
    
    this.projectsService.getProjectById(projectId).subscribe((newProject:Project) => {
      console.log('get new projectIdDialog');
      console.log(JSON.stringify(newProject));
     
      const dialogRef = this.dialog.open(EditProjectComponent, {
        width: '600px',
        height: '500px',
        data: newProject
      }); 
    
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
         
      });
    }, err=>console.log(err));
     
   
  }

  suspendProject(projectId : any): void {
    console.log("suspending project ::"+projectId);
    this.projectsService.getProjectById(projectId).subscribe(getRecord => {
      console.log('getRecord message :: '+getRecord.message);
      getRecord.endDate=this.pipe.transform(new Date(),"yyyy-MM-dd");
      
      this.projectsService.updateProject(getRecord).subscribe(updateRecord => {
        this._snackBar.open(updateRecord.message, "!!!!", {
          duration: 2000,
        });
        this.router.navigateByUrl('/tasks', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/projects']);
      });
    }, err=>{
      console.log('delete message :: '+err.message);
      console.log("project error"+err)}
      );
          
    }, err=>{
      console.log('delete message :: '+err.message);
      console.log("project error"+err)}
      );

  }

  getProjects(): void {
    console.log('fetched project');
    this.projectsService.getProjects().subscribe(projects => {this.projects = projects;
      this.searchAllProjects=projects;  
      this.dataSource = new MatTableDataSource(this.projects);   
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
  searchProject():void{
    console.log('search projects::'+this.searchProjectString.value);
   
    this.projectsService.searchProject(this.searchProjectString.value).subscribe(projects => {this.projects = projects;
      this.searchAllProjects=projects;       
    });
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
