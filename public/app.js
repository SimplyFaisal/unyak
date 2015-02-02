"use strict"

var app = angular.module('unyak',[]);
app.controller('FeedCtrl', FeedCtrl);
app.controller('DropdownCtrl', DropdownCtrl);
app.controller('NgramCtrl', NgramCtrl);
app.factory('YakFactory', YakFactory);
app.service('YakService', YakService);


DropdownCtrl.$inject = ['$scope', 'YakFactory', 'YakService'];
function DropdownCtrl($scope, YakFactory, YakService) {
    $scope.schools = null;
    $scope.select = select;

    activate();
    /////////////////////

    function activate() {
        YakFactory.schools().success(function(schools, status) {
            $scope.schools = schools;
        });
    }

    function select() {
        YakService.addSchool($scope.selectedSchool);
    }
}


FeedCtrl.$inject = ['$scope','YakFactory', 'YakService'];
function FeedCtrl($scope, YakFactory, YakService) {
    $scope.selectedSchools = [];
    $scope.vm = [];
    $scope.focus = focus;
    $scope.$on('addedSchool', addFeed);

    activate();
    //////////////////
    function activate() {}


    function addFeed() {
        $scope.selectedSchools = YakService.getSelected();
        var last = $scope.selectedSchools.length - 1;
        var school = $scope.selectedSchools[last];
        YakFactory.yaks(school).success(function(yaks, status) {
            $scope.vm.push({
                school: school,
                data: yaks
            });
        });
    }

    function focus(school) {
        YakService.setFocus(school);
    }
}

NgramCtrl.$inject = ['$scope', 'YakService', 'YakFactory'];
function NgramCtrl($scope, YakService, YakFactory) {
    $scope.vm = [];
    $scope.updateNgrams = updateNgrams;
    $scope.school;
    $scope.$on('changeFocus', changeFocus);

    activate();
    ///////////

    function activate() {}


    function changeFocus() {
        $scope.school = YakService.getFocus();  
    }

    function updateNgrams() {
        var school = $scope.school;
        var length = $scope.length;
        YakFactory.ngrams(school, length).success(function(ngrams, status) {
            $scope.vm = ngrams;
        });
    }
}

YakFactory.$inject = ['$http'];
function YakFactory($http) {
    var exports = {};
    exports.schools = schools;
    exports.count = count;
    exports.yaks = yaks;
    exports.ngrams = ngrams;

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

    function ngrams(school, length) {
        return $http({
            url: '/yaks/ngrams/',
            method: 'GET',
            params: {
                school: school,
                length: length,
            }
        });
    }

    return exports;
}

YakService.$inject = ['$rootScope'];
function YakService($rootScope) {
    var service = {};
    service.selected = [];

    service.addSchool = function(school) {
        if (!alreadySelected(school)) {
            service.selected.push(school);
            $rootScope.$broadcast('addedSchool');            
        }
    };

    service.getSelected = function() {
        return service.selected;
    };

    service.setFocus = function(school) {
        service.focus = school;
        $rootScope.$broadcast('changeFocus');
    };

    service.getFocus = function() {
        return service.focus;
    };

    var  alreadySelected = function(school) {
        return service.selected.indexOf(school) > -1;
    };

    return service;
}
