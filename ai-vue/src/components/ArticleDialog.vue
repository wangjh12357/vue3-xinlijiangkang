<template>
  <el-dialog :title="isEmit ? '编辑文章' : '新增文章'" v-model="dialogVisible" width="50%" @close="handleClose">
    <el-form :model="formData" ref="formRef" :rules="rules" label-width="120px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入文章标题" maxlength="200" show-word-limit clearable />
      </el-form-item>
      <el-form-item label="所属分类" prop="categoryId">
        <el-select v-model="formData.categoryId" placeholder="请选择分类">
          <el-option v-for="item in props.categories" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="文章摘要" prop="summary">
        <el-input v-model="formData.summary" placeholder="请输入文章摘要(可选)" :rows="4" maxlength="1000" show-word-limit
          clearable type="textarea" />
      </el-form-item>
      <el-form-item label="标签" prop="tags">
        <el-select v-model="formData.tagArray" placeholder="请输入文章标签(逗号分隔)" multiple filterable allow-create
          width="100%">
          <el-option v-for="item in commonTags" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="封面图片">
        <div class="cover-upload">
          <el-upload class="avatar-uploader" action="#" :before-upload="beforeUpload"
            :http-request="handleUploadRequest" accept="image/*" :show-file-list="false">
            <div v-if="!imgUrl" class="cover-placeholder">
              <p>点击上传封面</p>
            </div>
            <img v-else :src="imgUrl" alt="" class="cover-image">
          </el-upload>
          <div v-if="imgUrl" class="cover-remove">
            <el-button type="danger" size="mini" @click="removeCover"> 删除封面</el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <RichTextEditor v-model="formData.content" placeholder="请输入文章内容" :maxCharCount="5000"
          @change="handleContentChange" @create="handleEditorCreated" min-height="400px" />
      </el-form-item>
    </el-form>
    <div v-if="btnPreview">
      <h3>内容预览</h3>
      <div v-html="formData.content"></div>
    </div>
    <template #footer>
      <el-button @click="btnPreview = !btnPreview">{{ btnPreview ? '隐藏预览' : '预览效果' }}</el-button>
      <el-button @click="handleClose">取消</el-button>
      <el-button @click="handleSubmit" :loading="loading">{{ isEmit ? '更新文章' : '创建文章' }}</el-button>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, computed, reactive, nextTick, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { uploadFile } from '@/api/admin'
import { fileBaseUrl } from '@/config/index'
import RichTextEditor from '@/components/RichTextEditor.vue'
import { createArticle } from '@/api/admin'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  categories: {
    type: Array,
    default: () => []
  },
  article: {
    type: Object,
    default: null
  }
})
const emit = defineEmits(['update:modelValue', 'success'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const isEmit = computed(() => !!props.article?.id)

//监听编辑数据
watch(() => props.article, (newVal) => {
  if (newVal) {
    nextTick(() => {
      //编辑
      Object.assign(formData, newVal)
      businessId.value = newVal.id
      imgUrl.value = fileBaseUrl + newVal.coverImage
    })

  }
})

const handleClose = () => {
  //重置表单
  formRef.value.resetFields()
  //重置ID
  businessId.value = null
  //重置分类
  formData.tagArray = []
  //重置图片
  removeCover()
  emit('update:modelValue', false)
}
// 表单数据
const formData = reactive({
  "title": "",
  "content": "",
  "coverImage": "",
  "categoryId": null,
  "summary": "",
  "tags": "",
  "id": ""
})
const rules = reactive({
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { max: 200, message: '文章标题最多200个字符', trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: '请选择分类', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' },
    { max: 5000, message: '文章内容最多5000个字符', trigger: 'blur' }
  ],
})

const commonTags = [
  '情绪管理', '焦虑', '抑郁', '压力', '睡眠',
  '冥想', '正念', '放松', '心理健康', '自我成长',
  '人际关系', '工作压力', '学习方法', '生活技巧'
]
//上传
const imgUrl = ref('')
//上传前的操作
const beforeUpload = (file) => {
  //针对上传前的文件进行处理
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('上传封面图片仅支持jpg/png格式')
    return false
  }
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isLt5M) {
    ElMessage.error('上传封面图片大小不能超过5MB')
    return false
  }
  return true
}
const businessId = ref(null)
const handleUploadRequest = async ({ file }) => {
  //uid生成
  businessId.value = crypto.randomUUID()
  const res = await uploadFile(file, {
    businessId: businessId.value

  })
  //拼接完整的图片地址
  imgUrl.value = `${fileBaseUrl}${res.filePath}`
  formData.coverImage = res.filePath
}
//删除封面
const removeCover = () => {
  imgUrl.value = ''
  formData.coverImage = ''
}
//富文本
const handleContentChange = (data) => {
  console.log(data)
  formData.content = data.html
}

const editorInstance = ref(null)
const handleEditorCreated = (editor) => {
  editorInstance.value = editor
  if (formData.content && editor) {
    nextTick(() => {
      editorInstance.value.setHtml(formData.content)
    })
  }
}
const btnPreview = ref(false)

//提交
const formRef = ref()
const loading = ref(false)
const handleSubmit = () => {
  formRef.value.validate((valid, fields) => {
    if (valid) {
      loading.value = true
    }
    const submitData = {
      ...formData,
      tags: formData.tagArray.join(',')
    }
    delete submitData.tagArray

    createArticle(submitData).then(res => {
      loading.value = false
      emit('success')
    })
  })
}
</script>
<style scoped lang="scss">
.cover-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 200px;
  height: 120px;
  background: #f6f8fa;
  color: #8b949e;
}

.cover-image {
  width: 200px;
  height: 120px;
  display: block;
}
</style>
