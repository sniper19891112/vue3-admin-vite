import { createRouter, createWebHistory, RouteRecordRaw, Router } from 'vue-router'

/* Layout */
import Layout from '@/layout/index.vue'
/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes: RouteRecordRaw[] = [
    {
        path: '/redirect',
        component: Layout,
        hidden: true,
        children: [
            {
                path: '/redirect/:path(.*)',
                component: () => import('@/views/redirect/index.vue')
            }
        ]
    },
    {
        path: '/login',
        component: () => import("@/views/login/index.vue"),
        hidden: true
    },
    {
        path: '/auth-redirect',
        component: () => import('@/views/login/auth-redirect.vue'),
        hidden: true
    },
    {
        path: '/404',
        component: () => import('@/views/error-page/404.vue'),
        hidden: true
    },
    {
        path: '/401',
        component: () => import('@/views/error-page/401.vue'),
        hidden: true
    },
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [
            {
                path: 'dashboard',
                component: () => import('@/views/dashboard/index.vue'),
                name: 'Dashboard',
                meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
            },
        ]
    },
]

export const asyncRoutes: RouteRecordRaw[] = [
    {
        path: '/permission',
        component: Layout,
        redirect: '/permission/page',
        alwaysShow: true, // will always show the root menu
        name: 'Permission',
        meta: {
            title: 'Permission',
            icon: 'lock',
            roles: ['admin', 'editor'] // you can set roles in root nav
        },
        children: [
            {
                path: 'page',
                component: () => import('@/views/permission/page.vue'),
                name: 'PagePermission',
                meta: {
                    title: 'Page Permission',
                    roles: ['admin'] // or you can only set roles in sub nav
                }
            },
            {
                path: 'directive',
                component: () => import('@/views/permission/directive.vue'),
                name: 'DirectivePermission',
                meta: {
                    title: 'Directive Permission'
                    // if do not set roles, means: this page does not require permission
                }
            },
            {
                path: 'role',
                component: () => import('@/views/permission/role.vue'),
                name: 'RolePermission',
                meta: {
                    title: 'Role Permission',
                    roles: ['admin']
                }
            }
        ]
    },
    { path: '/:pathMatch(.*)', redirect: '/404', hidden: true }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    scrollBehavior: () => ({ top: 0 }),
    routes: constantRoutes as RouteRecordRaw[]
})

type RouteRemoveHandler = ReturnType<Router["addRoute"]>

// 动态路由移除方法，通过addRoute增加的动态路由在退出时要清理
let asyncRemoveHandlers: RouteRemoveHandler[] = []

export function addRoute(route: RouteRecordRaw): RouteRemoveHandler {
    const handler = router.addRoute(route as RouteRecordRaw)
    asyncRemoveHandlers.push(handler)
    return handler
}

// 1、matcher在vue3中作为函数内部变量无法访问，addRoute方法返回值为移除路由方法
//    see https://github.com/vuejs/vue-router-next/issues/1237
// 2、虽然使用router.remoteRoute可以移除路由，但是方法需要移除的路由有name属性，
//    系统中的路由可以没有name，所以使用addRouter的返回值作为替代
export function resetRouter(): void {
    asyncRemoveHandlers.forEach(fn => fn())
    asyncRemoveHandlers = []
}

export default router