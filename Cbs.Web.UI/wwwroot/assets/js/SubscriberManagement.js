var globalSubscriberModel = { Id: 0, DpId: 0, DpPort: 0, ServiceNumber: null };
var globalSubscriberDeleteModel = { Id: 0, DpId: 0, DpPort: 0, ServiceNumber: null };
var globalSubscriberDeleteModelSN = { Id: 0, DpId: 0, DpPort: 0, ServiceNumber: null };
var globalSubscriberUpdateModel = { Id: 0, DpId: 0, DpPort: 0, ServiceNumber: null, ServiceType: null, SubscriberStatus: null, PortStatus: null, NewServiceNumber: null };
var globalSubscriberTransportFromModel = { Id: 0, DpId: 0, DpPort: 0, ServiceNumber: null, NewDpId: 0, NewDpPort: 0, NewDpPortId: 0 };
var globalBulkInsertData;
var globalIsUpdateBulk = false;
var globalBulkSwitchery;
"use strict";
$(document).ready(function () {
    CheckSession();
    setInterval(function () { CheckSession(); }, 5000);
    var selectText = 'Select';
    $(".card-header-right .close-card").on('click', function () {
        var $this = $(this);
        $this.parents('.card').animate({
            'opacity': '0',
            '-webkit-transform': 'scale3d(.3, .3, .3)',
            'transform': 'scale3d(.3, .3, .3)'
        });

        setTimeout(function () {
            $this.parents('.card').remove();
        }, 800);
    });

    $(".card-header-right .minimize-card").on('click', function () {
        var $this = $(this);
        var port = $($this.parents('.card'));
        var card = $(port).children('.card-block').slideToggle();
        $(this).toggleClass("icon-minus").fadeIn('slow');
        $(this).toggleClass("icon-plus").fadeIn('slow');
    });
    $(".card-header-right .full-card").on('click', function () {
        var $this = $(this);
        var port = $($this.parents('.card'));
        port.toggleClass("full-card");
        $(this).toggleClass("icon-maximize");
        $(this).toggleClass("icon-minimize");
    });
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })
    $('.pcoded-navbar').hide();
    $('#pageHeaderId').remove();
    $('.menuBaseLayerList').remove();
    $('.pcoded-main-container').css('margin-top', '10px');
    var elemsingle = document.querySelector('.js-single');
    var switchery = new Switchery(elemsingle, { color: '#4680ff', jackColor: '#fff' });
    var elemsingle2 = document.querySelector('.js-single2');
    globalBulkSwitchery = new Switchery(elemsingle2, { color: '#4680ff', jackColor: '#fff' });
    $('#isRigit').change(function () {
        $('select').empty();
        var arrRes = [{ id: '-1', text: selectText }];
        $('select').select2({
            data: arrRes
        }).trigger('change');
        $('select').attr('disabled', 'disabled');
        $.ajax({
            type: "GET",
            url: webApiUrl + "/api/SubscriberManagement/Cities",
            headers: UserHelper.GetUserAjaxRequestOptions().headers,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                HideLoading();
                var arrRes = [];
                $.each(data, function (a, b) {
                    var item = { id: b.value, text: b.text };
                    arrRes.push(item);
                });
                arrRes.unshift({ id: '-1', text: selectText });
                $(".js-telcobis-city-selection").select2({
                    data: arrRes
                }).trigger('change');
                $(".js-telcobis-city-selection").removeAttr('disabled');
            },
            error: function (errMsg) {
                HideLoading();
            }
        });
        globalSubscriberModel = { Id: 0, DpId: 0, DpPort: 0, ServiceNumber: null };
        globalSubscriberDeleteModel = { Id: 0, DpId: 0, DpPort: 0, ServiceNumber: null };
        globalSubscriberDeleteModelSN = { Id: 0, DpId: 0, DpPort: 0, ServiceNumber: null };
        globalSubscriberUpdateModel = { Id: 0, DpId: 0, DpPort: 0, ServiceNumber: null, ServiceType: null, SubscriberStatus: null, PortStatus: null, NewServiceNumber: null };
        globalSubscriberTransportFromModel = { Id: 0, DpId: 0, DpPort: 0, ServiceNumber: null, NewDpId: 0, NewDpPort: 0, NewDpPortId: 0 };
    });
    $("#insertSubscriberForm").steps({
        headerTag: "h3",
        bodyTag: "fieldset",
        transitionEffect: "slide",
        stepsOrientation: "vertical",
        autoFocus: true,
        enableFinishButton: false,
        onStepChanging: function (event, currentIndex, newIndex) {
            if (currentIndex == 0) {
                if (globalSubscriberModel.DpId == 0)
                    return false;
                else {
                    ShowLoading();
                    return true;
                }
            }
            else if (currentIndex == 1) {
                if (newIndex == 0) {
                    ShowLoading();
                    return true;
                }
                else {
                    if (globalSubscriberModel.DpPort == 0)
                        return false;
                    else {
                        ShowLoading();
                        return true;
                    }
                }
            }
            else {
                ShowLoading();
                return true;
            }
        },
        onStepChanged: function (event, currentIndex, priorIndex) {
            HideLoading();
        }
    });
    $("#deleteSubscriberFormFindByH").steps({
        headerTag: "h3",
        bodyTag: "fieldset",
        transitionEffect: "slide",
        stepsOrientation: "vertical",
        autoFocus: true,
        enableFinishButton: false,
        onStepChanging: function (event, currentIndex, newIndex) {
            if (currentIndex == 0) {
                if (globalSubscriberDeleteModel.DpId == 0)
                    return false;
                else {
                    ShowLoading();
                    return true;
                }
            }
            else {
                ShowLoading();
                return true;
            }
        },
        onStepChanged: function (event, currentIndex, priorIndex) {
            HideLoading();
        }
    });
    $("#deleteSubscriberFormFindBySN").steps({
        headerTag: "h3",
        bodyTag: "fieldset",
        transitionEffect: "slide",
        stepsOrientation: "vertical",
        autoFocus: true,
        enableFinishButton: false,
        onStepChanging: function (event, currentIndex, newIndex) {
            if (currentIndex == 0) {
                if (!globalSubscriberDeleteModelSN.ServiceNumber)
                    return false;
                else {
                    GetDpPortsDataByServiceId('deleteSubscriberSNGrid', globalSubscriberDeleteModelSN.ServiceNumber, globalSubscriberDeleteModelSN.Id);
                    ShowLoading();
                    return true;
                }
            }
            else {
                ShowLoading();
                return true;
            }
        },
        onStepChanged: function (event, currentIndex, priorIndex) {
            HideLoading();
        }
    });
    $("#updateSubscriberForm").steps({
        headerTag: "h3",
        bodyTag: "fieldset",
        transitionEffect: "slide",
        stepsOrientation: "vertical",
        autoFocus: true,
        enableFinishButton: false,
        onStepChanging: function (event, currentIndex, newIndex) {
            if (currentIndex == 0) {
                if (globalSubscriberUpdateModel.DpId == 0)
                    return false;
                else {
                    ShowLoading();
                    return true;
                }
            }
            else if (currentIndex == 1) {
                if (newIndex == 0) {
                    ShowLoading();
                    return true;
                }
                else {
                    if (!globalSubscriberUpdateModel.ServiceNumber)
                        return false;
                    else {
                        ShowLoading();
                        return true;
                    }
                }
            }
            else {
                ShowLoading();
                return true;
            }
        },
        onStepChanged: function (event, currentIndex, priorIndex) {
            HideLoading();
        }
    });
    $("#transportSubscriberForm").steps({
        headerTag: "h3",
        bodyTag: "fieldset",
        transitionEffect: "slide",
        stepsOrientation: "vertical",
        autoFocus: true,
        enableFinishButton: false,
        onStepChanging: function (event, currentIndex, newIndex) {
            if (currentIndex == 0) {
                if (globalSubscriberTransportFromModel.DpId == 0 || !globalSubscriberTransportFromModel.ServiceNumber)
                    return false;
                else {
                    ShowLoading();
                    return true;
                }
            }
            else {
                ShowLoading();
                return true;
            }
        },
        onStepChanged: function (event, currentIndex, priorIndex) {
            HideLoading();
        }
    });
    $("#backupSubscriberForm").steps({
        headerTag: "h3",
        bodyTag: "fieldset",
        transitionEffect: "slide",
        stepsOrientation: "vertical",
        autoFocus: true,
        enableFinishButton: false
    });
    $('#updateSubscriberUpdateButton').hide();
    $('#insertSubscriberSaveButton').hide();
    $('#deleteSubscriberHDeleteButton').hide();
    $("#deleteSubscriberSNDeleteButton").hide();
    $('#transportFromSubscriberDiv').hide();
    $('#transportToSubscriberDiv').hide();
    $('#transportSubscriberTransportButton').hide();
    $('.displayChatbox').hide();
    $('#btnShowProfileInfo').parent().hide();
    $('#btnSaveWorkpsace').parent().hide();
    $('#insertBulkSubscriber').hide();
    $('select').empty();
    var arrRes = [{ id: '-1', text: selectText }];
    $('select').select2({
        data: arrRes
    }).trigger('change');
    $('select').attr('disabled', 'disabled');
    $('#updateSubscriberServiceType').removeAttr('disabled');
    $('#updateSubscriberStatus').removeAttr('disabled');
    $('#updateSubscriberPortStatus').removeAttr('disabled');
    $('#updateSubscriberServiceType').select2({
        data: [{ id: '-1', text: selectText }
            , { id: 'BITSTREAM_ETHERNET', text: 'BITSTREAM_ETHERNET' }
            , { id: 'VDSL', text: 'VDSL' }
            , { id: 'ADSL', text: 'ADSL' }
            , { id: 'VPBX', text: 'VPBX' }
            , { id: 'Bitstream_IP', text: 'Bitstream_IP' }
            , { id: 'ISDN', text: 'ISDN' }
            , { id: 'BUNDLE', text: 'BUNDLE' }
            , { id: 'COMBO', text: 'COMBO' }
            , { id: 'DSL', text: 'DSL' }
            , { id: 'SCHOOL2014_VDSL_10', text: 'SCHOOL2014_VDSL_10' }
            , { id: 'PREPAY_PROMO', text: 'PREPAY_PROMO' }
            , { id: 'DBLSPD_TEST', text: 'DBLSPD_TEST' }
            , { id: 'SIP_SYSTEM', text: 'SIP_SYSTEM' }
            , { id: '2PLAY', text: '2PLAY' }
            , { id: 'EMPLOYEE', text: 'EMPLOYEE' }
            , { id: 'DAR_PRODUCT', text: 'DAR_PRODUCT' }
            , { id: 'SIP_ACCOUNT', text: 'SIP_ACCOUNT' }
            , { id: '3PLAY', text: '3PLAY' }
            , { id: 'ISDN_BRI', text: 'ISDN_BRI' }
            , { id: 'VDSL_RES', text: 'VDSL_RES' }
            , { id: 'I+FIKS_PREPAY', text: 'I+FIKS_PREPAY' }
            , { id: 'VDSL_BUNDLE', text: 'VDSL_BUNDLE' }
            , { id: 'BITSTREAM_IP', text: 'BITSTREAM_IP' }
            , { id: 'IN USE', text: 'IN USE' }
            , { id: 'ISDN_PRI', text: 'ISDN_PRI' }
            , { id: 'PSTN', text: 'PSTN' }
            , { id: 'I+FIKS', text: 'I+FIKS' }
            , { id: 'PSTN NEW', text: 'PSTN NEW' }
            , { id: 'PSTN_0MF', text: 'PSTN_0MF' }
            , { id: 'OSHEE_VDSL', text: 'OSHEE_VDSL' }
            , { id: 'GPON_2PLAY', text: 'GPON_2PLAY' }
            , { id: 'INTERNAL_LINE', text: 'INTERNAL_LINE' }
            , { id: 'ALBTV_PREPAY', text: 'ALBTV_PREPAY' }
            , { id: 'BITSTREAM', text: 'BITSTREAM' }
            , { id: 'I+FIKS_TABLET', text: 'I+FIKS_TABLET' }
            , { id: 'ADSL 0_PENALTY', text: 'ADSL 0_PENALTY' }]
    }).trigger('change');
    $('#updateSubscriberStatus').select2({
        data: [{ id: '-1', text: selectText }, { id: 'ACTIVE', text: 'ACTIVE' }, { id: 'DEACTIVE', text: 'DEACTIVE' }, { id: 'PENDING_ACTIVE', text: 'PENDING_ACTIVE' }, { id: 'PENDING_DISCONNECT', text: 'PENDING_DISCONNECT' }, { id: 'DISCONNECTED', text: 'DISCONNECTED' }]
    }).trigger('change');
    $('#updateSubscriberPortStatus').select2({
        data: [{ id: '-1', text: selectText }, { id: 'IN USE', text: 'IN USE' }, { id: 'FREE', text: 'FREE' }, { id: 'FAULTY', text: 'FAULTY' }, { id: 'RESERVED', text: 'RESERVED' }]
    }).trigger('change');
    $.ajax({
        type: "GET",
        url: webApiUrl + "/api/SubscriberManagement/Cities",
        headers: UserHelper.GetUserAjaxRequestOptions().headers,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            HideLoading();
            var arrRes = [];
            $.each(data, function (a, b) {
                var item = { id: b.value, text: b.text };
                arrRes.push(item);
            });
            arrRes.unshift({ id: '-1', text: selectText });
            $(".js-telcobis-city-selection").select2({
                data: arrRes
            }).trigger('change');
            $(".js-telcobis-city-selection").removeAttr('disabled');
        },
        error: function (errMsg) {
            HideLoading();
        }
    });
    $('.js-telcobis-city-selection').change(function () {
        var childId = $(this).attr('data-child-id');
        if (childId == undefined || childId == null)
            return;
        var getedChildObj = $('#' + childId);
        if ($(this).val() == '-1') {
            return;
        }
        ShowLoading();
        var isRigitSate = $('#isRigit').is(':checked');
        $.ajax({
            type: "GET",
            url: webApiUrl + "/api/SubscriberManagement/MSANandStreetCabinets?cityId=" + parseInt($(this).val()) + "&isRigit=" + isRigitSate,
            headers: UserHelper.GetUserAjaxRequestOptions().headers,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                HideLoading();
                var arrRes = [];
                $.each(data, function (a, b) {
                    var item = { id: b.value, text: b.text };
                    arrRes.push(item);
                });
                arrRes.unshift({ id: '-1', text: selectText });
                if (arrRes.length == 1)
                    getedChildObj.attr('disabled', 'disabled');
                else
                    getedChildObj.removeAttr('disabled');
                getedChildObj.empty();
                getedChildObj.select2({
                    data: arrRes
                }).trigger('change');
            },
            error: function (errMsg) {
                HideLoading();
            }
        });
    });
    $('.js-telcobis-msansc-selection').change(function () {
        var childId = $(this).attr('data-child-id');
        if (childId == undefined || childId == null)
            return;
        var getedChildObj = $('#' + childId);
        if ($(this).val() == '-1') {
            return;
        }
        ShowLoading();
        var isRigitSate = $('#isRigit').is(':checked');
        $.ajax({
            type: "GET",
            url: webApiUrl + "/api/SubscriberManagement/DPs?deviceId=" + parseInt($(this).val()) + "&isRigit=" + isRigitSate,
            headers: UserHelper.GetUserAjaxRequestOptions().headers,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                HideLoading();
                var arrRes = [];
                $.each(data, function (a, b) {
                    var item = { id: b.value, text: b.text };
                    arrRes.push(item);
                });
                arrRes.unshift({ id: '-1', text: selectText });
                if (arrRes.length == 1) {
                    getedChildObj.attr('disabled', 'disabled');
                }
                else
                    getedChildObj.removeAttr('disabled');
                getedChildObj.empty();
                getedChildObj.select2({
                    data: arrRes
                }).trigger('change');
            },
            error: function (errMsg) {
                HideLoading();
            }
        });
    });
    $('.js-telcobis-dp-selection').change(function () {
        $('#insertSubscriberSaveButton').hide();
        $('#insertSubscriberServiceNumber').val(null);
        var getedId = $(this).attr('id');
        var getedFormId = $($(this).closest('form')).attr('id');
        var getedFormLi = $('#' + getedFormId).find('.actions').find('ul').find('li');
        var getedFormButton = getedFormLi[1];
        if ($(this).val() == '-1') {
            if (getedId == 'insertSubscriberDP')
                globalSubscriberModel.DpId = 0;
            else if (getedId == 'deleteSubscriberMsanSC')
                globalSubscriberDeleteModel.DpId = 0;
            else if (getedId == 'updateSubscriberDP')
                globalSubscriberUpdateModel.DpId = 0;
            else if (getedId == 'transfromFromSubscriberDP') {
                globalSubscriberTransportFromModel.DpId = 0;
                $('#transportFromSubscriberDiv').hide();
            }
            else if (getedId == 'transfromToSubscriberDP') {
                globalSubscriberTransportFromModel.NewDpId = 0;
                $('#transportToSubscriberDiv').hide();
            }
            return;
        }
        else {
            ShowLoading();
            if (getedId == 'insertSubscriberDP')
                globalSubscriberModel.DpId = parseInt($(this).val());
            else if (getedId == 'deleteSubscriberDP')
                globalSubscriberDeleteModel.DpId = parseInt($(this).val());
            else if (getedId == 'updateSubscriberDP')
                globalSubscriberUpdateModel.DpId = parseInt($(this).val());
            else if (getedId == 'transfromFromSubscriberDP') {
                globalSubscriberTransportFromModel.DpId = parseInt($(this).val());
                $('#transportFromSubscriberDiv').show();
            }
            else if (getedId == 'transfromToSubscriberDP') {
                globalSubscriberTransportFromModel.NewDpId = parseInt($(this).val());
                $('#transportToSubscriberDiv').show();
            }
            var gridName = $(this).attr('data-grid-id');
            if (getedId == 'updateSubscriberDP')
                GetDpPortsData(gridName, parseInt($(this).val()), -1, 'DpUpdatePorts');
            else
                GetDpPortsData(gridName, parseInt($(this).val()), -1);
        }
    });
    $('#insertSubscriberServiceNumber').on('keyup change', function () {
        if ($(this).val().length > 0) {
            globalSubscriberModel.ServiceNumber = $(this).val();
            $('#insertSubscriberSaveButton').show();
        }
        else {
            globalSubscriberModel.ServiceNumber = null;
            $('#insertSubscriberSaveButton').hide();
        }
    });
    $('#deleteSubscriberServiceNumber').on('keyup change', function () {
        if ($(this).val().length > 0) {
            globalSubscriberDeleteModelSN.ServiceNumber = $(this).val();
        }
        else {
            globalSubscriberDeleteModelSN.ServiceNumber = null;
        }
    });
    $('#updateSubscriberServiceNumber').on('keyup change', function () {
        if ($(this).val().length > 0) {
            globalSubscriberUpdateModel.NewServiceNumber = $(this).val();
        }
        else {
            globalSubscriberUpdateModel.NewServiceNumber = null;
        }
    });
    $('#updateSubscriberServiceType').change(function () {
        if ($(this).val() == '-1') {
            globalSubscriberUpdateModel.ServiceType = null;
        }
        else {
            globalSubscriberUpdateModel.ServiceType = $(this).val();
        }
    });
    $('#updateSubscriberStatus').change(function () {
        if ($(this).val() == '-1') {
            globalSubscriberUpdateModel.SubscriberStatus = null;
        }
        else {
            globalSubscriberUpdateModel.SubscriberStatus = $(this).val();
        }
    });
    $('#updateSubscriberPortStatus').change(function () {
        if ($(this).val() == '-1') {
            globalSubscriberUpdateModel.PortStatus = null;
        }
        else {
            globalSubscriberUpdateModel.PortStatus = $(this).val();
        }
    });
    $("#transportSubscriberTransportButton").on('click', function () {
        if (!globalSubscriberTransportFromModel.ServiceNumber || globalSubscriberTransportFromModel.DpId == 0 || globalSubscriberTransportFromModel.DpPort == 0) {
            return;
        }
        var isRigitSate = $('#isRigit').is(':checked');
        swal({
            title: "TCDD",
            text: "Are you sure to process?",
            type: "info",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        }, function () {
            $.ajax({
                type: "GET",
                url: webApiUrl + "/api/SubscriberManagement/TransportCopperSubscriber?serviceId=" + globalSubscriberTransportFromModel.ServiceNumber + '&dpId=' + globalSubscriberTransportFromModel.DpId + '&portNo=' + globalSubscriberTransportFromModel.DpPort + '&newDpId=' + globalSubscriberTransportFromModel.NewDpId + '&newPortNo=' + globalSubscriberTransportFromModel.NewDpPort + '&isRigit=' + isRigitSate + '&dpPortId=' + globalSubscriberTransportFromModel.Id + '&newDpPortId=' + globalSubscriberTransportFromModel.NewDpPortId,
                headers: UserHelper.GetUserAjaxRequestOptions().headers,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    swal({ title: data.text }, (function () {
                        if (data.value.toString() == 'true') {
                            globalSubscriberTransportFromModel.ServiceNumber = null;
                            globalSubscriberTransportFromModel.DpPort = 0;
                            GetDpPortsData('transportFromSubscriberGrid', globalSubscriberTransportFromModel.DpId, globalSubscriberTransportFromModel.Id);
                            GetDpPortsData('transportToSubscriberGrid', globalSubscriberTransportFromModel.NewDpId, globalSubscriberTransportFromModel.Id);
                            $("#transportSubscriberForm").steps("previous");
                        }
                    }));
                },
                error: function (errMsg) {
                }
            });
        });

    });
    $("#insertSubscriberSaveButton").on('click', function () {
        if (!globalSubscriberModel.ServiceNumber || globalSubscriberModel.DpId == 0 || globalSubscriberModel.DpPort == 0) {
            return;
        }
        var isRigitSate = $('#isRigit').is(':checked');
        swal({
            title: "TCDD",
            text: "Are you sure to process?",
            type: "info",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        }, function () {
            $.ajax({
                type: "GET",
                url: webApiUrl + "/api/SubscriberManagement/InsertCopperSubscriber?serviceId=" + globalSubscriberModel.ServiceNumber + '&dpId=' + globalSubscriberModel.DpId + '&portNo=' + globalSubscriberModel.DpPort + '&isRigit=' + isRigitSate + '&dpPortId=' + globalSubscriberModel.Id,
                headers: UserHelper.GetUserAjaxRequestOptions().headers,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    swal({ title: data.text }, (function () {
                        if (data.value.toString() == 'true') {
                            globalSubscriberModel.DpPort = 0;
                            globalSubscriberModel.ServiceNumber = null;
                            GetDpPortsData('insertSubscriberGrid', globalSubscriberModel.DpId, globalSubscriberModel.Id);
                            $('#insertSubscriberServiceNumber').val(null);
                            $("#insertSubscriberForm").steps("previous");
                            $("#insertSubscriberSaveButton").hide();
                        }
                    }));
                },
                error: function (errMsg) {
                }
            });
        });

    });

    $("#deleteSubscriberHDeleteButton").on('click', function () {
        if (!globalSubscriberDeleteModel.ServiceNumber || globalSubscriberDeleteModel.DpId == 0 || globalSubscriberDeleteModel.DpPort == 0) {
            return;
        }
        var isRigitSate = $('#isRigit').is(':checked');
        swal({
            title: "TCDD",
            text: "Are you sure to process?",
            type: "warning",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        }, function () {
            $.ajax({
                type: "GET",
                url: webApiUrl + "/api/SubscriberManagement/DeleteCopperSubscriber?serviceId=" + globalSubscriberDeleteModel.ServiceNumber + '&dpId=' + globalSubscriberDeleteModel.DpId + '&portNo=' + globalSubscriberDeleteModel.DpPort + '&isRigit=' + isRigitSate + '&dpPortId=' + globalSubscriberDeleteModel.Id,
                headers: UserHelper.GetUserAjaxRequestOptions().headers,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    swal({ title: data.text }, (function () {
                        if (data.value.toString() == 'true') {
                            globalSubscriberDeleteModel.ServiceNumber = null;
                            globalSubscriberDeleteModel.DpPort = 0;
                            GetDpPortsData('deleteSubscriberHGrid', globalSubscriberDeleteModel.DpId, globalSubscriberDeleteModel.Id);
                            $("#deleteSubscriberHDeleteButton").hide();
                        }
                    }));
                },
                error: function (errMsg) {
                }
            });
        });
    });

    $("#deleteSubscriberSNDeleteButton").on('click', function () {
        if (!globalSubscriberDeleteModelSN.ServiceNumber || globalSubscriberDeleteModelSN.DpId == 0 || globalSubscriberDeleteModelSN.DpPort == 0) {
            return;
        }
        swal({
            title: "TCDD",
            text: "Are you sure to process?",
            type: "warning",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        }, function () {
            $.ajax({
                type: "GET",
                url: webApiUrl + "/api/SubscriberManagement/DeleteCopperSubscriber?serviceId=" + globalSubscriberDeleteModelSN.ServiceNumber + '&dpId=' + globalSubscriberDeleteModelSN.DpId + '&portNo=' + globalSubscriberDeleteModelSN.DpPort + '&dpPortId=' + globalSubscriberDeleteModelSN.Id,
                headers: UserHelper.GetUserAjaxRequestOptions().headers,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    swal({ title: data.text }, (function () {
                        if (data.value.toString() == 'true') {
                            globalSubscriberDeleteModelSN.ServiceNumber = null;
                            globalSubscriberDeleteModelSN.DpPort = 0;
                            $('#deleteSubscriberServiceNumber').val(null);
                            $("#deleteSubscriberFormFindBySN").steps("previous");
                            $("#deleteSubscriberSNDeleteButton").hide();
                        }
                    }));
                },
                error: function (errMsg) {
                }
            });
        });
    });

    $("#updateSubscriberUpdateButton").on('click', function () {
        var isRigitSate = $('#isRigit').is(':checked');
        if (!globalSubscriberUpdateModel.ServiceNumber || globalSubscriberUpdateModel.DpId == 0 || globalSubscriberUpdateModel.DpPort == 0) {
            return;
        }
        swal({
            title: "TCDD",
            text: "Are you sure to process?",
            type: "warning",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        }, function () {
            $.ajax({
                type: "GET",
                url: webApiUrl + "/api/SubscriberManagement/UpdateCopperSubscriber?serviceId=" + globalSubscriberUpdateModel.ServiceNumber + '&dpId=' + globalSubscriberUpdateModel.DpId + '&portNo=' + globalSubscriberUpdateModel.DpPort + '&subscriberStatus=' + globalSubscriberUpdateModel.SubscriberStatus + '&serviceType=' + globalSubscriberUpdateModel.ServiceType + '&portStatus=' + globalSubscriberUpdateModel.PortStatus + '&newServiceNumber=' + globalSubscriberUpdateModel.NewServiceNumber + '&isRigit=' + isRigitSate + '&dpPortId=' + globalSubscriberUpdateModel.Id,
                headers: UserHelper.GetUserAjaxRequestOptions().headers,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    swal({ title: data.text }, (function () {
                        if (data.value.toString() == 'true') {
                            globalSubscriberUpdateModel.ServiceNumber = null;
                            globalSubscriberUpdateModel.DpPort = 0;
                            $('#deleteSubscriberServiceNumber').val(null);
                            $("#deleteSubscriberFormFindBySN").steps("previous");
                            $("#deleteSubscriberSNDeleteButton").hide();
                            $("#updateSubscriberForm").steps("previous");
                            GetDpPortsData('updateSubscriberGrid', globalSubscriberUpdateModel.DpId, globalSubscriberUpdateModel.Id, 'DpUpdatePorts');
                        }
                    }));
                },
                error: function (errMsg) {
                }
            });
        });
    });

    $("#insertSubscriberGridRefreshData").on('click', function () {
        GetDpPortsData('insertSubscriberGrid', globalSubscriberModel.DpId, globalSubscriberModel.Id);
    });
    $("#deleteSubscriberSNGridRefreshData").on('click', function () {
        GetDpPortsDataByServiceId('deleteSubscriberSNGrid', globalSubscriberDeleteModelSN.ServiceNumber, globalSubscriberDeleteModelSN.Id);
    });
    $("#deleteSubscriberHGridRefreshData").on('click', function () {
        GetDpPortsData('deleteSubscriberHGrid', globalSubscriberDeleteModel.DpId, globalSubscriberDeleteModel.Id);
    });
    $("#updateSubscriberGridRefreshData").on('click', function () {
        GetDpPortsData('updateSubscriberGrid', globalSubscriberUpdateModel.DpId, globalSubscriberUpdateModel.Id, 'DpUpdatePorts');
    });
    $("#transportFromSubscriberGridRefreshData").on('click', function () {
        GetDpPortsData('transportFromSubscriberGrid', globalSubscriberTransportFromModel.DpId, globalSubscriberTransportFromModel.Id);
    });
    $("#transportToSubscriberGridRefreshData").on('click', function () {
        GetDpPortsData('transportToSubscriberGrid', globalSubscriberTransportFromModel.NewDpId, globalSubscriberTransportFromModel.Id);
    });

    $("#filer_input1").filer({
        limit: 1,
        maxSize: null,
        extensions: ['xlsx'],
        changeInput: '<div class="jFiler-input-dragDrop"><div class="jFiler-input-inner"><div class="jFiler-input-icon"><i class="icon-jfi-cloud-up-o"></i></div><div class="jFiler-input-text"><h3>Drag&Drop files here</h3> <span style="display:inline-block; margin: 15px 0">or</span></div><a class="jFiler-input-choose-btn blue">Browse Files</a></div></div>',
        showThumbs: true,
        theme: "dragdropbox",
        templates: {
            box: '<ul class="jFiler-items-list jFiler-items-grid" style="display: flex;flex-direction: row;flex-wrap: wrap;justify-content: center;align-items: center;"></ul>',
            item: '<li class="jFiler-item">\
						<div class="jFiler-item-container">\
							<div class="jFiler-item-inner">\
								<div class="jFiler-item-thumb">\
									<div class="jFiler-item-status"></div>\
									<div class="jFiler-item-thumb-overlay">\
										<div class="jFiler-item-info">\
											<div style="display:table-cell;vertical-align: middle;">\
												<span class="jFiler-item-title"><b title="{{fi-name}}">{{fi-name}}</b></span>\
												<span class="jFiler-item-others">{{fi-size2}}</span>\
											</div>\
										</div>\
									</div>\
									{{fi-image}}\
								</div>\
								<div class="jFiler-item-assets jFiler-row">\
									<ul class="list-inline pull-left">\
										<li>{{fi-progressBar}}</li>\
									</ul>\
									<ul class="list-inline pull-right">\
										<li><a class="icon-jfi-trash jFiler-item-trash-action"></a></li>\
									</ul>\
								</div>\
							</div>\
						</div>\
					</li>',
            itemAppend: '<li class="jFiler-item">\
							<div class="jFiler-item-container">\
								<div class="jFiler-item-inner">\
									<div class="jFiler-item-thumb">\
										<div class="jFiler-item-status"></div>\
										<div class="jFiler-item-thumb-overlay">\
											<div class="jFiler-item-info">\
												<div style="display:table-cell;vertical-align: middle;">\
													<span class="jFiler-item-title"><b title="{{fi-name}}">{{fi-name}}</b></span>\
													<span class="jFiler-item-others">{{fi-size2}}</span>\
												</div>\
											</div>\
										</div>\
										{{fi-image}}\
									</div>\
									<div class="jFiler-item-assets jFiler-row">\
										<ul class="list-inline pull-left">\
											<li><span class="jFiler-item-others">{{fi-icon}}</span></li>\
										</ul>\
										<ul class="list-inline pull-right">\
											<li><a class="icon-jfi-trash jFiler-item-trash-action"></a></li>\
										</ul>\
									</div>\
								</div>\
							</div>\
						</li>',
            progressBar: '<div class="bar"></div>',
            itemAppendToEnd: false,
            canvasImage: true,
            removeConfirmation: false,
            _selectors: {
                list: '.jFiler-items-list',
                item: '.jFiler-item',
                progressBar: '.bar',
                remove: '.jFiler-item-trash-action'
            }
        },
        dragDrop: {
            dragEnter: null,
            dragLeave: null,
            drop: null,
            dragContainer: null,
        },
        uploadFile: {
            url: "Home/SaveFile",
            data: null,
            type: 'POST',
            enctype: 'multipart/form-data',
            synchron: true,
            beforeSend: function () { },
            success: function (data, itemEl, listEl, boxEl, newInputEl, inputEl, id) {
                var parent = itemEl.find(".jFiler-jProgressBar").parent(),
                    new_file_name = JSON.parse(data),
                    filerKit = inputEl.prop("jFiler");
                filerKit.files_list[id].name = new_file_name;
                ShowLoading();
                var isRigitSate = $('#isRigit').is(':checked');
                var isOverrideSate = $('#isOverride').is(':checked');
                $.ajax({
                    type: "GET",
                    url: webApiUrl + "/api/SubscriberManagement/GetFromExcel?filePath=" + new_file_name.ExtraNextValue + '&isRigit=' + isRigitSate + '&isOverride=' + isOverrideSate,
                    headers: UserHelper.GetUserAjaxRequestOptions().headers,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        HideLoading();
                        if (data.length > 0) {
                            globalBulkSwitchery.disable();
                            globalBulkInsertData = data;
                            PrepareGridForDpSubscriber('bulkInsertGrid', data);
                            $('#insertBulkSubscriber').show();
                        }
                        else {
                            globalBulkSwitchery.enable();
                            globalBulkInsertData = null;
                            $('.icon-jfi-trash').trigger('click');
                            ShowError('Excel format is not correct.');
                        }
                    },
                    error: function (errMsg) {
                        HideLoading();
                    }
                });
                itemEl.find(".jFiler-jProgressBar").fadeOut("slow", function () {
                    $("<div class=\"jFiler-item-others text-success\"><i class=\"icon-jfi-check-circle\"></i> Success</div>").hide().appendTo(parent).fadeIn("slow");
                });
            },
            error: function (el) {
                var parent = el.find(".jFiler-jProgressBar").parent();
                el.find(".jFiler-jProgressBar").fadeOut("slow", function () {
                    $("<div class=\"jFiler-item-others text-error\"><i class=\"icon-jfi-minus-circle\"></i> Error</div>").hide().appendTo(parent).fadeIn("slow");
                });
            },
            statusCode: null,
            onProgress: null,
            onComplete: null
        },
        files: null,
        addMore: false,
        allowDuplicates: true,
        clipBoardPaste: true,
        excludeName: null,
        beforeRender: null,
        afterRender: null,
        beforeShow: null,
        beforeSelect: null,
        onSelect: null,
        afterShow: null,
        onRemove: function (itemEl, file, id, listEl, boxEl, newInputEl, inputEl) {
            var filerKit = inputEl.prop("jFiler"),
                file_name = filerKit.files_list[id].name.ExtraValue;
            ShowLoading();
            $.ajax({
                type: "GET",
                url: "Home/RemoveFile?fileName=" + file_name,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    HideLoading();
                    $("#bulkInsertGrid").dxDataGrid("dispose");
                    $('#insertBulkSubscriber').hide();
                    if (globalIsUpdateBulk) {
                        PrepareGridForDpSubscriber('bulkInsertGrid', globalBulkInsertData);
                        globalIsUpdateBulk = false;
                    }
                    globalBulkInsertData = null;
                    globalBulkSwitchery.enable();
                },
                error: function (errMsg) {
                    HideLoading();
                    $("#bulkInsertGrid").dxDataGrid("dispose");
                    $('#insertBulkSubscriber').hide();
                    if (globalIsUpdateBulk) {
                        PrepareGridForDpSubscriber('bulkInsertGrid', globalBulkInsertData);
                        globalIsUpdateBulk = false;
                    }
                    globalBulkInsertData = null;
                }
            });

        },
        onEmpty: null,
        options: null,
        dialogs: {
            alert: function (text) {
                return ShowError(text);
            },
            confirm: function (text, callback) {
                confirm(text) ? callback() : null;
            }
        },
        captions: {
            button: "Choose Files",
            feedback: "Choose files To Upload",
            feedback2: "files were chosen",
            drop: "Drop file here to Upload",
            removeConfirmation: "Are you sure you want to remove this file?",
            errors: {
                filesLimit: "Only {{fi-limit}} files are allowed to be uploaded.",
                filesType: "Only Excel (xlsx) files are allowed to be uploaded.",
                filesSize: "{{fi-name}} is too large! Please upload file up to {{fi-maxSize}} MB.",
                filesSizeAll: "Files you've choosed are too large! Please upload files up to {{fi-maxSize}} MB."
            }
        }
    });
    $('.jFiler-theme-dragdropbox').attr('style', 'margin-top: 30px;');
    $("#insertBulkSubscriber").on('click', function () {
        swal({
            title: "TCDD",
            text: "Are you sure to process?",
            type: "info",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        }, function () {
            var arrForCustomDiv = [];
            $(globalBulkInsertData).each(function (a, b) {
                var k = { ServiceId: b.serviceId, MsanName: b.msanName, MsanId: b.msanId == null ? 0 : b.msanId, DpLabel: b.dpLabel, DpId: b.dpId == null ? 0 : b.dpId, DpPort: b.dpPort == null ? 0 : b.dpPort, CRMOrderId: b.crmOrderId == null ? 0 : b.crmOrderId, FirstName: b.firstName, LastName: b.lastName, ProductId: b.productId, Status: b.status, StatusId: b.statusId };
                arrForCustomDiv.push(k);
            });
            ShowLoading();
            $.ajax({
                type: "POST",
                url: webApiUrl + "/api/SubscriberManagement/AddBulkSubscriber",
                data: { req: JSON.stringify(arrForCustomDiv) },
                success: function (data) {
                    HideLoading();
                    swal({ title: 'Operation has finished, tables will be created for result.' }, (function () {
                        $('.icon-jfi-trash').trigger('click');
                        globalBulkSwitchery.disable();
                        globalBulkInsertData = data;
                        globalIsUpdateBulk = true;
                    }));
                },
                error: function (errMsg) {
                    HideLoading();
                }
            });
        });

    });
});
function GetDpPortsDataByServiceId(gridName, serviceId) {
    var isRigitSate = $('#isRigit').is(':checked');
    ShowLoading();
    $.ajax({
        type: "GET",
        url: webApiUrl + "/api/SubscriberManagement/DpPortsWithServiceId?serviceId=" + serviceId + '&isRigit=' + isRigitSate,
        headers: UserHelper.GetUserAjaxRequestOptions().headers,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            HideLoading();
            PrepareGridForDpSubscriber(gridName, data);
        },
        error: function (errMsg) {
            HideLoading();
        }
    });
}
function GetDpPortsData(gridName, dpId, dpPortId, apiFunction = 'DpPorts') {
    var isRigitSate = $('#isRigit').is(':checked');
    ShowLoading();
    $.ajax({
        type: "GET",
        url: webApiUrl + "/api/SubscriberManagement/" + apiFunction + "?dp=" + dpId + '&isRigit=' + isRigitSate + '&dpPortId=' + dpPortId,
        headers: UserHelper.GetUserAjaxRequestOptions().headers,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            HideLoading();
            PrepareGridForDpSubscriber(gridName, data);
        },
        error: function (errMsg) {
            HideLoading();
        }
    });
}
function PrepareGridForDpSubscriber(divId, data, isRefresh) {
    try {
        $("#" + divId).dxDataGrid("dispose");
    } catch (e) {

    }
    $("#" + divId).dxDataGrid({
        height: '80%',
        width: '100%',
        dataSource: data,
        showBorders: true,
        selection: {
            mode: "single",
            showCheckBoxesMode: "onClick"
        },
        paging: {
            pageSize: 10
        },
        pager: {
            allowedPageSizes: [5, 10, 15, 30],
            showInfo: true,
            showNavigationButtons: true,
            showPageSizeSelector: true,
            visible: true
        },
        headerFilter: {
            visible: true
        },
        export: {
            enabled: true
        },
        onSelectionChanged: function (selectedItems) {
            SMChangeSelectionOfGrid(selectedItems, divId);
        },
        onCellPrepared: function (rowElement, rowInfo) {
            SMRowColorOfGrid(rowElement, divId);
        },
        allowColumnReordering: true,
        columns: GetColumnsFromJSON(data)
    });
}
function SMRowColorOfGrid(rowElement, divId) {
    if (divId == 'insertSubscriberGrid') {
        if (rowElement.data != null) {
            if (!rowElement.data.serviceId) {
                rowElement.cellElement.css('color', '#9dc8e2');
            }
            else {
                rowElement.cellElement.css('color', '#2184be');
            }
        }
    }
    else if (divId == 'deleteSubscriberHGrid') {
        if (rowElement.data != null) {
            if (!rowElement.data.serviceId) {
                rowElement.cellElement.css('color', '#2184be');
            }
            else {
                rowElement.cellElement.css('color', '#9dc8e2');
            }
        }
    }
    else if (divId == 'deleteSubscriberSNGrid') {
        if (rowElement.data != null) {
            rowElement.cellElement.css('color', '#2184be');
        }
    }
    else if (divId == 'updateSubscriberGrid') {
        if (rowElement.data != null) {
            if (!rowElement.data.serviceId) {
                rowElement.cellElement.css('color', '#9dc8e2');
            }
            else {
                rowElement.cellElement.css('color', '#2184be');
            }
        }
    }
    else if (divId == 'transportFromSubscriberGrid') {
        if (rowElement.data != null) {
            if (!rowElement.data.serviceId) {
                rowElement.cellElement.css('color', '#2184be');
            }
            else {
                rowElement.cellElement.css('color', '#9dc8e2');
            }
        }
    }
    else if (divId == 'transportToSubscriberGrid') {
        if (rowElement.data != null) {
            if (!rowElement.data.serviceId) {
                rowElement.cellElement.css('color', '#2184be');
            }
            else {
                rowElement.cellElement.css('color', '#9dc8e2');
            }
        }
    }
    else if (divId == 'bulkInsertGrid') {
        if (rowElement.data != null) {
            if (rowElement.data.statusId == 0 || rowElement.data.extraValue == 0) {
                rowElement.cellElement.css('color', '#d90909');
            }
            else {
                rowElement.cellElement.css('color', '#2184be');
            }
        }
    }
}
function SMChangeSelectionOfGrid(selectedItems, divId) {
    var data = selectedItems.selectedRowsData[0];
    if (data) {
        if (divId == 'insertSubscriberGrid') {
            if (data.serviceId) {
                ShowInfo('You can not select this port (' + data.portNumber + '), its already defined for ' + data.serviceId + ' service id.');
                globalSubscriberModel.DpPort = 0;
                globalSubscriberModel.Id = 0;
                selectedItems.component.deselectAll();
            }
            else {
                ShowSuccess('You have been select port (' + data.portNumber + ')');
                globalSubscriberModel.DpPort = data.portNumber;
                globalSubscriberModel.DpId = data.dpId;
                globalSubscriberModel.Id = data.id;
            }
        }
        else if (divId == 'deleteSubscriberHGrid') {
            if (!data.serviceId) {
                $('#deleteSubscriberHDeleteButton').hide();
                ShowInfo('You can not select this row there is no service number for it.');
                globalSubscriberDeleteModel.Id = 0;
                globalSubscriberDeleteModel.DpPort = 0;
                globalSubscriberDeleteModel.ServiceNumber = null;
                selectedItems.component.deselectAll();
            }
            else {
                $('#deleteSubscriberHDeleteButton').show();
                ShowSuccess('You have been select service id (' + data.serviceId + ')');
                globalSubscriberDeleteModel.Id = data.id;
                globalSubscriberDeleteModel.ServiceNumber = data.serviceId;
                globalSubscriberDeleteModel.DpPort = data.portNumber;
            }
        }
        else if (divId == 'deleteSubscriberSNGrid') {
            $("#deleteSubscriberSNDeleteButton").show();
            ShowSuccess('You have been select service id (' + data.serviceId + ')');
            globalSubscriberDeleteModelSN.ServiceNumber = data.serviceId;
            globalSubscriberDeleteModelSN.DpPort = data.portNumber;
            globalSubscriberDeleteModelSN.DpId = data.dpId;
            globalSubscriberDeleteModelSN.Id = data.id;
        }
        else if (divId == 'transportFromSubscriberGrid') {
            if (!data.serviceId) {
                ShowInfo('You can not select this row there is no service number for it.');
                globalSubscriberTransportFromModel.DpPort = 0;
                globalSubscriberTransportFromModel.ServiceNumber = null;
                //globalSubscriberTransportFromModel.DpId = 0;
                globalSubscriberTransportFromModel.Id = 0;
                selectedItems.component.deselectAll();
            }
            else {
                ShowSuccess('You have been select service id (' + data.serviceId + ')');
                $('#updateSubscriberUpdateButton').show();
                globalSubscriberTransportFromModel.ServiceNumber = data.serviceId;
                globalSubscriberTransportFromModel.DpId = data.dpId;
                globalSubscriberTransportFromModel.DpPort = data.portNumber;
                globalSubscriberTransportFromModel.Id = data.id;
            }
        }
        else if (divId == 'transportToSubscriberGrid') {
            if (data.serviceId) {
                ShowInfo('You can not select this row there is already another service number.');
                globalSubscriberTransportFromModel.NewDpPort = 0;
                globalSubscriberTransportFromModel.NewDpId = 0;
                globalSubscriberTransportFromModel.NewDpPortId = 0;
                selectedItems.component.deselectAll();
                $('#transportSubscriberTransportButton').hide();
            }
            else {
                ShowSuccess('You have been select service id (' + data.serviceId + ')');
                $('#updateSubscriberUpdateButton').show();
                globalSubscriberTransportFromModel.NewDpId = data.dpId;
                globalSubscriberTransportFromModel.NewDpPort = data.portNumber;
                globalSubscriberTransportFromModel.NewDpPortId = data.id;
                $('#transportSubscriberTransportButton').show();
                $($('#transportSubscriberForm').find('.content')[0]).animate({ scrollTop: $($('#transportSubscriberForm').find('.content')[0]).height() }, 1000);
            }
        }
        else if (divId == 'updateSubscriberGrid') {
            if (!data.serviceId) {
                ShowInfo('You can not select this row there is no service number for it.');
                $('#updateSubscriberUpdateButton').hide();
                globalSubscriberUpdateModel.DpPort = 0;
                globalSubscriberUpdateModel.ServiceNumber = null;
                globalSubscriberUpdateModel.ServiceType = '';
                globalSubscriberUpdateModel.SubscriberStatus = '';
                globalSubscriberUpdateModel.PortStatus = '';
                globalSubscriberUpdateModel.Id = 0;
                $('#updateSubscriberServiceNumber').val(null);
                $('#updateSubscriberServiceType').val('');
                $('#updateSubscriberStatus').val('');
                $('#updateSubscriberPortStatus').val('');
                selectedItems.component.deselectAll();
            }
            else {
                ShowSuccess('You have been select service id (' + data.serviceId + ')');
                $('#updateSubscriberUpdateButton').show();
                globalSubscriberUpdateModel.ServiceNumber = data.serviceId;
                globalSubscriberUpdateModel.NewServiceNumber = data.serviceId;
                globalSubscriberUpdateModel.DpPort = data.portNumber;
                globalSubscriberUpdateModel.ServiceType = data.serviceType;
                globalSubscriberUpdateModel.SubscriberStatus = data.subscriberStatus;
                globalSubscriberUpdateModel.PortStatus = data.portStatus;
                globalSubscriberUpdateModel.Id = data.id;
                $('#updateSubscriberServiceNumber').val(globalSubscriberUpdateModel.ServiceNumber);
                if (globalSubscriberUpdateModel.ServiceType != null) {
                    $('#updateSubscriberServiceType').val(globalSubscriberUpdateModel.ServiceType);
                }
                else {
                    $('#updateSubscriberServiceType').val('-1');
                }
                $('#updateSubscriberServiceType').trigger('change');
                if (globalSubscriberUpdateModel.SubscriberStatus != null) {
                    $('#updateSubscriberStatus').val(globalSubscriberUpdateModel.SubscriberStatus);
                }
                else {
                    $('#updateSubscriberStatus').val('-1');
                }
                $('#updateSubscriberStatus').trigger('change');
                if (globalSubscriberUpdateModel.PortStatus != null) {
                    $('#updateSubscriberPortStatus').val(globalSubscriberUpdateModel.PortStatus);
                }
                else {
                    $('#updateSubscriberPortStatus').val('-1');
                }
                $('#updateSubscriberPortStatus').trigger('change');
            }
        }
    }
}
function GetColumnsFromJSON(data) {
    var arr = [];
    if (data.length > 0) {
        var columnsIn = data[0];
        for (var key in columnsIn) {
            arr.push(key);
        }
    }
    return arr;
}

function CheckSession() {
    $.ajax({
        type: "GET",
        url: webApiUrl + "/api/Reporting/CheckSession",
        headers: UserHelper.GetUserAjaxRequestOptions().headers,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
        },
        error: function (errMsg) {
        },
        statusCode: {
            401: function () {
                location.href = "Login";
            }
        }
    });
}