<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <div style="display: flex">
        <div class="menu-right">
          {{ enterpriseName || '上海爱汇健康科技有限公司' }}
        </div>
        <div>
          <el-dropdown class="avatar-container" trigger="click">
            <div class="avatar-wrapper">
              <span class="el-dropdown-link" style="display: flex;justify-content: center;align-items: center;">
                 <img :src="logoutImg" style="width:18px;height:18px;margin-right:5px;" />
              </span>
               <span class="el-dropdown-link">
                登出<i class="el-icon-caret-bottom"/>
              </span>
            </div>
            <el-dropdown-menu slot="dropdown" class="user-dropdown">
              <el-dropdown-item @click.native="logout">
                 <span style="display:block;">登出</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device',
      'enterpriseName'
    ])
  },
  data(){
    return{
      logoutImg: require('@/assets/logout.png'),
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    logout() {
      this.$confirm("确认退出吗?", "提示", {
        cancelButtonClass: 'btn-custom-cancel',
        closeOnClickModal: false
      }).then(() => {
          this.$store.dispatch('user/logout')
          this.$router.push(`/login?redirect=${this.$route.fullPath}`)
        }).catch(() => {});
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .menu-right {
      margin-right: 30px;
      font-size: 14px;
      color: #606266;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 20px;
      display: flex;
      line-height: 40px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          margin-left:5px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
