import { store } from '../store';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const useNavigate = (routes, protectedRoutes) => {
  const navigate = (path) => {
    window.history.pushState({}, '', path);
    renderPage();
  };

  const renderPage = () => {
    const currentPath = window.location.pathname;
    const rootElement = document.getElementById('root');

    if (currentPath === '/' || currentPath === '/profile') {
      rootElement.innerHTML = /* HTML */ `<div class="bg-gray-100 min-h-screen flex justify-center">
        <div class="max-w-md w-full">
          ${Header(currentPath)}
          <main id="main"></main>
          ${Footer}
        </div>
      </div>`;

      document.getElementById('logout')?.addEventListener('click', () => {
        store.removeState('user');
        store.setState('isLoggedIn', false);

        navigate('/login');
      });
    } else {
      rootElement.innerHTML = '<main id="main"></main>';
    }

    document.querySelectorAll('li').forEach((anchor) => {
      anchor.addEventListener('click', (event) => {
        event.preventDefault();

        navigate(event.target.href);
      });
    });

    const targetComponent = routes[currentPath] || routes['/404'];
    targetComponent();

    protectedRoutes.forEach((route) => {
      if (route.path === currentPath && route.condition()) {
        navigate(route.redirect);
      }
    });
  };

  return { renderPage, navigate };
};
