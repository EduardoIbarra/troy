// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyDGGTCIdGzF2Q6CXBx3Dric5d7NojLM8Po",
    authDomain: "trojan-5d25e.firebaseapp.com",
    databaseURL: "https://trojan-5d25e.firebaseio.com",
    projectId: "trojan-5d25e",
    storageBucket: "trojan-5d25e.appspot.com",
    messagingSenderId: "503655775222"
  },
  apiURL: 'https://eduardoibarra.com/laravel/public/index.php/'
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
