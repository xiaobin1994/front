<template>
  <div class="home-view">
    <banner></banner>
    <menuTop @tabChange="tabChange"></menuTop>

    <Login v-if="currentIndex == 0"></Login>
    <company-member-input v-else-if="currentIndex == 1"></company-member-input>
    <member-single-input v-else="currentIndex == 2"></member-single-input>
  </div>
</template>


<script>
  import {mapState, mapActions, mapMutations} from 'vuex'

  import Banner from '../components/Banner'
  import MenuTop from '../components/MenuTop'
  import Login from '../components/login/Login'
  import CompanyMemberInput from '../components/member/CompanyMember'
  import MemberSingleInput from '../components/member/MemberSingle'

  export default {
    name: 'home-view',
    components: {Banner, MenuTop, Login, CompanyMemberInput, MemberSingleInput},
    data() {
      return {
        userOpenId: '',
        currentIndex: 0,
        menuTopName: 'first',
      }
    },
    computed: {
      // Getting Vuex State from store/modules/records
      ...mapState({
        events: state => state.records.events,
        isLogin: state => state.memberStore.isLogin,
      })
    },
    methods: {
      tabChange: function (res) {
        this.menuTopName = res;
        this.bodyToChange();
      },
      bodyToChange: function () {
        if ('second' === this.menuTopName) {
          this.currentIndex = 2;
        } else if ('first' === this.menuTopName) {
          if (this.isLogin) {
            this.currentIndex = 1;
          } else {
            this.currentIndex = 0;
          }
        } else {
          console.error('unknown value', this.menuTopName)
          this.currentIndex = 0;
        }
      }
    },
    mounted:function () {
      this.bodyToChange()
    },
    watch: {
      isLogin(newValue, oldValue) {
        this.bodyToChange();
      }
    }
  }
</script>


<style scoped>
</style>
