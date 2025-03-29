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

const AppRoutes = () => {
  return (
    <Suspense fallback={<div className="p-4"><Skeleton className="h-screen" /></div>}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/medications" component={Medications} />
        <Route path="/medications/:id" component={MedicationDetails} />
        <Route path="/prescriptions" component={Prescriptions} />
        <Route path="/scan" component={ScanPrescription} />
        <Route path="/reminders" component={Reminders} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
};

export default AppRoutes;
