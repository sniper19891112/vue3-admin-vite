<template>
    <div class="navbar">
        <Hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container"
            @toggleClick="toggleSideBar" />

        <Breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

        <div class="right-menu">
            <template v-if="device !== 'mobile'">
                <Search id="header-search" class="right-menu-item" />

                <Screenfull id="screenfull" class="right-menu-item hover-effect" />
            </template>

            <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click" @command="handleCommand">
                <div class="avatar-wrapper">
                    <img :src="avatar + '?imageView2/1/w/80/h/80'" class="user-avatar" />
                    <el-icon class="el-icon-caret-bottom">
                        <caret-bottom />
                    </el-icon>
                </div>
                <template v-slot:dropdown>
                    <el-dropdown-menu>
                        <router-link to="/profile/index">
                            <el-dropdown-item>Profile</el-dropdown-item>
                        </router-link>
                        <router-link to="/">
                            <el-dropdown-item>Dashboard</el-dropdown-item>
                        </router-link>
                        <el-dropdown-item divided command="logout">
                            <span style="display:block;">Log Out</span>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    name: 'Navbar'
}
</script>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user'
import { useRouter, useRoute } from 'vue-router'
import { CaretBottom } from '@element-plus/icons-vue'
import Breadcrumb from '@/components/Breadcrumb/index.vue'
import Hamburger from '@/components/Hamburger/index.vue'
import Screenfull from '@/components/Screenfull/index.vue'
import Search from '@/components/HeaderSearch/index.vue'

const router = useRouter()
const route = useRoute()

const appStore = useAppStore()
const userStore = useUserStore()
const { sidebar, device } = storeToRefs(appStore)
const { avatar } = storeToRefs(userStore)

const handlers: Record<string, () => void> = {
    async logout() {
        await userStore.logout()
        router.push(`/login?redirect=${route.fullPath}`)
    }
}

function toggleSideBar() {
    appStore.toggleSideBar()
}
function handleCommand(command: string) {
    handlers[command] && handlers[command]()
}
</script>


<style lang="scss" scoped>
.navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

    .hamburger-container {
        line-height: 46px;
        height: 100%;
        float: left;
        cursor: pointer;
        transition: background 0.3s;
        -webkit-tap-highlight-color: transparent;

        &:hover {
            background: rgba(0, 0, 0, 0.025);
        }
    }

    .breadcrumb-container {
        float: left;
    }

    .errLog-container {
        display: inline-block;
        vertical-align: top;
    }

    .size-select-container {
        ::v-deep(div[class^="el-dropdown--"]) {
            height: 100%;
            display: flex;
            align-items: center;
        }
    }

    .right-menu {
        float: right;
        height: 100%;
        line-height: 50px;

        &:focus {
            outline: none;
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
                transition: background 0.3s;

                &:hover {
                    background: rgba(0, 0, 0, 0.025);
                }
            }
        }

        .avatar-container {
            margin-right: 30px;

            .avatar-wrapper {
                margin-top: 5px;
                position: relative;

                .user-avatar {
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                }

                .el-icon-caret-bottom {
                    cursor: pointer;
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }
    }
}
</style>
