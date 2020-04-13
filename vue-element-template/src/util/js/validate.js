//是否身份证
export function validateCredentialNo(rule, value, callback) {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  if (value == '' || typeof value == 'undefined' || value == null) {
    callback();
  } else {
    if ((!reg.test(value)) && value != '') {
      callback(new Error('请输入正确的身份证号'));
    } else {
      callback();
    }
  }
}


//是否手机号码
export function validatePhone(rule, value, callback) {
  const reg = /^[1][0-9]{10}$/;
  if (value == '' || typeof value == 'undefined' || value == null) {
    callback();
  } else {
    if ((!reg.test(value)) && value != '') {
      callback(new Error('请输入正确的手机号'));
    } else {
      callback();
    }
  }
}
