<template>
  <el-form ref="ruleFormRef"  :model="formData">
    <el-row :gutter="24">
      <template v-for="item in formItemAttrs" :key="item.prop">
        <el-col v-bind="item.col">
          <el-form-item :label="item.label" :prop="item.prop">
            <component v-model="formData[item.prop]" :is="isComp(item.comp)" :placeholder="item.placeholder">
              <template v-if="item.comp === 'select'">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="opt in item.options" :label="opt.label" :value="opt.value"></el-option>
              </template>
            </component>
          </el-form-item>
        </el-col>
      </template>
    </el-row>

  </el-form>
  <el-button type="primary" @click="handleSearch">查询</el-button>
  <el-button @click="handleReset(ruleFormRef)">重置</el-button>
</template>
<script setup>
import { ref, reactive, computed } from 'vue'

const props = defineProps({
  formItem: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['search'])

const formItemAttrs = computed(() => {
  const { formItem } = props
  formItem.forEach(item => {
    item.col = { xs: 24, sm: 12, md: 8, lg: 6, xl: 6 }
  })
  return formItem
})
// 定义表单数据
const ruleFormRef = ref(null)
const formData = reactive({})

const isComp = (comp) => {
  if (comp === 'input') {
    return 'el-input'
  }
  if (comp === 'select') {
    return 'el-select'
  }
}
//查询按钮
const handleSearch = () => {
  // console.log(formData)
  emit('search', formData)
}
//重置按钮
const handleReset = (formE) => {
  if(!formE) return
  formE.resetFields()
  emit('search', formData)
}
</script>