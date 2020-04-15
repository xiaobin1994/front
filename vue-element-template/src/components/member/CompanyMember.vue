<template>
  <div class="company-member">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="86px" label-position="left" style="margin: 0px 15px 15px 18px">
      <el-row :gutter="22">
        <el-col :span="24">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="ruleForm.name" maxlength="6"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="22">
        <el-col :span="24">
          <el-form-item label="身份证" prop="credentialNo">
            <el-input v-model="ruleForm.credentialNo" maxlength="18"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="22">
        <el-col :span="24">
          <el-form-item label="企业" prop="companyName">
            <el-input v-model="ruleForm.companyName" maxlength="30" placeholder="请输入企业名称"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="22">
        <el-col :span="24">
          <el-form-item label="预约日期" prop="appointmentDate">
            <el-date-picker v-model="ruleForm.appointmentDate" type="date" :picker-options="pickerOptions"
                            @change="appointmentDateChange" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                            :editable="false" placeholder="请选择"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="22">
        <el-col :span="24">
          <el-form-item label="时间段" prop="appointmentTime">
            <el-select v-model="ruleForm.appointmentTime" placeholder="请选择">
              <el-option v-for="item in ruleForm.appointmentTimes" :key="item.reserveTime" :label="item.reserveTime" :value="item.scheduleId"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="22">
        <el-col :span="24">
          <el-form-item label="是否有卡" prop="hasCard">
            <el-select v-model="ruleForm.hasCard" placeholder="请选择">
              <el-option key="1" label="是" :value="1"></el-option>
              <el-option key="2" label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="22">
        <el-col :span="24">
          <el-button type="primary" @click="save" style="margin-left:33%">立即预约</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>


<script>
  import * as appointmentApiUrl from '@/util/api/appointmentApi'
  import {appointmentIgnoreDates, appointmentMinDay}  from '@/util/appointmentIgnoreDate'
  import * as dateUtil from '@/util/dateUtil.js';
  import {message} from "../../plugin/resetMessage";
  import { mapState, mapActions, mapMutations } from 'vuex'
  import {validateCredentialNo} from '../../util/js/validate';

  export default {
    name: 'company-member',
    data() {
      return {
        ruleForm: {
          name: '',
          credentialNo: '',
          companyName: '',
          appointmentDate: '',
          appointmentTime: '',
          hasCard: '',
          appointmentTimes: [],
          phone: '',
        },
        rules: {
          name:[{required:true,message:'请输入姓名',trigger:'blur'}],
          credentialNo:[
            {required:true,message:'请输入身份证号',trigger:'blur'},
            {validator: validateCredentialNo,trigger:'blur'}
          ],
          companyName:[{required:true,message:'请输入企业名称',trigger:'blur'}],
          appointmentDate:[{required:true,message:'请选择预约日期',trigger:'change'}],
          appointmentTime:[{required:true,message:'请选择时间段',trigger:'change'}],
          hasCard:[{required:true,message:'请选择是否有卡',trigger:'change'}]
        },
        pickerOptions: {
          disabledDate(time) {
            // 1.不能选择以前的时间;  2.不能选择指定日期（src/util/appointmentIgnoreDate.js#appointmentIgnoreDates）;
            // 3.不能选择近期日期（src/util/appointmentIgnoreDate.js#appointmentMinDay）
            let tempTime = dateUtil.dateFormat(time, "yyyy-MM-dd");
            return time.getTime() < dateUtil.addDate(new Date(), appointmentMinDay) - 8.64e7 || appointmentIgnoreDates.indexOf(tempTime) != -1;
          }
        }
      }
    },
    created() {
    },
    methods: {
      ...mapActions(["appointmentSave","findScheduleList"]),
      save() {
        let _this = this;
        _this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            let param = {
              url: appointmentApiUrl.save,
              data: {
                "credentialNo": _this.ruleForm.credentialNo,
                "isCard": _this.ruleForm.hasCard,
                "name": _this.ruleForm.name,
                "org": _this.ruleForm.companyName,
                "phoneNum": _this.ruleForm.phone,
                "reserveDate": _this.ruleForm.appointmentDate,
                "scheduleId": _this.ruleForm.appointmentTime,
                "type": 1,
              },
              success: function () {
                _this.formReset()
                message.success("体检预约成功");
              }
            }
            _this.appointmentSave(param);
          } else {
            console.error('参数校验失败', valid);
            return false;
          }
        });
      },
      appointmentDateChange() {
        let _this = this;
        // 时间段清空
        _this.ruleForm.appointmentTime = null;

        let param = {
          url: appointmentApiUrl.findScheduleList,
          data:{
            "reserveDate": this.ruleForm.appointmentDate,
          },
          success: function(obj){
            _this.ruleForm.appointmentTimes = obj;
          }
        }
        _this.findScheduleList(param);
      },
      formReset() {
        let _this = this;
        _this.$refs['ruleForm'].resetFields();
        _this.populateMemberInfo()
        _this.ruleForm.appointmentTimes = []
      },
      populateMemberInfo() {
        let _this = this;
        if (null != _this.memberInfo && typeof _this.memberInfo != 'undefined' &&
          _this.isLogin) {
          _this.ruleForm.name = _this.memberInfo.name;
          _this.ruleForm.credentialNo = _this.memberInfo.credentialNo;
          _this.ruleForm.companyName = _this.memberInfo.companyName;
          _this.ruleForm.phone = _this.memberInfo.phoneNumber;
        }
      }
    },
    computed: {
      ...mapState({
        memberInfo: state => state.memberStore.memberInfo,
        isLogin: state => state.memberStore.isLogin,
      }),
    },
    mounted: function () {
      let _this = this;

      // 如果客户已登录并存在对应的客户信息，赋值默认值
      _this.populateMemberInfo()

      // 给预约日期添加默认值
      let currentdate = new Date();
      let currentDateStr = dateUtil.dateFormat(currentdate, "yyyy-MM-dd");
      if (-1 == appointmentIgnoreDates.indexOf(currentDateStr) &&
        currentdate > dateUtil.addDate(currentdate, appointmentMinDay) - 8.64e7) {
        _this.ruleForm.appointmentDate = currentDateStr;
        // 加载预约日期对应的时间段
        this.appointmentDateChange();
      }
    }
  }
</script>


<style scoped>
</style>
