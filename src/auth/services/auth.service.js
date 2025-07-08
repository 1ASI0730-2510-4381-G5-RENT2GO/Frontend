import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://rent2go-backend.onrender.com/api';

const authAPI = axios.create({
    baseURL: `${API_BASE_URL}/auth`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

authAPI.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

authAPI.interceptors.response.use(
    response => response,
    error => {
        const status = error.response?.status;
        const url = error.config?.url || '';
        const exemptPaths = ['/login', '/register', '/refresh-token', '/me'];

        if (status === 401 &&
            !exemptPaths.some(path => url.includes(path)) &&
            window.location.pathname !== '/login') {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export const register = async (userData, isOAuth = false) => {
    try {
        const endpoint = isOAuth ? '/register/oauth' : '/register';

        // Formatear los datos según lo que espera el backend
        const userDataFormatted = {
            Email: userData.email,
            Password: userData.password,
            ConfirmPassword: userData.confirmPassword,
            Name: userData.name,
            Role: userData.role,
            Phone: userData.phone,
            DNI: userData.dni
        };

        // Si es proveedor, añadir licencia de conducir
        if (userData.role === 'provider' && userData.driverLicense) {
            userDataFormatted.DriverLicense = userData.driverLicense;
        }

        const response = await authAPI.post(endpoint, userDataFormatted);

        return {
            success: true,
            data: response.data,
            message: response.data.message || 'Registro exitoso'
        };
    } catch (error) {
        console.error('Registration Error:', error);

        if (error.response) {
            console.error('Error de respuesta del servidor:', {
                status: error.response.status,
                headers: error.response.headers,
                data: error.response.data
            });

            const errorMessage = error.response.data?.message ||
                                error.response.data?.error ||
                                `Error del servidor: ${error.response.status}`;
            throw new Error(errorMessage);
        } else if (error.request) {
            console.error('No se recibió respuesta del servidor:', error.request);
            throw new Error('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
        } else {
            console.error('Error de configuración de la solicitud:', error.message);
            throw new Error(`Error al procesar la solicitud: ${error.message}`);
        }
    }
};

export const registerWithProvider = async (provider) => {
    try {
        if (typeof window === 'undefined') {
            throw new Error('OAuth solo disponible en el navegador');
        }

        const providerUrls = {
            google: `${API_BASE_URL}/auth/google`,
            facebook: `${API_BASE_URL}/auth/facebook`,
            twitter: `${API_BASE_URL}/auth/twitter`
        };

        const authUrl = providerUrls[provider];
        if (!authUrl) {
            throw new Error('Proveedor OAuth no válido');
        }

        // Abrir ventana de OAuth
        const popup = window.open(
            authUrl,
            'oauth',
            'width=500,height=600,scrollbars=yes'
        );

        return new Promise((resolve, reject) => {
            const checkClosed = setInterval(() => {
                if (popup.closed) {
                    clearInterval(checkClosed);
                    reject(new Error('Autenticación cancelada'));
                }
            }, 1000);

            // Escuchar mensaje del popup
            const messageHandler = (event) => {
                if (event.origin !== window.location.origin) return;

                clearInterval(checkClosed);
                popup.close();
                window.removeEventListener('message', messageHandler);

                if (event.data.success) {
                    resolve(event.data);
                } else {
                    reject(new Error(event.data.error || 'Error en OAuth'));
                }
            };

            window.addEventListener('message', messageHandler);
        });
    } catch (error) {
        console.error('OAuth Error:', error);
        throw new Error(error.message || 'Error en autenticación OAuth');
    }
};

export const login = async (credentials) => {
    try {
        if (!credentials || (!credentials.email && !credentials.Email) || (!credentials.password && !credentials.Password)) {
            throw new Error('Credenciales incompletas. Se requiere email y contraseña.');
        }

        const loginData = {
            email: credentials.email || credentials.Email || '',
            password: credentials.password || credentials.Password || ''
        };

        console.log('Enviando datos de login:', JSON.stringify(loginData));

        // Validar que ambos campos tengan contenido
        if (!loginData.email || !loginData.password) {
            throw new Error('Credenciales incompletas. Se requiere email y contraseña.');
        }

        const response = await authAPI.post('/login', loginData);

        if (response.data.token) {
            localStorage.setItem('authToken', response.data.token);
            // Normalize user object and map DocumentId to documentId
            const rawUser = response.data.user || response.data;

            console.log('Datos de perfil recibidos:', rawUser);
            console.log('Imagen de perfil:', rawUser.profileImage || rawUser.profile_image);

            const userData = {
                ...rawUser,
                profilePicture: rawUser.profileImage || rawUser.profile_image || null,
                // Otros mapeos
                documentId: rawUser.documentId ?? rawUser.DocumentId,
                dni: rawUser.dni ?? rawUser.Dni,
                phone: rawUser.phone ?? rawUser.Phone,
                address: rawUser.address ?? rawUser.Address,
                driverLicense: rawUser.driverLicense ?? rawUser.DriverLicense ?? rawUser.driver_license ?? rawUser.licenseNumber ?? rawUser.LicenseNumber ?? rawUser.license_number ?? '',
                licenseNumber: rawUser.licenseNumber ?? rawUser.LicenseNumber ?? rawUser.license_number ?? rawUser.driverLicense ?? rawUser.DriverLicense ?? rawUser.driver_license ?? ''
            };
            localStorage.setItem('user', JSON.stringify(userData));
            return {
                success: true,
                data: response.data,
                user: userData,
                message: 'Login exitoso'
            };
        } else {
            throw new Error('No se recibió token en la respuesta');
        }
    } catch (error) {
        console.error('Login Error:', error);
        throw new Error(error.response?.data?.message || 'Error en el login');
    }
};

export const loginWithProvider = async (provider) => {
    try {
        return await registerWithProvider(provider); // Mismo flujo OAuth
    } catch (error) {
        console.error('OAuth Login Error:', error);
        throw new Error(error.message || 'Error en login OAuth');
    }
};

export const verifyEmail = async (token) => {
    try {
        const response = await authAPI.post('/verify-email', { token });

        return {
            success: true,
            data: response.data,
            message: response.data.message || 'Email verificado exitosamente'
        };
    } catch (error) {
        console.error('Email Verification Error:', error);

        const errorMessage = error.response?.data?.message ||
            error.response?.data?.error ||
            'Error en la verificación';

        throw new Error(errorMessage);
    }
};

export const resendVerification = async (email) => {
    try {
        const response = await authAPI.post('/resend-verification-code', { email });

        return {
            success: true,
            data: response.data,
            message: response.data.message || 'Verification code resent'
        };
    } catch (error) {
        console.error('Resend Verification Error:', error);

        const errorMessage = error.response?.data?.message ||
            error.response?.data?.error ||
            'Error al reenviar verificación';

        throw new Error(errorMessage);
    }
};

export const checkEmailExists = async (email) => {
    try {
        const response = await authAPI.post('/check-email', { email });

        return {
            exists: response.data.exists,
            isOAuth: response.data.isOAuth || false,
            provider: response.data.provider || null
        };
    } catch (error) {
        console.error('Check Email Error:', error);
        return { exists: false, isOAuth: false, provider: null };
    }
};

export const forgotPassword = async (email) => {
    try {
        const response = await authAPI.post('/forgot-password', { email });

        return {
            success: true,
            data: response.data,
            message: response.data.message || 'Email de recuperación enviado'
        };
    } catch (error) {
        console.error('Forgot Password Error:', error);

        const errorMessage = error.response?.data?.message ||
            error.response?.data?.error ||
            'Error al enviar email de recuperación';

        throw new Error(errorMessage);
    }
};

export const resetPassword = async (token, newPassword) => {
    try {
        const response = await authAPI.post('/reset-password', {
            token,
            password: newPassword
        });

        return {
            success: true,
            data: response.data,
            message: response.data.message || 'Contraseña actualizada exitosamente'
        };
    } catch (error) {
        console.error('Reset Password Error:', error);

        const errorMessage = error.response?.data?.message ||
            error.response?.data?.error ||
            'Error al resetear contraseña';

        throw new Error(errorMessage);
    }
};

export const verifyCode = async ({ email, code }) => {
    try {
        const response = await authAPI.post('/verify-code', { email, code });
        return {
            success: true,
            data: response.data,
            message: response.data.message || 'Code verified successfully'
        };
    } catch (error) {
        console.error('Verify Code Error:', error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Error verifying code';
        throw new Error(errorMessage);
    }
};

export const logout = () => {

    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    return { success: true };
};

export const refreshToken = async () => {
    try {
        const response = await authAPI.post('/refresh-token');

        if (response.data.token) {
            localStorage.setItem('authToken', response.data.token);
        }

        return response.data;
    } catch (error) {
        console.error('Refresh Token Error:', error);
        logout(); // Si falla el refresh, hacer logout
        throw error;
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await authAPI.get('/me');
        const rawUser = response.data.user || response.data;

        // Agregar logs para depuración
        console.log('Datos de usuario recibidos en getCurrentUser:', rawUser);

        // Log de todas las propiedades para encontrar dónde está la imagen
        console.log('Todas las propiedades del usuario:');
        for (const key in rawUser) {
            console.log(`${key}: ${rawUser[key]}`);
        }

        const possibleImageFields = ['profileImage', 'profile_image', 'profilePicture', 'profile_picture', 'avatar', 'image', 'photo', 'picture'];
        let foundImagePath = null;

        for (const field of possibleImageFields) {
            if (rawUser[field]) {
                console.log(`Encontrada imagen en campo '${field}': ${rawUser[field]}`);
                foundImagePath = rawUser[field];
                break;
            }
        }

        console.log('Imagen de perfil encontrada:', foundImagePath);

        const userObj = {
            ...rawUser,
            profilePicture: foundImagePath || rawUser.profileImage || rawUser.profile_image || null,
            documentId: rawUser.documentId ?? rawUser.DocumentId,
            dni: rawUser.dni ?? rawUser.Dni,
            phone: rawUser.phone ?? rawUser.Phone,
            address: rawUser.address ?? rawUser.Address,
            driverLicense: rawUser.driverLicense ?? rawUser.DriverLicense ?? rawUser.driver_license ?? rawUser.licenseNumber ?? rawUser.LicenseNumber ?? rawUser.license_number ?? '',
            licenseNumber: rawUser.licenseNumber ?? rawUser.LicenseNumber ?? rawUser.license_number ?? rawUser.driverLicense ?? rawUser.DriverLicense ?? rawUser.driver_license ?? ''
        };
        localStorage.setItem('user', JSON.stringify(userObj));
        return userObj;
    } catch (error) {
        const storedUser = getStoredUser();
        return storedUser;
    }
};

// ✅ ACTUALIZAR PERFIL
export const updateProfile = async (profileData) => {
    try {
        const payload = {
            Name: profileData.fullName || profileData.name,
            Phone: profileData.phone,
            Address: profileData.address,
            Dni: profileData.dni,
            DriverLicense: profileData.driverLicense,
            CompanyName: profileData.companyName,
            TaxId: profileData.taxId
        };
        const response = await authAPI.put('/profile', payload);

        const updatedUser = response.data;
        localStorage.setItem('user', JSON.stringify(updatedUser));

        return {
            success: true,
            data: updatedUser,
            message: 'Perfil actualizado exitosamente'
        };
    } catch (error) {
        console.error('Update Profile Error:', error);

        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Error al actualizar perfil';

        throw new Error(errorMessage);
    }
};

export const changePassword = async (currentPassword, newPassword) => {
    try {
        const response = await authAPI.put('/change-password', {
            currentPassword,
            newPassword
        });

        return {
            success: true,
            data: response.data,
            message: response.data.message || 'Contraseña cambiada exitosamente'
        };
    } catch (error) {
        console.error('Change Password Error:', error);

        const errorMessage = error.response?.data?.message ||
            error.response?.data?.error ||
            'Error al cambiar contraseña';

        throw new Error(errorMessage);
    }
};

export const uploadProfileImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    console.log('Enviando imagen al servidor...');

    const response = await authAPI.post('/profile-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });

    console.log('Respuesta de subida de imagen:', response.data);

    return response.data;
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('authToken');
};

export const getStoredUser = () => {
    const userJson = localStorage.getItem('user');
    if (!userJson || userJson === 'undefined') {
        localStorage.removeItem('user');
        return null;
    }
    try {
        return JSON.parse(userJson);
    } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
        return null;
    }
};

export const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

export default {
    register,
    registerWithProvider,
    login,
    loginWithProvider,
    verifyEmail,
    resendVerification,
    checkEmailExists,
    forgotPassword,
    resetPassword,
    logout,
    refreshToken,
    getCurrentUser,
    updateProfile,
    changePassword,
    isAuthenticated,
    getStoredUser,
    getAuthToken,
    verifyCode,
    uploadProfileImage
};

