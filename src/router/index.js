import { createRouter, createWebHistory } from "vue-router";
import { authGuard } from './guards';

import AuthLayoutComponent from "@/shared/layouts/auth-layout.component.vue";
import MainLayoutComponent from '@/shared/layouts/main-layout.component.vue';

import UserAccountViewComponent from "@/shared/pages/user-account-view.component.vue";
import NotFoundViewComponent from "@/shared/pages/not-found-view.component.vue";

import LoginViewComponentView from "@/auth/views/login-view.component.vue";
import RegisterViewComponentView from "@/auth/views/register-view.component.vue";
import ForgotPasswordViewComponentView from "@/auth/views/forgot-password-view.component.vue";
import ResetPasswordViewComponentView from "@/auth/views/reset-password-view.component.vue";
import VerifyCodeViewComponentView from "@/auth/views/verify-code-view.component.vue";

import HomeViewComponent from '@/client/pages/home-view.component.vue';
import SearchViewComponent from '@/client/pages/search-view.component.vue';
import ClientReservationsViewComponent from '@/client/pages/reservations-view.component.vue';
import ClientReservationDetailViewComponent from '@/client/pages/reservation-detail-view.component.vue';
import ReservationEditViewComponent from "@/client/pages/reservation-edit-view.component.vue";
import PaymentMethodsViewComponent from '@/client/pages/payment-methods-view.component.vue';
import ClientVehicleDetailViewComponent from '@/client/pages/vehicle-detail-view.component.vue';
import CheckoutViewComponent from '@/client/pages/checkout-view.component.vue';

import DashboardViewComponent from '@/provider/pages/dashboard-view.component.vue';
import VehiclesViewComponent from '@/provider/pages/vehicles-view.component.vue';
import AddVehicleViewComponent from '@/provider/pages/add-vehicle-view.component.vue';
import EditVehicleViewComponent from '@/provider/pages/edit-vehicle-view.component.vue';
import ProviderReservationsViewComponent from '@/provider/pages/reservations-view.component.vue';
import ProviderReservationDetailViewComponent from '@/provider/pages/reservation-detail-view.component.vue';
import EarningsViewComponent from '@/provider/pages/earnings-view.component.vue';

const routes = [
    {
        path: "/",
        component: AuthLayoutComponent,
        children: [
            { path: "", redirect: "/login" },
            { path: "login", name: "Login", component: LoginViewComponentView },
            { path: "register", name: "Register", component: RegisterViewComponentView },
            { path: "forgot-password", name: "ForgotPassword", component: ForgotPasswordViewComponentView },
            { path: "reset-password", name: "ResetPassword", component: ResetPasswordViewComponentView },
            { path: "verify-code", name: "VerifyCode", component: VerifyCodeViewComponentView },
        ],
    },

    {
        path: '/client',
        component: MainLayoutComponent,
        meta: {requiresAuth: true, role: 'client'},
        children: [
            { path: '', redirect: 'home' },
            { path: 'home', name: 'clientHome', component: HomeViewComponent, meta: { title: 'navigation.home' }},
            { path: 'search', name: 'SearchCars', component: SearchViewComponent, meta: { title: 'navigation.search' }},
            { path: 'reservations', name: 'MyReservations', component: ClientReservationsViewComponent, meta: { title: 'navigation.my_reservations' }},
            { path: 'payment-methods', name: 'PaymentMethods', component: PaymentMethodsViewComponent, meta: { title: 'navigation.payment_methods' }},
            { path: 'vehicle/:id', name: 'vehicle-detail', component: ClientVehicleDetailViewComponent, meta: { title: 'navigation.vehicle_detail' }},
            // Mantener la ruta anterior para compatibilidad con links existentes
            { path: 'car/:id', redirect: to => ({ path: `/client/vehicle/${to.params.id}`, query: to.query }) },
            { path: 'checkout/:id', name: 'checkout', component: CheckoutViewComponent, meta: { title: 'navigation.checkout' }},
            { path: 'my-reservations/:id', name: 'ClientReservationDetail', component: ClientReservationDetailViewComponent, meta: { title: 'navigation.reservation_detail' }},
            { path: 'my-reservations/:id/edit', name: 'ClientReservationEdit', component: ReservationEditViewComponent, meta: { title: 'navigation.edit_reservation' }},
            { path: 'account', name: 'ClientAccount', component: UserAccountViewComponent, meta: { title: 'navigation.my_account' }},
        ]
    },

    {
        path: '/provider',
        component: MainLayoutComponent,
        meta: {requiresAuth: true, role: 'provider'},
        children: [
            { path: '', redirect: 'dashboard' },
            { path: 'dashboard', name: 'providerDashboard', component: DashboardViewComponent, meta: { title: 'navigation.dashboard' }},
            { path: 'vehicles', name: 'providerVehicles', component: VehiclesViewComponent, meta: { title: 'navigation.my_vehicles' }},
            { path: 'vehicles/add', name: 'providerAddVehicle', component: AddVehicleViewComponent, meta: { title: 'navigation.add_vehicle' }},
            { path: 'vehicles/edit/:id', name: 'providerEditVehicle', component: EditVehicleViewComponent, meta: { title: 'navigation.edit_vehicle' }},
            { path: 'reservations', name: 'providerReservations', component: ProviderReservationsViewComponent, meta: { title: 'navigation.reservations' }},
            { path: 'reservations/:id', name: 'ProviderReservationDetail', component: ProviderReservationDetailViewComponent, meta: { title: 'navigation.reservation_detail' }},
            { path: 'earnings', name: 'providerEarnings', component: EarningsViewComponent, meta: { title: 'navigation.earnings' }},
            { path: 'account', name: 'ProviderAccount', component: UserAccountViewComponent, meta: { title: 'navigation.my_account' }},
        ]
    },

    {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: NotFoundViewComponent,
        meta: { title: 'navigation.not_found' }
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(authGuard);

export default router;
