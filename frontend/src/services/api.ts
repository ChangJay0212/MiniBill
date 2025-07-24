// A simple wrapper for fetch to handle common cases

const BASE_URL = 'http://localhost:8881'; // Your Spring Boot backend is running on 8881

async function request(endpoint: string, options: RequestInit = {}) {
    const url = `${BASE_URL}${endpoint}`;

    const token = localStorage.getItem('token');

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const config: RequestInit = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(url, config);
        if (!response.ok) {
            // Try to parse error response from backend
            let errorMessage = response.statusText;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch {
                // If parsing fails, use status text
            }
            throw new Error(errorMessage);
        }
        
        // For DELETE or other methods that might not return a body
        if (response.status === 204 || response.headers.get('Content-Length') === '0') {
            return null;
        }
        
        // Check if response is actually JSON
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
            return response.json();
        } else {
            // If it's plain text, return the text
            const text = await response.text();
            return { message: text };
        }
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

// --- Auth Service ---

export const apiLogin = (account: string, password: string) => {
    return request('/auth/signin', {
        method: 'POST',
        body: JSON.stringify({ account, password }),
    });
};

export const apiSignup = (userData: any) => {
    return request('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(userData),
    });
};

// --- Catalog Service ---

export const apiGetCatalog = () => {
    return request('/catalog', {
        method: 'GET',
    });
};

export const apiCreateCatalog = (catalogData: { name: string; description: string; price: number; active: boolean }) => {
    return request('/catalog', {
        method: 'POST',
        body: JSON.stringify(catalogData),
    });
};

export const apiUpdateCatalog = (id: string, catalogData: { name?: string; description?: string; price?: number; active?: boolean }) => {
    return request(`/catalog/${id}`, {
        method: 'PUT',
        body: JSON.stringify(catalogData),
    });
};

export const apiDeleteCatalog = (id: string) => {
    return request(`/catalog/${id}`, {
        method: 'DELETE',
    });
};

// --- Transactions Service ---

export const apiCreateTransaction = (catalogId: string, amount: number, userId?: string) => {
    const params = new URLSearchParams({
        catalogId,
        amount: amount.toString()
    });
    
    if (userId) {
        params.append('userId', userId);
    }
    
    return request(`/transactions?${params.toString()}`, {
        method: 'POST',
    });
};

export const apiGetMyTransactions = () => {
    return request('/transactions/my', {
        method: 'GET',
    });
};

export const apiGetAllTransactions = () => {
    return request('/transactions', {
        method: 'GET',
    });
};

export const apiGetTransaction = (id: string) => {
    return request(`/transactions/${id}`, {
        method: 'GET',
    });
};

export const apiDeleteTransaction = (id: string) => {
    return request(`/transactions/${id}`, {
        method: 'DELETE',
    });
};

export const apiUpdateTransaction = (id: string, data: { catalogId?: string; amount?: number; isPaid?: boolean }) => {
    const params = new URLSearchParams();
    if (data.catalogId) params.append('catalogId', data.catalogId);
    if (data.amount !== undefined) params.append('amount', data.amount.toString());
    if (data.isPaid !== undefined) params.append('isPaid', data.isPaid.toString());
    
    return request(`/transactions/${id}?${params.toString()}`, {
        method: 'PUT',
    });
};

// --- User Service ---

export const apiGetAllUsers = () => {
    return request('/users', {
        method: 'GET',
    });
};

export const apiGetUser = (id: string) => {
    return request(`/users/${id}`, {
        method: 'GET',
    });
};

export const apiUpdateUser = (id: string, userData: { name?: string; email?: string; password?: string }) => {
    return request(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
    });
};

export const apiDeleteUser = (id: string) => {
    return request(`/users/${id}`, {
        method: 'DELETE',
    });
};

// --- Permission Service ---

export const apiGetAllPermissions = () => {
    return request('/permissions', {
        method: 'GET',
    });
};

export const apiCreatePermission = (level: number) => {
    return request(`/permissions?level=${level}`, {
        method: 'POST',
    });
};

export const apiAssignUserPermission = (userId: string, permissionId: string) => {
    return request(`/users/${userId}/permissions?permissionId=${permissionId}`, {
        method: 'POST',
    });
};

export const apiUpdateUserPermission = (userId: string, permissionId: string) => {
    return request(`/users/${userId}/permissions?permissionId=${permissionId}`, {
        method: 'PUT',
    });
};

export const apiGetUserPermission = (userId: string) => {
    return request(`/users/${userId}/permissions`, {
        method: 'GET',
    });
};

export const apiRemoveUserPermission = (userId: string) => {
    return request(`/users/${userId}/permissions`, {
        method: 'DELETE',
    });
};

export const apiGetAllUsersWithPermissions = () => {
    return request('/users/permissions/all', {
        method: 'GET',
    });
};