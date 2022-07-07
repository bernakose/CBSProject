var UserHelper = {
    GetToken: function () {
        try {
            if (localStorage.getItem("UserLoginToken") == null && localStorage.getItem("UserLoginToken") == undefined) {
                localStorage.setItem("UserLoginToken", "test");
            }
            return localStorage.getItem("UserLoginToken");
        } catch (e) {
            return '';
        }
    },
    GetUserLanguage: function () {
        try {
            var lang = localStorage.getItem("UserUILanguage");
            if (lang)
                return localStorage.getItem("UserUILanguage");
            return 'tr-TR';
        } catch (e) {
            return 'tr-TR';
        }
    },
    SetUserLanguage: function (selectedLang) {
        localStorage.setItem("UserUILanguage", selectedLang);
    },
    GetUserAjaxRequestOptions: function () {
        if (this.GetToken() != '') {
            return { headers: { 'Authorization': 'Basic ' + this.GetToken(), 'Language': this.GetUserLanguage() } };
        } else {
            return {};
        }
    },
    GetUserLayers: function () {
        try {
            var layers = localStorage.getItem('UserLayers');
            return JSON.parse(layers);
        } catch (e) {

        }
    },
    GetUserCountyCodes: function () {
        var abc = JSON.parse(localStorage.getItem('UserCounties'));
        return abc
    },
    GetUserDistrictCodes: function () {
        var abc = JSON.parse(localStorage.getItem('UserDistricts'));
        return abc
    },
    GetUserId: function () {
        try {
            var usderId = localStorage.getItem('UserId');
            return usderId;
        } catch (e) {
            console.log(e);
        }
    },
    GetUser: function () {
        try {
            var abc = JSON.parse(localStorage.getItem('SessionUser'));
            return abc;
        } catch (e) {
            return null;
        }
    }
}