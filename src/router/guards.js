import { getStoredUser, getAuthToken, isAuthenticated, getCurrentUser } from "@/auth/services/auth.service";

export async function authGuard(to, from, next) {
    console.log(`[authGuard] start navigation to ${to.fullPath}`);

    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const requiredRole = to.matched.find(record => record.meta.role)?.meta.role;
    console.log(`[authGuard] requiresAuth: ${requiresAuth}, requiredRole: ${requiredRole}`);

    if (!requiresAuth) {
        console.log(`[authGuard] no auth required, allowing access`);
        return next();
    }

    const token = getAuthToken();
    let user = getStoredUser();
    const userIsAuthenticated = isAuthenticated();
    console.log(`[authGuard] token exists: ${!!token}, user in storage: ${!!user}, isAuthenticated: ${userIsAuthenticated}`);

    if (token && !user) {
        console.log(`[authGuard] token present but no user, refreshing...`);
        try {
            const freshUser = await getCurrentUser();
            console.log(`[authGuard] freshUser response:`, freshUser);
            if (freshUser) user = freshUser;
        } catch (err) {
            console.error('Error al refrescar usuario en guard:', err);
        }
    }

    if (!userIsAuthenticated || !token || !user) {
        console.log(`[authGuard] not authenticated or missing user, redirecting to login`);
        return next({
            path: '/login',
            query: { redirect: to.fullPath }
        });
    }

    if (requiredRole) {
        if (user.role !== requiredRole) {
            console.log(`[authGuard] role mismatch: required=${requiredRole}, userRole=${user.role}`);
            switch (user.role) {
                case 'provider':
                    console.log(`[authGuard] redirecting to /provider/dashboard`);
                    return next('/provider/dashboard');
                case 'client':
                    console.log(`[authGuard] redirecting to /client/home`);
                    return next('/client/home');
                default:
                    console.log(`[authGuard] unknown role ${user.role}, redirecting to login`);
                    return next('/login');
            }
        }
    }

    console.log(`[authGuard] all checks passed, allowing access`);
    next();
}
