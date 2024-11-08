import {type RouteRecordRaw, createRouter} from "vue-router"
import {history, flatMultiLevelRoutes} from "./helper"
import routeSettings from "@/config/route"

const Layouts = () => import("@/layouts/index.vue")

/**
 * 常驻路由
 * 除了 redirect/403/404/login 等隐藏页面，其他页面建议设置 Name 属性
 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/redirect",
    component: Layouts,
    meta: {
      hidden: true
    },
    children: [
      {
        path: ":path(.*)",
        component: () => import("@/views/redirect/index.vue")
      }
    ]
  },
  {
    path: "/403",
    component: () => import("@/views/error-page/403.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404.vue"),
    meta: {
      hidden: true
    },
    alias: "/:pathMatch(.*)*"
  },
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/",
    component: Layouts,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        name: "Dashboard",
        meta: {
          title: "首页",
          svgIcon: "dashboard",
          affix: true
        }
      }
    ]
  },
  {
    path: "/user-manage",
    component:
    Layouts,
    children:
      [
        {
          path: "/user-manage",
          component: () => import("@/views/user-manage/index.vue"),
          name: "UserManage",
          meta: {
            title: "账号管理",
            svgIcon: "user",
            keepAlive: true
          },
        },
      ]
  },
  {
    path: "/item-manage",
    component:
    Layouts,
    children:
      [
        {
          path: "/item-manage",
          component: () => import("@/views/item-manage/index.vue"),
          name: "ItemManage",
          meta: {
            title: "物品管理",
            svgIcon: "lost-item",
            keepAlive: true
          }
        },
      ]
  }
  ,
  {
    path: "/comment-manage",
    component:
    Layouts,
    children:
      [
        {
          path: "/comment-manage",
          component: () => import("@/views/comment-manage/index.vue"),
          name: "CommentManage",
          meta: {
            title: "评论管理",
            svgIcon: "comment",
            keepAlive: true
          }
        },
      ]
  }
  ,
  {
    path: "/notice-manage",
    component:
    Layouts,
    children:
      [
        {
          path: "/notice-manage",
          component: () => import("@/views/notice-manage/index.vue"),
          name: "NoticeManage",
          meta: {
            title: "通知管理",
            svgIcon: "notice",
            keepAlive: true
          }
        }
      ]
  },
  {
    path: "/category-manage",
    component:
    Layouts,
    children:
      [
        {
          path: "/category-manage",
          component: () => import("@/views/category-manage/index.vue"),
          name: "CategoryManage",
          meta: {
            title: "物品类型管理",
            svgIcon: "category",
            keepAlive: true
          },
        },
      ]
  },
  {
    path: "/file-manage",
    component:
    Layouts,
    children:
      [
        {
          path: "/file-manage",
          component: () => import("@/views/file-manage/index.vue"),
          name: "FileManage",
          meta: {
            title: "文件管理",
            svgIcon: "file",
            keepAlive: true
          },
        },
      ]
  },
  {
    path: "/menu",
    component:
    Layouts,
    redirect:
      "/menu/menu1",
    name:
      "Menu",
    meta:
      {
        title: "关于本站",
        svgIcon:
          "menu"
      }
    ,
    children: [
      {
        path: "menu1",
        component: () => {},
        redirect: "/menu/",
        name: "Menu1",
        meta: {
          title: "开发工具",
          svgIcon: "tools"
        },
        children: [
          {
            path: "https://element-plus.org/zh-CN/component/overview.html",
            component: () => {
            },
            name: "Link3",
            meta: {
              title: "ElementPlus",
              svgIcon: "tutorial"
            }
          },
          {
            path: "https://www.iconfont.cn/",
            component: () => {
            },
            name: "Link4",
            meta: {
              title: "icon网站",
              svgIcon: "document"
            }
          },
          {
            path: "https://juejin.cn/post/7089377403717287972",
            component: () => {
            },
            name: "Link1",
            meta: {
              title: "中文文档",
              svgIcon: "document"
            }
          },
          {
            path: "https://juejin.cn/column/7207659644487139387",
            component: () => {
            },
            name: "Link2",
            meta: {
              title: "新手教程",
              svgIcon: "tutorial"
            }
          }
        ]
      },
      {
        path: "https://github.com/hub6622/LostAndFound_front_back",
        component: () => {
        },
        name: "Link1",
        meta: {
          title: "Github",
          svgIcon: "github"
        }
      }
    ]
  }
  ]

    /**
     * 动态路由
     * 用来放置有权限 (Roles 属性) 的路由
     * 必须带有 Name 属性
     */
    export const dynamicRoutes: RouteRecordRaw[] = [
  // {
  //   path: "/permission",
  //   component: Layouts,
  //   redirect: "/permission/page",
  //   name: "Permission",
  //   meta: {
  //     title: "权限",
  //     svgIcon: "lock",
  //     roles: ["admin", "editor"], // 可以在根路由中设置角色
  //     alwaysShow: true // 将始终显示根菜单
  //   },
  //   children: [
  //     {
  //       path: "page",
  //       component: () => import("@/views/permission/page.vue"),
  //       name: "PagePermission",
  //       meta: {
  //         title: "页面级",
  //         roles: ["admin"] // 或者在子导航中设置角色
  //       }
  //     },
  //     {
  //       path: "directive",
  //       component: () => import("@/views/permission/directive.vue"),
  //       name: "DirectivePermission",
  //       meta: {
  //         title: "按钮级" // 如果未设置角色，则表示：该页面不需要权限，但会继承根路由的角色
  //       }
  //     }
  //   ]
  // }
]

const router = createRouter({
  history,
  routes: routeSettings.thirdLevelRouteCache ? flatMultiLevelRoutes(constantRoutes) : constantRoutes
})

/** 重置路由 */
export function resetRouter() {
  // 注意：所有动态路由路由必须带有 Name 属性，否则可能会不能完全重置干净
  try {
    router.getRoutes().forEach((route) => {
      const {name, meta} = route
      if (name && meta.roles?.length) {
        router.hasRoute(name) && router.removeRoute(name)
      }
    })
  } catch {
    // 强制刷新浏览器也行，只是交互体验不是很好
    window.location.reload()
  }
}

export default router
