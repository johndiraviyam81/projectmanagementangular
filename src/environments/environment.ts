// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const apiURL='http://localhost:8090/';
export const environment = {
  production: false,
  ProjectAddUrl : apiURL+'projects/add',
   ProjectGetUrl : apiURL+'projects/allprojects', 
ProjectByidGetUrl : apiURL+'projects/project',
 searchProjectUrl: apiURL+'projects/search',
 taskAddUrl:apiURL+'tasks/add', 
 taskGetUrl: apiURL+'tasks/alltasks',
 parentTaskAllUrl: apiURL+'tasks/allparenttasks',
 taskByidGetUrl: apiURL+'tasks/task',
 searchtaskUrl: apiURL+'tasks/search',
 taskByParentIDGetUrl: apiURL+'tasks/parent',
 userAddUrl: apiURL+'users/add',
 userGetUrl: apiURL+'users/allusers',
 userByidGetUrl : apiURL+'users/user',
 searchUserUrl: apiURL+'users/searchusers'
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
