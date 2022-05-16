
app.controller("LoginController", function ($scope) {
    $scope.Submit = function () {
        $.ajax({
            type: 'POST',
            url: '/Login/LoginUser',
            data: { LoginName: $scope.UserName, password: $scope.pass},
            success: function (data) {
                if (data.data == true) {
                   window.location.href = '/Home/Index';
                }
                $scope.$apply();
            }
        });
    };
    //$scope.page = function () {
    //    $.ajax({
    //        type: 'POST',
    //        url: '/Home/Index',
    //        data: {},
    //        success: function (data) {
    //        }
    //    });
    //}
});