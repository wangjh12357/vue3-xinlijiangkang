<template>
  <el-aside :width="isCollapse ? '64px' : '264px'">
    <el-menu default-active="2" class="menu-class" :collapse="isCollapse" :collapse-transition="false">
      <div class="brand">
        <el-image v-if="!isCollapse" :src="iconUrl" alt="logo" class="logo" />
        <el-image v-else :src="iconUrl" alt="logo" class="logo1" />
        <div v-show="!isCollapse" class="info-card">
          <h1 class="info-title">心理健康AI助手</h1>
          <p class="info-subtitle">管理后台</p>
        </div>
      </div>
      <el-menu-item @click="selectMenu" v-for="item in router.options.routes[0].children" :key="item.path" :index="item.path">
        <el-icon><component :is="item.meta.icon" /></el-icon>
        <span>{{item.meta.title}}</span>
      </el-menu-item>

    </el-menu>
  </el-aside>
</template>
<script setup>
import {useRouter} from 'vue-router'
import { useAdminStore } from '@/stores/admin'
import { computed } from 'vue'

const adminStore = useAdminStore()
const isCollapse = computed(() => adminStore.isCollapse)

const router = useRouter()
const selectMenu = (key)=>{
  const currentRoute = router.options.routes[0]
  // console.log(`${currentRoute.path}/${key.index}`)
  router.push(`${currentRoute.path}/${key.index}`)
}
const iconUrl = new URL('@/assets/images/机器人.png', import.meta.url).href

</script>

<style lang="scss" scoped>
.menu-class {
  height: 100%;

  .brand {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background-color: #fff;
  border-bottom: 1px solid #e5e7eb;
  .info-card {
    .info-title {
      font-size: 20px;
      font-weight: bold;
      color: #1f2937;
      margin-bottom: 5px;
    }
    .info-subtitle {
      font-size: 14px;
      color: #6b7280;
    }
  }
}
.logo {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}
.logo1 {
  width: 40px;
  height: 40px;
}
}
</style>