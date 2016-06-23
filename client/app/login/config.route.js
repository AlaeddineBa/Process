(function () {
    'use strict';

    angular
        .module('app')
        .config(routePremiumDashboard);

    routePremiumDashboard.$inject = ['$stateProvider'];

    function routePremiumDashboard($stateProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'client/app/login/login.html',
                controller: 'loginController',
                controllerAs: 'vm'
            });
    }

})();