import {Component, OnInit,ElementRef, ViewChild} from '@angular/core';
import {Sort} from '@angular/material/sort';
import {Project} from '../../model/project';
import {ProjectsService} from "../../projects.service";
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormArray,FormGroup, FormControl,  FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: 'app-list-projects',
  templateUrl: './list-projects.component.html',
  styleUrls: ['./list-projects.component.css']
})
export class ListProjectsComponent implements OnInit {
  searchProjectString= new FormControl();
  projects:Project[];
  searchAllProjects:Project[];

  constructor(private projectsService:ProjectsService) { }

  ngOnInit() {
    this.getProjects();
  }

  getProjects(): void {
    console.log('fetched project');
    this.projectsService.getProjects().subscribe(projects => {this.projects = projects;
      this.searchAllProjects=projects;       
    });
    
  }
  searchProject():void{
    console.log('search projects::'+this.searchProjectString.value);
   
    this.projectsService.searchProject(this.searchProjectString.value).subscribe(projects => {this.projects = projects;
      this.searchAllProjects=projects;       
    });
  }

  sortData(sort: Sort) {
    console.log('sort usersort::'+sort);
    const data = this.projects.slice();
    if (!sort.active || sort.direction === '') {
      this.projects = data;
      return;
    }

    this.projects = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'projectName': return compare(a.projectName, b.projectName, isAsc);
        case 'startDate': return compare(a.startDate, b.startDate, isAsc);
        case 'endDate': return compare(a.endDate, b.endDate, isAsc);
        case 'priority': return compare(a.priority, b.priority, isAsc);
        case 'userName': return compare(a.userName, b.userName, isAsc);
        default: return 0;
      }
    });
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
