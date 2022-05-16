app.controller("HocSinhController", function ($scope, toastr, $ngConfirm) {
    angular.element(document).ready(function () {
        $scope.Search();
        $scope.GVlist();
        $scope.ClassList();
    });
    $scope.modelSearch = {};
    $scope.Search = function () {
        $scope.DanhSach = [];

        $.ajax({
            type: 'POST',
            url: '/Home/SearchStu',
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
    $scope.GVlist = function () {
        $scope.ListGV = [];

        $.ajax({
            type: 'POST',
            url: '/Home/Search',
            data: {
                kyword: $scope.modelSearch
            },
            success: function (data) {
                if (data.Error == false) {
                    $scope.ListGV = data.data;
                } else {

                }

                $scope.$apply();
            }
        });
    }
    $scope.ClassList = function () {
        $scope.ListClass = [];

        $.ajax({
            type: 'POST',
            url: '/Home/SearchClass',
            data: {
                kyword: $scope.modelSearch
            },
            success: function (data) {
                if (data.Error == false) {
                    $scope.ListClass = data.data;
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
        $scope.rows.push({ ID_HS: 0, MA_HS: '', TEN_HOC_SINH: '', ID_GV: 0, ID_LOP: 0, VANG_CO_PHEP_BOOL: false, VANG_KHONG_PHEP_BOOL: false, NGAY_THEO_DOI: '', BIEU_HIEN_CUA_TRE: '' });
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
                url: '/Home/editStu',
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
                url: '/Home/Addstu',
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
                            url: '/Home/DeleteStu',
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