export class Task {
    constructor(  
            public	taskId?: string,
            public	taskName?: string,
            public	parentTaskId?: string,  
            public	parentTaskName?: string,   
            public	projectId?: string,
            public	userId?: string,
            public	userName?: string,
            public	projectName?: string,
            public	startDate?: string,
            public	endDate?: string,
            public	priority?: string,
            public	status?: string,
            public	setParentTask?: string,
            public	message?: string
      
    ) {}
  }