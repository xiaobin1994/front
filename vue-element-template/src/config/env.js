let publicApi = ""
let url = window.location.origin || window.location

let force; // 强制使用哪个配置
let urlMatchProfile = url.match(/de|te|pe|127.0.0.1|localhost/);
let urlHost = null;
if (null != urlMatchProfile && typeof urlMatchProfile != 'undefined') {
  urlHost = urlMatchProfile[0];
}

switch (force || urlHost) {
    case "127.0.0.1":
      publicApi = "http://localhost:7012/healthExamination";
      break;
    case "localhost":
        publicApi = "http://localhost:7012/healthExamination";
        break;
    case "de":
        publicApi = "http://localhost:7012/healthExamination";
        break;
    case "te":
        publicApi = "http://localhost:7012/healthExamination";
        break;
    case "pe":
        publicApi = "http://localhost:7012/healthExamination";
        break;
    default:
      publicApi = "http://localhost:7012/healthExamination";
      break;
}

export {
    publicApi,
}
