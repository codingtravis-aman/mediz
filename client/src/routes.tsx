import { Route, Switch } from 'wouter';
import { lazy, Suspense } from 'react';
import { Skeleton } from './common/ui/skeleton';

// Lazy-loaded components
const Home = lazy(() => import('./features/dashboard/home'));
const Medications = lazy(() => import('./features/medications/medications'));
const MedicationDetails = lazy(() => import('./features/medications/medication-details'));
const Prescriptions = lazy(() => import('./features/prescriptions/prescriptions'));
const ScanPrescription = lazy(() => import('./features/prescriptions/scan-prescription'));
const Reminders = lazy(() => import('./features/reminders/reminders'));
const NotFound = lazy(() => import('./pages/not-found'));

// Pharmacy components
const Pharmacies = lazy(() => import('./features/pharmacy/pharmacies'));
const PharmacyDetail = lazy(() => import('./features/pharmacy/pharmacy-detail'));
const PharmacyOrder = lazy(() => import('./features/pharmacy/pharmacy-order'));
const PharmacyOrders = lazy(() => import('./features/pharmacy/pharmacy-orders'));
const PharmacyOrderDetail = lazy(() => import('./features/pharmacy/pharmacy-order-detail'));

// Onboarding components
const SplashScreen = lazy(() => import('./features/onboarding/splash-screen'));
const LanguageSelection = lazy(() => import('./features/onboarding/language-selection'));
const Register = lazy(() => import('./features/onboarding/register'));
const Login = lazy(() => import('./features/onboarding/login'));
const ForgotPassword = lazy(() => import('./features/onboarding/forgot-password'));
const ProfileSetup = lazy(() => import('./features/onboarding/profile-setup'));
const Permissions = lazy(() => import('./features/onboarding/permissions'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<div className="p-4"><Skeleton className="h-screen" /></div>}>
      <Switch>
        {/* Onboarding routes */}
        <Route path="/onboarding" component={SplashScreen} />
        <Route path="/onboarding/language" component={LanguageSelection} />
        <Route path="/onboarding/register" component={Register} />
        <Route path="/onboarding/profile" component={ProfileSetup} />
        <Route path="/onboarding/permissions" component={Permissions} />
        <Route path="/login" component={Login} />
        <Route path="/forgot-password" component={ForgotPassword} />
        
        {/* Main app routes */}
        <Route path="/" component={Home} />
        <Route path="/medications" component={Medications} />
        <Route path="/medications/:id" component={MedicationDetails} />
        <Route path="/prescriptions" component={Prescriptions} />
        <Route path="/scan" component={ScanPrescription} />
        <Route path="/reminders" component={Reminders} />
        
        {/* Pharmacy routes */}
        <Route path="/pharmacies" component={Pharmacies} />
        <Route path="/pharmacies/:id" component={PharmacyDetail} />
        <Route path="/pharmacies/:id/order" component={PharmacyOrder} />
        <Route path="/pharmacy-orders" component={PharmacyOrders} />
        <Route path="/pharmacy-orders/:id" component={PharmacyOrderDetail} />
        
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
};

export default AppRoutes;
