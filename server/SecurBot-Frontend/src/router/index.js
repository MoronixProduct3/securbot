import Vue from 'vue'
import Router from 'vue-router'

import Layout from '@/components/Layout.vue'
import Teleop from '@/components/pages/Teleop.vue'
import Patrol from '@/components/pages/Patrol.vue'
import Logs from '@/components/pages/Logs.vue'

Vue.use(Router)

/*
>>Current routing<<
The routing only start at the router link

>index.html
  │
  └─>APP.vue
      │
      └─>Layout
          │
          ├─>Navigation Bar
          │
          └─>Router-Link
              │
              ├─>Teleoperation Page
              │
              ├─>Patrol Page
              │
              └─>Log Page
*/

export default new Router({
  routes: [
    {
      path: '/',
      component: Layout,
      redirect: {
        name: "SecurBot Teleoperation"
      },
      children:[
        {
          path: "teleop",
          name: "SecurBot Teleoperation",
          component: Teleop,
          props: true
        },
        {
          path: "patrol",
          name: "SecurBot Patrol Planner",
          component: Patrol,
          props: true
        },
        {
          path: "logs",
          name: "SecurBot Event Logging",
          component: Logs,
          props: true
        },        
      ]
    }
  ]
})
