
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// --- Page Imports ---
import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';
import SignupPage from '../pages/SignupPage';
import CatalogPage from '../pages/CatalogPage';
import MyTransactionsPage from '../pages/MyTransactionsPage';
import AllTransactionsPage from '../pages/AllTransactionsPage';
import UserManagementPage from '../pages/UserManagementPage';
import PermissionManagementPage from '../pages/PermissionManagementPage';
import TransactionManagementPage from '../pages/TransactionManagementPage';
import MainLayout from '../components/Layout/MainLayout';
// TODO: Create these page components
// import AdminDashboard from '../pages/AdminDashboard';

interface PrivateRouteProps {
    children: React.ReactElement;
    permissionRequired?: number;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, permissionRequired }) => {
    const { isAuthenticated, permissionLevel } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (permissionRequired !== undefined && permissionLevel < permissionRequired) {
        // Optional: Redirect to an 'Unauthorized' page or back to home
        return <Navigate to="/" replace />;
    }

    return children;
};

const AppRoutes = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/* Protected Routes */}
                <Route path="/" element={<PrivateRoute><MainLayout><CatalogPage /></MainLayout></PrivateRoute>} />
                <Route path="/catalog" element={<PrivateRoute><MainLayout><CatalogPage /></MainLayout></PrivateRoute>} />
                <Route path="/my-transactions" element={<PrivateRoute><MainLayout><MyTransactionsPage /></MainLayout></PrivateRoute>} />
                
                {/* Admin Routes */}
                <Route path="/admin/transactions" element={<PrivateRoute permissionRequired={99}><MainLayout><AllTransactionsPage /></MainLayout></PrivateRoute>} />
                <Route path="/admin/transaction-management" element={<PrivateRoute permissionRequired={99}><MainLayout><TransactionManagementPage /></MainLayout></PrivateRoute>} />
                <Route path="/admin/users" element={<PrivateRoute permissionRequired={99}><MainLayout><UserManagementPage /></MainLayout></PrivateRoute>} />
                <Route path="/admin/permissions" element={<PrivateRoute permissionRequired={99}><MainLayout><PermissionManagementPage /></MainLayout></PrivateRoute>} />
                {/* <Route path="/admin/*" element={<PrivateRoute permissionRequired={99}><AdminDashboard /></PrivateRoute>} /> */}

                {/* Fallback Route */}
                <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
