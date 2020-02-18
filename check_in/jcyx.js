/**
 机车游侠签到脚本

 ^http://api.jcyx2019.com:8080/userIntegral/getUsedIntegral url script-request-header jcyx.js
 */

var host = "api.jcyx2019.com:8080";
var url_sign = "http://" + host + "/integralRule/sign?userId=";
var method = "GET";
var app_name = "机车游侠";
var headers = {
    "Host": host,
    "Accept-Encoding": "gzip, deflate",
    "Accept": "*/*",
    "User-Agent": "LocoMotive/4.0.0 (iPhone; iOS 13.4; Scale/3.00)",
    "Accept-Language": "zh-Hans-HK;q=1",
    "Connection": "keep-alive",
};
var cookies_key = "jcyxToken_jcyx2019";
var cookies_id_key = "jcyxID_jcyx2019";

const is_request = typeof $request != "undefined"

if (is_request) {
    getToken();
    $done();
} else {
    headers['token'] = $prefs.valueForKey(cookies_key);
    $task.fetch({
        url: url_sign + $prefs.valueForKey(cookies_id_key),
        method: method, // Optional, default GET.
        headers: headers, // Optional.
    }).then(response => {
        body = JSON.parse(response.body);
        if (body.data) {
            $notify(app_name + "签到成功", "", body.data)
        } else {
            $notify(app_name + "签到失败!!!", body.msg, "")
        }
    }, reason => callback(reason.error, null, null))
}


function getToken() {
    if ($request.headers) {
        var cookies_value = $request.headers['token'];
        var cookies_id_value = getQueryString('userId');
        var curr_token = $prefs.valueForKey(cookies_key);
        var token = $prefs.setValueForKey(cookies_value, cookies_key);
        var user_id = $prefs.setValueForKey(cookies_id_value, cookies_id_key)
        if (curr_token != (undefined || null)) {
            if (curr_token != cookies_value) {
                if (token && user_id) {
                    $notify("更新" + app_name + "token成功","","")
                }else {
                    $notify("更新" + app_name + "token失败","","")
                }
            }
        } else {
            if (token && user_id) {
                $notify("首次写入" + app_name + "token成功","","")
            }else {
                $notify("首次写入" + app_name + "token失败","","")
            }
        }
    } else {
        $notify("写入" + app_name + "token失败!!", "", "配置错误, 无法读取请求头, ");
    }
}

function getQueryString(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = $request.url.substr($request.url.indexOf('?') + 1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    };
    return null;
}