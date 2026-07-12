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

const MovieDetail = lazy(() => import('./pages/MovieDetail'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const MovieForm = lazy(() => import('./pages/MovieForm'));
<<<<<<< HEAD
const MyLists = lazy(() => import('./pages/MyLists'));
const ListDetail = lazy(() => import('./pages/ListDetail'));
=======
const GenreAdmin = lazy(() => import('./pages/GenreAdmin'));
>>>>>>> 6d34b180f093ceb8de5299380e58752c857fe7d7

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

          <Route path="/mis-listas">
            <ProtectedRoute>
              <MyLists />
            </ProtectedRoute>
          </Route>

          <Route path="/mis-listas/:id">
            <ProtectedRoute>
              <ListDetail />
            </ProtectedRoute>
          </Route>

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