import { Component, OnInit } from '@angular/core';

export class Enumeration {
    id: number;
    name: string;
    type: string;
  }

export const TYPES: Enumeration[] = [
    { id: 1, name: 'On Going',type:'Project' },
    { id: 2, name: 'Completed',type:'Project' },
    { id: 3, name: 'Pending',type:'Task' },
    { id: 4, name: 'Completed',type:'Task' }    
  ];
  export const ENUMERATION_TYPES: string[] = ['On Going','Pending','Completed'];
    

  export class ProjectAppConstants  implements OnInit {
   
    projectTypes:Enumeration;
    
    ngOnInit()
    {
      console.log(TYPES.toString());
    }

    getEnumerationType(eumeratedId:number):string{
      console.log("eumeratedId:::"+eumeratedId);
        this.projectTypes=TYPES.find(enumeration=>enumeration.id===eumeratedId);
      
        return this.projectTypes.name;
    }
 }