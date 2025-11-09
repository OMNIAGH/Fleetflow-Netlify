import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Core components (loaded on first render)
import { Load, Driver, Invoice, Expense } from './types';
import { getDrivers } from './services/apiService';

// Lazy load auth pages (Chunk: auth)
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const RegisterDriver = lazy(() => import('./pages/RegisterDriver'));
const RegisterCompany = lazy(() => import('./pages/RegisterCompany'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));
const Profile = lazy(() => import('./pages/Profile'));
const Logout = lazy(() => import('./pages/Logout'));

// Lazy load dashboard layout components (separate chunks for better splitting)
const Sidebar = lazy(() => import('./components/Sidebar'));
const Header = lazy(() => import('./components/Header'));
const BottomNav = lazy(() => import('./components/BottomNav'));

// Lazy load company-specific components
const CompanyDashboard = lazy(() => import('./components/CompanyDashboard'));
const CompanyDriverManagement = lazy(() => import('./components/CompanyDriverManagement'));
const CompanySettings = lazy(() => import('./components/CompanySettings'));
const CompanyReports = lazy(() => import('./components/CompanyReports'));
const CompanyLoadManagement = lazy(() => import('./components/CompanyLoadManagement'));
const CompanyMetrics = lazy(() => import('./components/CompanyMetrics'));

// Lazy load main dashboard (separate chunks for better optimization)
const Dashboard = lazy(() => import('./components/Dashboard'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const DriverDashboard = lazy(() => import('./components/DriverDashboard'));
const DynamicDriverDashboard = lazy(() => import('./components/DynamicDriverDashboard'));
const DriverMigrationAssistant = lazy(() => import('./components/DriverMigrationAssistant'));

// Lazy load features (Chunks: specific features)
const Loads = lazy(() => import('./components/Loads'));
const Map = lazy(() => import('./components/Map'));
const Chat = lazy(() => import('./components/Chat'));
const Documents = lazy(() => import('./components/Documents'));
const Drivers = lazy(() => import('./components/Drivers'));
const FuelOptimization = lazy(() => import('./components/FuelOptimization'));
const LoadHistoryEnhanced = lazy(() => import('./components/loadHistory/LoadHistoryEnhanced'));
const LoadBoard = lazy(() => import('./components/LoadBoard'));
const Invoicing = lazy(() => import('./components/Invoicing'));

// External service
import { gpsService } from './components/GpsTracker';

// PWA Components (COMMENTED OUT TEMPORARILY FOR DEBUG)
// import { PWAFeatures } from './src/components/PWAComponents.tsx';

// Real-time Components (COMMENTED OUT TEMPORARILY FOR DEBUG)  
// import { RealtimeMonitor } from './src/components/RealtimeMonitor.tsx';

// Analytics Components (COMMENTED OUT TEMPORARILY FOR DEBUG)
// import { AnalyticsDashboard } from './src/hooks/useAnalytics.tsx';

// Mock initial data
const initialLoads: Load[] = [
    { id: 1, loadNumber: 'L-2025-01234', customer: 'GlobalTranz', origin: 'Chicago, IL', destination: 'Dallas, TX', status: 'In Transit', driver: 'J. Smith', eta: '07/28 @ 14:00' },
    { id: 2, loadNumber: 'L-2025-01235', customer: 'C.H. Robinson', origin: 'Atlanta, GA', destination: 'Miami, FL', status: 'Delivered', driver: 'Jane S.', eta: '07/26 @ 18:00' },
    { id: 3, loadNumber: 'L-2025-01236', customer: 'Knight-Swift', origin: 'Seattle, WA', destination: 'Boise, ID', status: 'Assigned', driver: 'M. Rodriguez', eta: '07/29 @ 09:00' },
    { id: 4, loadNumber: 'L-2025-01237', customer: 'Total Quality', origin: 'Los Angeles, CA', destination: 'Phoenix, AZ', status: 'Pending', driver: 'N/A', eta: '-' },
    { id: 5, loadNumber: 'L-2025-01238', customer: 'JB Hunt', origin: 'Denver, CO', destination: 'Omaha, NE', status: 'Delivered', driver: 'J. Smith', eta: '07/25 @ 11:00' },
    { id: 6, loadNumber: 'L-2025-01239', customer: 'Coyote', origin: 'Miami, FL', destination: 'Jacksonville, FL', status: 'Delivered', driver: 'M. Rodriguez', eta: '07/27 @ 15:00' },
];

const initialExpenses: Expense[] = [
    { id: 1, loadId: 2, type: 'Fuel', description: 'Stop in Tifton, GA', amount: 380.55, date: '2024-07-25' },
    { id: 2, loadId: 2, type: 'Toll', description: 'Florida Turnpike', amount: 45.20, date: '2024-07-26' },
    { id: 3, loadId: 5, type: 'Fuel', description: 'Fuel in North Platte, NE', amount: 450.00, date: '2024-07-24' },
    { id: 4, loadId: 5, type: 'Maintenance', description: 'Tire repair', amount: 125.00, date: '2024-07-24' },
    { id: 5, loadId: 6, type: 'Fuel', description: 'Topped off in Ocala, FL', amount: 275.80, date: '2024-07-27' },
];


// Dashboard Layout Component (Protected)
const DashboardLayout: React.FC = () => {
    const { userProfile, isCompanyOwner, isCompanyManager, isDriverCompany, isDriverIndependent } = useAuth();
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [loads, setLoads] = useState<Load[]>(initialLoads);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
    
    // Determine view based on user role using AuthContext methods
    const isDriverView = isDriverCompany() || isDriverIndependent() || userProfile?.role === 'driver';
    const isAdminView = userProfile?.role === 'admin';
    const isOwnerView = isCompanyOwner();
    const isManagerView = isCompanyManager();
    const isCompanyView = isOwnerView || isManagerView;
    
    // Log for debugging
    console.log('DashboardLayout - User profile:', {
        role: userProfile?.role,
        company_id: userProfile?.company_id,
        isDriverView,
        isAdminView,
        isOwnerView,
        isManagerView
    });

    // Connect to the GPS service for real-time driver updates
    useEffect(() => {
        let unsubscribe: () => void;

        const setupGpsService = async () => {
            // Fetch the initial state of drivers
            const initialDrivers = await getDrivers();
            // Initialize the GPS service with all drivers
            gpsService.initialize(initialDrivers);
            // Subscribe to live updates from the service
            unsubscribe = gpsService.subscribe(setDrivers);
        };

        setupGpsService();

        // Cleanup function
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
            gpsService.stop();
        };
    }, []); // Empty dependency array ensures this runs only once


    const handleGenerateInvoice = (loadsToInvoice: Load[], invoiceNumber: string, dueDate: string) => {
        const totalAmount = loadsToInvoice.reduce((sum, load) => sum + (load.id * 500 + 1000), 0);
        const newInvoice: Invoice = {
            id: `inv-${Date.now()}`,
            invoiceNumber,
            loads: loadsToInvoice,
            totalAmount,
            issueDate: new Date().toLocaleDateString(),
            dueDate,
        };
        setInvoices(prev => [newInvoice, ...prev]);
    };

    const renderPage = () => {
        const PageComponent = () => {
            // If user is a driver and trying to access dashboard, show DynamicDriverDashboard
            if (currentPage === 'dashboard' && isDriverView) {
                return <DynamicDriverDashboard />;
            }
            
            switch (currentPage) {
                case 'dashboard':
                    if (isAdminView) {
                        return <AdminDashboard loads={loads} setLoads={setLoads} drivers={drivers} setDrivers={setDrivers} />;
                    }
                    if (isOwnerView || isManagerView) {
                        // Company dashboard with filtered data
                        const companyDrivers = drivers.filter(d => d.company_id === userProfile?.company_id);
                        const companyLoads = loads.filter(l => 
                            l.driver && companyDrivers.find(d => d.name === l.driver)
                        );
                        return <Dashboard loads={companyLoads} drivers={companyDrivers} />;
                    }
                    return <Dashboard loads={loads} drivers={drivers} />;
                case 'loads':
                    if (isOwnerView || isManagerView) {
                        const companyDrivers = drivers.filter(d => d.company_id === userProfile?.company_id);
                        const companyLoads = loads.filter(l => 
                            l.driver && companyDrivers.find(d => d.name === l.driver)
                        );
                        return <Loads loads={companyLoads} setLoads={setLoads} />;
                    }
                    return <Loads loads={loads} setLoads={setLoads} />;
                case 'map':
                    if (isOwnerView || isManagerView) {
                        const companyDrivers = drivers.filter(d => d.company_id === userProfile?.company_id);
                        return <Map drivers={companyDrivers} />;
                    }
                    return <Map drivers={drivers} />;
                case 'chat':
                    return <Chat />;
                case 'documents':
                    return <Documents />;
                case 'drivers':
                    if (isOwnerView || isManagerView) {
                        const companyDrivers = drivers.filter(d => d.company_id === userProfile?.company_id);
                        return <Drivers drivers={companyDrivers} />;
                    }
                    return <Drivers drivers={drivers} />;
                case 'fuel':
                    return <FuelOptimization />;
                case 'history':
                    return <LoadHistoryEnhanced />;
                case 'loadboard':
                    return <LoadBoard />;
                case 'invoicing':
                    if (isOwnerView || isManagerView) {
                        const companyDrivers = drivers.filter(d => d.company_id === userProfile?.company_id);
                        const companyLoads = loads.filter(l => 
                            l.driver && companyDrivers.find(d => d.name === l.driver)
                        );
                        const companyExpenses = expenses.filter(e => 
                            drivers.find(d => d.id === e.loadId && d.company_id === userProfile?.company_id)
                        );
                        return <Invoicing loads={companyLoads} invoices={invoices} expenses={companyExpenses} onGenerateInvoice={handleGenerateInvoice} />;
                    }
                    return <Invoicing loads={loads} invoices={invoices} expenses={expenses} onGenerateInvoice={handleGenerateInvoice} />;
                default:
                    if (isAdminView) {
                        return <AdminDashboard loads={loads} setLoads={setLoads} drivers={drivers} setDrivers={setDrivers} />;
                    }
                    if (isOwnerView || isManagerView) {
                        const companyDrivers = drivers.filter(d => d.company_id === userProfile?.company_id);
                        const companyLoads = loads.filter(l => 
                            l.driver && companyDrivers.find(d => d.name === l.driver)
                        );
                        return <Dashboard loads={companyLoads} drivers={companyDrivers} />;
                    }
                    return <Dashboard loads={loads} drivers={drivers} />;
            }
        };

        return (
            <Suspense fallback={
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-copper"></div>
                </div>
            }>
                <PageComponent />
            </Suspense>
        );
    };

    return (
        <div className="h-screen flex overflow-hidden bg-brand-dark text-brand-text-primary antialiased">
            <Suspense fallback={
                <div className="w-64 bg-brand-dark-secondary animate-pulse"></div>
            }>
                <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
            </Suspense>

            <div className="flex flex-col w-0 flex-1 overflow-hidden md:ml-64">
                <Suspense fallback={
                    <div className="h-16 bg-brand-dark-secondary animate-pulse"></div>
                }>
                    <Header isAdminView={isAdminView} isOwnerView={isOwnerView} isManagerView={isManagerView} isDriverView={isDriverView} />
                </Suspense>
                <main className="flex-1 relative overflow-y-auto focus:outline-none p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-brand-dark via-brand-dark to-brand-dark-secondary">
                    {/* Add a bottom padding to account for the BottomNav on mobile */}
                    <div className="pb-16 md:pb-0 animate-fade-in" key={currentPage}>
                        {renderPage()}
                    </div>
                </main>
            </div>
            
            <Suspense fallback={
                <div className="fixed bottom-0 left-0 right-0 h-16 bg-brand-dark-secondary animate-pulse md:hidden"></div>
            }>
                <BottomNav currentPage={currentPage} setCurrentPage={setCurrentPage} />
            </Suspense>
            
            {/* Driver Migration Assistant - para usuarios que necesitan configuración */}
            <Suspense fallback={null}>
                <DriverMigrationAssistant 
                    onMigrationComplete={() => {
                        // Refresh page after successful migration
                        window.location.reload();
                    }}
                />
            </Suspense>
        </div>
    );
};

// Redirect component for role-based routing
const RoleBasedRedirect: React.FC = () => {
    const { userProfile, isCompanyOwner, isCompanyManager, isDriverCompany, isDriverIndependent, loading } = useAuth();

    // Show loading spinner while authentication is being determined
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-brand-dark">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-copper mx-auto mb-4"></div>
                    <p className="text-brand-text-primary">Verificando autenticación...</p>
                </div>
            </div>
        );
    }

    // Get current user from auth context to prevent premature redirect
    const { user } = useAuth();
    
    // If not loading but no user at all, redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    
    // If not loading, user exists but no userProfile yet, show loading state
    if (!loading && user && !userProfile) {
        return (
            <div className="flex items-center justify-center h-screen bg-brand-dark">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-copper mx-auto mb-4"></div>
                    <p className="text-brand-text-primary">Cargando perfil de usuario...</p>
                </div>
            </div>
        );
    }

    // Admin users go to admin dashboard
    if (userProfile.role === 'admin') {
        return <Navigate to="/admin" replace />;
    }

    // Owner users go to owner dashboard
    if (isCompanyOwner()) {
        return <Navigate to="/owner" replace />;
    }

    // Manager users go to manager dashboard
    if (isCompanyManager()) {
        return <Navigate to="/manager" replace />;
    }

    // Driver users (any type) go to driver dashboard
    if (isDriverCompany() || isDriverIndependent() || userProfile.role === 'driver') {
        return <Navigate to="/driver" replace />;
    }

    // Default fallback to main dashboard
    return <Navigate to="/" replace />;
};

// Company Dashboard Layout Component (Protected)
const CompanyDashboardLayout: React.FC = () => {
    const { isCompanyOwner, isCompanyManager } = useAuth();
    
    return (
        <div className="h-screen flex overflow-hidden bg-brand-dark text-brand-text-primary antialiased">
            <Suspense fallback={
                <div className="w-64 bg-brand-dark-secondary animate-pulse"></div>
            }>
                <Sidebar currentPage="dashboard" setCurrentPage={() => {}} />
            </Suspense>

            <div className="flex flex-col w-0 flex-1 overflow-hidden md:ml-64">
                <Suspense fallback={
                    <div className="h-16 bg-brand-dark-secondary animate-pulse"></div>
                }>
                    <Header isAdminView={false} isOwnerView={isCompanyOwner()} isManagerView={isCompanyManager()} isDriverView={false} />
                </Suspense>
                <main className="flex-1 relative overflow-y-auto focus:outline-none p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-brand-dark via-brand-dark to-brand-dark-secondary">
                    <div className="pb-16 md:pb-0 animate-fade-in">
                        <Suspense fallback={
                            <div className="flex items-center justify-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-copper"></div>
                            </div>
                        }>
                            <CompanyDashboard />
                        </Suspense>
                    </div>
                </main>
            </div>
            
            <Suspense fallback={
                <div className="fixed bottom-0 left-0 right-0 h-16 bg-brand-dark-secondary animate-pulse md:hidden"></div>
            }>
                <BottomNav currentPage="dashboard" setCurrentPage={() => {}} />
            </Suspense>
        </div>
    );
};

// Main App Component with Router
const App: React.FC = () => {
    // States for PWA and monitoring features - COMMENTED OUT FOR DEBUG
    // const [showRealtimeMonitor, setShowRealtimeMonitor] = useState(false);
    // const [showAnalytics, setShowAnalytics] = useState(false);

    return (
        <BrowserRouter>
            <AuthProvider>
                {/* PWA Features, Realtime Monitor, and Analytics - COMMENTED OUT FOR DEBUG */}
                {/* <PWAFeatures /> */}
                
                {/* Real-time Monitor Toggle Button - COMMENTED OUT */}
                {/* <button
                    onClick={() => setShowRealtimeMonitor(!showRealtimeMonitor)}
                    className="fixed bottom-20 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200"
                    title="Toggle Real-time Monitor"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                </button> */}
                
                {/* Analytics Toggle Button - COMMENTED OUT */}
                {/* <button
                    onClick={() => setShowAnalytics(!showAnalytics)}
                    className="fixed bottom-36 right-4 z-50 bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition-all duration-200"
                    title="Toggle Analytics Dashboard"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                </button> */}
                
                {/* Real-time Monitor Panel - COMMENTED OUT */}
                {/* {showRealtimeMonitor && (
                    <div className="fixed top-4 right-4 z-40 w-80 max-h-[80vh] overflow-y-auto">
                        <RealtimeMonitor 
                            showAdvancedMetrics={true}
                        />
                    </div>
                )} */}
                
                {/* Analytics Dashboard Panel - COMMENTED OUT */}
                {/* {showAnalytics && (
                    <div className="fixed top-4 left-4 z-40 w-80 max-h-[80vh] overflow-y-auto">
                        <AnalyticsDashboard 
                            showErrors={true}
                        />
                    </div>
                )} */}
                
                <Routes>
                    {/* Public Routes with Suspense */}
                    <Route path="/login" element={
                        <Suspense fallback={
                            <div className="flex items-center justify-center h-screen">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-copper"></div>
                            </div>
                        }>
                            <Login />
                        </Suspense>
                    } />
                    <Route path="/register" element={
                        <Suspense fallback={
                            <div className="flex items-center justify-center h-screen">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-copper"></div>
                            </div>
                        }>
                            <Register />
                        </Suspense>
                    } />
                    <Route path="/register-driver" element={
                        <Suspense fallback={
                            <div className="flex items-center justify-center h-screen">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-copper"></div>
                            </div>
                        }>
                            <RegisterDriver />
                        </Suspense>
                    } />
                    <Route path="/register-company" element={
                        <Suspense fallback={
                            <div className="flex items-center justify-center h-screen">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-copper"></div>
                            </div>
                        }>
                            <RegisterCompany />
                        </Suspense>
                    } />
                    <Route path="/auth/callback" element={
                        <Suspense fallback={
                            <div className="flex items-center justify-center h-screen">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-copper"></div>
                            </div>
                        }>
                            <AuthCallback />
                        </Suspense>
                    } />
                    <Route path="/logout" element={
                        <Suspense fallback={
                            <div className="flex items-center justify-center h-screen">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-copper"></div>
                            </div>
                        }>
                            <Logout />
                        </Suspense>
                    } />

                    {/* Protected Routes with Suspense */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <RoleBasedRedirect />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Suspense fallback={
                                    <div className="flex items-center justify-center h-screen">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-copper"></div>
                                    </div>
                                }>
                                    <Profile />
                                </Suspense>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute allowedRoles={['admin', 'owner', 'manager']}>
                                <Suspense fallback={
                                    <div className="flex items-center justify-center h-screen">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-copper"></div>
                                    </div>
                                }>
                                    <DashboardLayout />
                                </Suspense>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/owner"
                        element={
                            <ProtectedRoute allowedRoles={['owner']}>
                                <Suspense fallback={
                                    <div className="flex items-center justify-center h-screen">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-copper"></div>
                                    </div>
                                }>
                                    <CompanyDashboardLayout />
                                </Suspense>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/manager"
                        element={
                            <ProtectedRoute allowedRoles={['manager']}>
                                <Suspense fallback={
                                    <div className="flex items-center justify-center h-screen">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-copper"></div>
                                    </div>
                                }>
                                    <CompanyDashboardLayout />
                                </Suspense>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/driver"
                        element={
                            <ProtectedRoute allowedRoles={['driver', 'driver_company', 'driver_independent']}>
                                <Suspense fallback={
                                    <div className="flex items-center justify-center h-screen">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-copper"></div>
                                    </div>
                                }>
                                    <DashboardLayout />
                                </Suspense>
                            </ProtectedRoute>
                        }
                    />

                    {/* Redirect unknown routes to dashboard */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;