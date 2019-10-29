import { Component, OnInit } from '@angular/core';
import {Observable, Observer} from 'rxjs';
import {MatToolbarModule} from '@angular/material/toolbar';
import { Router } from '@angular/router';
export interface ExampleTab {
  label: string;
  content: string;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  
    title = 'angular-material-tab-router';  
    navLinks: any[];
    activeLinkIndex = -1; 
    constructor(private router: Router) {
   
      this.navLinks = [
          {
              label: 'Add Project',
              link: './projects',
              index: 0
          }, {
              label: 'Add Task',
              link: './tasks',
              index: 1
          }, {
              label: 'Add User',
              link: './users',
              index: 2
          },
          {
            label: 'View Task',
            link: './viewtasks',
            index: 3
        },  
      ];
  }
    ngOnInit() {
      this.router.events.subscribe((res) => {
        this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find(tab => tab.link === '.' + this.router.url));
    });
    }
  }
  
  
  /**  Copyright 2019 Google Inc. All Rights Reserved.
      Use of this source code is governed by an MIT-style license that
      can be found in the LICENSE file at http://angular.io/license */