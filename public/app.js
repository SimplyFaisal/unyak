"use strict"

var app = angular.module('unyak',[]);
app.controller('MainCtrl', MainCtrl);
app.factory('YakService', YakService);

MainCtrl.$inject = ['$scope','YakService',];
function MainCtrl($scope, YakService ) {
    $scope.schools = [];
    $scope.selected = [];
    $scope.vm = [];
    $scope.select = select;

    activate();
    //////////////////
    function activate() {
        YakService.schools().success(function(schools, status) {
            $scope.schools = schools;
        });
    }

    function select() {
        var school = $scope.selectedSchool;
        if ($scope.selected.indexOf(school) > 0) {
            return;
        }
        $scope.selected.push(school);
        YakService.yaks(school).success(function(yaks, status) {
            $scope.vm.push({
                school: school,
                data: yaks
            });
        });
    }

}

YakService.$inject = ['$http'];
function YakService($http) {
    var exports = {};
    exports.schools = schools;
    exports.count = count;
    exports.yaks = yaks;

    /////////////

    function schools() {
        return $http({
            url: '/schools',
            method: 'GET',
            params: null
        });
    }

    function count(school) {
        return $http({
            url: '/count/' + school,
            method: 'GET',
            params: null
        });
    }

    function yaks(school) {
        return $http({
            url: '/yaks/',
            method: 'GET',
            params: {
                school:school,
            }
        });
    }

    return exports;
}