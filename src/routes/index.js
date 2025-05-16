import { createRouter, createWebHistory } from 'vue-router'
import HomeContentComponent from '../public/pages/home-content.component.vue'
import PageNotFoundComponent from '../public/pages/page-not-found.component.vue'

const routes = [
    { path: '/', component: HomeContentComponent },

    {
        path: '/gallery',
        component: () => import('../domain/components/vehicule-gallery-view.component.vue')
    },
    {
        path: '/rentals',
        component: () => import('../domain/components/my-rentals-view.component.vue')
    },
    {
        path: '/add-vehicle',
        component: () => import('../domain/components/add-view-vehicule.component.vue')
    },

    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: PageNotFoundComponent
    }
]


export const router = createRouter({
    history: createWebHistory(),
    routes
})
