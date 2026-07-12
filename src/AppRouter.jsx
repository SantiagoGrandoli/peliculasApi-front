import { lazy, Suspense } from 'react';
import { Switch, Route } from 'wouter';
import Navbar from './components/Navbar';
import ToastContainer from './components/ToastContainer';
import ProtectedRoute from './components/ProtectedRoute';
import Loader from './components/Loader';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MoviesList from './pages/MoviesList';
import NotFound from './pages/NotFound';

// --- Lazy loading: componentes "pesados" cargados bajo demanda (requisito obligatorio) ---
const MovieDetail = lazy(() => import('./pages/MovieDetail'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const MovieForm = lazy(() => import('./pages/MovieForm'));
const GenreAdmin = lazy(() => import('./pages/GenreAdmin'));

export default function AppRouter() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="container page"><Loader label="Cargando sección..." /></div>}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />

          <Route path="/elementos" component={MoviesList} />
          <Route path="/elementos/:id" component={MovieDetail} />

          <Route path="/admin">
            <ProtectedRoute requireAdmin>
              <AdminPanel />
            </ProtectedRoute>
          </Route>

          <Route path="/admin/elementos/new">
            <ProtectedRoute requireAdmin>
              <MovieForm />
            </ProtectedRoute>
          </Route>

          <Route path="/admin/elementos/:id/editar">
            <ProtectedRoute requireAdmin>
              <MovieForm />
            </ProtectedRoute>
          </Route>

          <Route path="/admin/generos">
            <ProtectedRoute requireAdmin>
              <GenreAdmin />
            </ProtectedRoute>
          </Route>

          <Route component={NotFound} />
        </Switch>
      </Suspense>
      <ToastContainer />
    </>
  )
}
