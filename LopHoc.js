app.controller("LopHocController", function ($scope, toastr, $ngConfirm) {
    angular.element(document).ready(function () {
        $scope.Search();
    });
    $scope.modelSearch = {};
    $scope.Search = function () {
        $scope.DanhSach = [];

        $.ajax({
            type: 'POST',
            url: '/Home/SearchClass',
            data: {
                kyword: $scope.modelSearch
            },
            success: function (data) {
                if (data.Error == false) {
                    $scope.DanhSach = data.data;
                } else {

                }

                $scope.$apply();
            }
        });
    }
    $scope.checkadd = false;
    $scope.rows = [];
    $scope.Add = function () {
        $scope.checkadd = true;
        $scope.rows.push({ ID: 0, MA_LOP: '', TEN_LOP: '', NAM_HOC: ''});
    };
    $scope.Undo = function () {
        $scope.rows = [];
        $scope.Search();

    }
    $scope.loadTemplate = function (index, item) {
        $scope.DanhSach[index].Edit = true;
    }
    $scope.isAllSelected = false;

    $scope.toggleAll = function () {

        var toggleStatus = $scope.isAllSelected;
        angular.forEach($scope.DanhSach, function (itm) {
            itm.Checked = toggleStatus;
        });

    }
    $scope.Submit = function () {
        //if ($scope.addCty != [] && $scope.addCty.length > 0) {
        if ($scope.checkadd == false) {
            $.ajax({
                type: 'post',
                url: '/Home/editclass',
                data: { ds: $scope.DanhSach },
                success: function (data) {
                    if (data.Error) {
                        toastr.error('Thay đổi dữ liệu thất bại');
                    } else {
                        toastr.success('Thay đổi dữ liệu thành công');
                        $scope.Search();
                    }
                }
            });
        } else {
            $.ajax({
                type: 'post',
                url: '/Home/Addclass',
                data: { ds: $scope.rows },
                success: function (data) {
                    if (data.Error) {
                        toastr.error('Thêm mới dữ liệu thất bại');
                    } else {
                        toastr.success('Thêm mới dữ liệu thành công');
                        $scope.Search();
                        $scope.checkadd = false;
                        $scope.rows = [];
                    }
                }
            })
        }

    };
    $scope.listDelete = [];
    $scope.Delete = function () {
        $scope.listDelete = [];
        angular.forEach($scope.DanhSach, function (data) {
            if (data.Checked == true) {
                $scope.listDelete.push(data);
            }
        });
        if ($scope.listDelete == [] || $scope.listDelete.length == 0) {
            toastr.error('Chưa chọn mục nào để xóa.');
            return;
        }
        $ngConfirm({
            title: 'Thông báo',
            content: 'Bạn có chắc chắn muốn xóa dữ liệu đã chọn không?',
            scope: $scope,
            buttons: {
                delete: {
                    text: 'Xóa',
                    btnClass: 'btn-red',
                    action: function (scope, button) {
                        $.ajax({
                            type: 'post',
                            url: '/Home/Deleteclass',
                            data: { dt: $scope.listDelete },
                            success: function (data) {
                                if (data.Error) {
                                    console.log(data);
                                    toastr.error(data.Title);
                                } else {
                                    toastr.success('Xóa dữ liệu thành công');
                                    $scope.isAllSelected = false;
                                    $scope.Search();

                                }
                            }
                        });
                    }
                },
                close: {
                    text: 'Hủy',
                    btnClass: 'btn-green',
                    action: function (scope, button) {

                    }
                }
            }
        });
    };
});