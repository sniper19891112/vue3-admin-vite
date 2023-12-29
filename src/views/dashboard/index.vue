<template>
    <div class="dashboard-container">
        <component :is="!roles.includes('admin') ? EditorDashboard : AdminDashboard" />
    </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store/modules/user'
import AdminDashboard from './admin/index.vue'
import EditorDashboard from './editor/index.vue'

const userStore = useUserStore()
const { roles } = storeToRefs(userStore)
console.log(roles.value);
</script>