<template>
  <div class="login">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-position="left" label-width="86px" style="margin-left: 15px; margin-right: 15px">
      <el-row :gutter="22">
        <el-col :span="24">
          <el-form-item label="身份证" prop="credentialNo">
            <el-input v-model="ruleForm.credentialNo" @input='credentialNoChange' maxlength="18" placeholder="请输入身份证号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="22">
        <el-col :span="15">
          <el-form-item label="验证码" prop="verifyCode">
            <el-input v-model="ruleForm.verifyCode" maxlength="4" placeholder="请输入验证码"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="9">
          <el-button round @click="verifyCode" :disabled="verifyCodeButtonDisabled">{{verifyCodeButtonName}}</el-button>
        </el-col>
      </el-row>

      <el-row :gutter="22">
        <el-col :span="24">
          <el-button round @click="toLogin" style="margin-left:36%">登录</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>


<script>
  import * as memberApiUrl from '@/util/api/memberApi'
  import {message} from "../../plugin/resetMessage";
  import { mapState, mapActions, mapMutations } from 'vuex'
  import {validateCredentialNo} from '../../util/js/validate';

  export default {
    name: 'login',
    data() {
      return {
        ruleForm: {
          credentialNo: '',
          verifyCode: '',
        },
        verifyCodeButtonDisabled: false,
        verifyCodeButtonName: '发送验证码',
        verifyCodeInterval: null,
        verifyCodeSecond: 60,
        verifyCodeSecondDefault: 60,
        credentialNoFirstValid: true,
        rules: {
          credentialNo:[
            {required:true,message:'请输入证件号码',trigger:'blur'},
            {validator: validateCredentialNo,trigger:'blur'}
          ],
          verifyCode:[{required:true,message:'请输入验证码',trigger:'blur'}]
        }
      }
    },
    created() {
    },
    methods: {
      credentialNoChange(){
        let _this = this;

        if (_this.credentialNoFirstValid && 18 == _this.ruleForm.credentialNo.length) {
          _this.credentialNoFirstValid = false;
          _this.$refs['ruleForm'].validateField('credentialNo', (valid) => {
          });
        } else if (!_this.credentialNoFirstValid) {
          _this.$refs['ruleForm'].validateField('credentialNo', (valid) => {
          });
        }
      },
      ...mapActions(["getVerifyCode", "doLogin"]),
      verifyCode() {
        let _this = this;
        _this.credentialNoFirstValid = false;
        _this.$refs['ruleForm'].validateField('credentialNo', (valid) => {
          if (!valid) {
            _this.verifyCodeButtonDisabled = true;
            let param = {
              url: memberApiUrl.getVerifyCode,
              data: {
                "type": "2",
                "credentialNo": this.ruleForm.credentialNo,
              },
              success: function () {
                // 验证码倒计时
                message.success("验证码发送成功");
                _this.setVerifyCodeInterval();
              },
              warningMethod: function(res) {
                _this.verifyCodeButtonDisabled = false;

                message.error({
                  duration: 3500,
                  showClose: true,
                  message: res.data.msg,
                });
              },
              error: function (err) {
                _this.verifyCodeButtonDisabled = false;

                if (err.message || err.response.data.error_msg) {
                  message.error({
                    duration: 1500,
                    showClose: true,
                    message: '获取验证码失败',
                  });
                }
              }
            }
            _this.getVerifyCode(param);
          } else {
            console.error('参数校验失败', valid);
            return false;
          }
        });
      },
      toLogin() {
        let _this = this;
        _this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            let param = {
              url: memberApiUrl.doLogin,
              data: {
                "code": this.ruleForm.verifyCode,
                "credentialNo": this.ruleForm.credentialNo,
              },
              success: function () {
                // message.success("登录成功");
              }
            }
            _this.doLogin(param);
          } else {
            console.error('参数校验失败', valid);
            return false;
          }
        });
      },
      setVerifyCodeInterval() {
        let _this = this
        _this.verifyCodeButtonName = _this.verifyCodeSecond + '秒';
        clearInterval(_this.verifyCodeInterval);
        _this.verifyCodeInterval = setInterval(function(){
            _this.verifyCodeSecond -= 1;
            if (_this.verifyCodeSecond <= 0) {
              clearInterval(_this.verifyCodeInterval);
              _this.verifyCodeButtonDisabled = false;
              _this.verifyCodeButtonName = '发送验证码';
              _this.verifyCodeSecond = _this.verifyCodeSecondDefault;
            } else {
              _this.verifyCodeButtonName = _this.verifyCodeSecond + '秒';
            }
        }, 1000);
      }
    },
    computed: {
      ...mapState({
        memberInfo: state => state.memberStore.memberInfo,
        isLogin: state => state.memberStore.isLogin,
      }),
    },
    mounted: function () {
    },
    destroyed() {
      clearInterval(this.verifyCodeInterval);
    }
  }
</script>


<style scoped>
</style>
