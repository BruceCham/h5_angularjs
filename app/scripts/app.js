/**
 * @ngdoc overview
 * Depandancy: AngularJS v1.3.8 has tested in angularjs 1.3.8
 * @name CMA
 * @description
 *
 * Main module of the application.
 */
var app = angular.module('CMA', [
    // 'ngAnimate',
    // 'ngCookies',
    // 'ngResource',
    // 'ngRoute',
    // 'ngSanitize',
    // 'ngTouch', // the ng touch event has some conflict with ng-quick-date.js about event.
    // 'ngQuickDate',
    // 'ngUpload',
    // 'ui.bootstrap.tabs'
    "ui.router",
    "ngDialog"
]);
