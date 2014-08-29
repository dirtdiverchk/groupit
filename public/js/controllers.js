var App = angular.module('App',[]);

 



App.controller('group',function($scope,$http){

  $http.get('/grupos/getgrupos').success(function(data) {
      $scope.datagrupos = data.grupos;
      

    });

  $scope.datagrupos;

});

