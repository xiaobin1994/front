<template>
  <div class="member-single">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-position="left" label-width="86px" style="margin: 0px 15px 15px 18px">
      <el-row :gutter="22">
        <el-col :span="24">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入姓名" maxlength="6"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="22">
        <el-col :span="24">
          <el-form-item label="身份证" prop="credentialNo">
            <el-input v-model="ruleForm.credentialNo" placeholder="请输入身份证号" maxlength="18"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="22">
        <el-col :span="24">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="ruleForm.phone" placeholder="请输入手机号" maxlength="11"></el-input>
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
          <el-button round @click="save" style="margin-left:33%">提交预约信息</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>


<script>
  import * as appointmentApiUrl from '@/util/api/appointmentApi'
  import {appointmentIgnoreDates, appointmentMinDay}  from '@/util/appointmentIgnoreDate'
  import {message} from "../../plugin/resetMessage";
  import * as dateUtil from '@/util/dateUtil.js';
  import { mapState, mapActions, mapMutations } from 'vuex'
  import {validatePhone,validateCredentialNo} from '../../util/js/validate';

  export default {
    name: 'member-single',
    data() {
      return {
        ruleForm: {
          name: '',
          phone: '',
          credentialNo: '',
          appointmentDate: '',
          appointmentTime: '',
          hasCard: '',
          appointmentTimes: [],
        },
        rules: {
          name:[{required:true,message:'请输入姓名',trigger:'blur'}],
          credentialNo:[
            {required:true,message:'请输入身份证号',trigger:'blur'},
            {validator: validateCredentialNo,trigger:'blur'}
          ],
          phone:[
            {required:true,message:'请输入手机号',trigger:'blur'},
            {validator:validatePhone,trigger:'blur'}
          ],
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
    created () {
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
                "org": "",
                "phoneNum": _this.ruleForm.phone,
                "reserveDate": _this.ruleForm.appointmentDate,
                "scheduleId": _this.ruleForm.appointmentTime,
                "type": 2,
              },
              success: function () {
                _this.formReset();
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
        _this.ruleForm.appointmentTimes = []
      }
    },
    mounted () {
      let _this = this;
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
