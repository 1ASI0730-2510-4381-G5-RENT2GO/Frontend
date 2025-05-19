import { createRouter, createWebHistory } from "vue-router";

import AuthLayout from "@/shared/layouts/AuthLayout.vue";
import MainLayout from '@/shared/layouts/MainLayout.vue';

import Login from "@/domains/auth/views/Login.vue";
import Register from "@/domains/auth/views/Register.vue";
import ForgotPassword from "@/domains/auth/views/ForgotPassword.vue";
import ResetPassword from "@/domains/auth/views/ResetPassword.vue";
import VerifyCode from "@/domains/auth/views/VerifyCode.vue";

import ClientDashboard from '@/domains/client/views/DashboardView.vue';

import ProviderDashboard from '@/domains/provider/views/DashboardView.vue';

import DashboardView from "@/domains/admin/views/DashboardView.vue";
import ApprovalView from '@/domains/admin/views/ApprovalView.vue';
import UsersView from '@/domains/admin/views/UsersView.vue';
import CommissionsView from '@/domains/admin/views/CommissionsView.vue';


const routes = [
    {
        path: "/",
        component: AuthLayout,
        children: [
            { path: "", redirect: "/login" },
            { path: "login", name: "Login", component: Login },
            { path: "register", name: "Register", component: Register },
            { path: "forgot-password", name: "ForgotPassword", component: ForgotPassword },
            { path: "reset-password", name: "ResetPassword", component: ResetPassword },
            { path: "verify-code", name: "VerifyCode", component: VerifyCode },
        ],
    },
    {
        path: '/client',
        component: MainLayout,
        meta: {requiresAuth: true, role: 'client'},
        children: [
            {path: 'dashboard', component: ClientDashboard},
        ]
    },
    {
        path: '/provider',
        component: MainLayout,
        meta: {requiresAuth: true, role: 'provider'},
        children: [
            {path: 'dashboard', component: ProviderDashboard},
        ]
    },
    {
        path: '/admin',
        component: MainLayout,
        meta: {requiresAuth: true, role: 'admin'},
        children: [
            {path: 'dashboard', name: 'AdminDashboard', component: DashboardView, meta: { title: 'Dashboard' }},
            {path: 'vehicles', name: 'Vehicles', component: ApprovalView, meta: { title: 'Vehículos' }},
            {path: 'users', name: 'Users', component: UsersView, meta: { title: 'Usuarios' }},
            {path: 'commissions', name: 'Commissions', component: CommissionsView, meta: { title: 'Comisiones' }}
        ]
    },
    { path: "/:pathMatch(.*)*", redirect: "/login" },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;