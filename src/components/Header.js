import { store } from '../store';

const Header = (currentPath) => {
  const isLoggedIn = store.getState('isLoggedIn');

  const render = () => {
    if (isLoggedIn)
      return /* HTML */ `<header class="bg-blue-600 text-white p-4 sticky top-0">
          <h1 class="text-2xl font-bold">항해플러스</h1>
        </header>

        <nav class="bg-white shadow-md p-2 sticky top-14">
          <ul class="flex justify-around">
            <li><a href="/" class="${currentPath === '/' ? 'text-blue-600 font-bold' : 'text-gray-600'}">홈</a></li>
            <li>
              <a href="/profile" class="${currentPath === '/profile' ? 'text-blue-600 font-bold' : 'text-gray-600'}"
                >프로필</a
              >
            </li>
            <li><button id="logout" class="text-gray-600">로그아웃</button></li>
          </ul>
        </nav>`;
    else
      return /* HTML */ `<header class="bg-blue-600 text-white p-4 sticky top-0">
          <h1 class="text-2xl font-bold">항해플러스</h1>
        </header>

        <nav class="bg-white shadow-md p-2 sticky top-14">
          <ul class="flex justify-around">
            <li><a href="/" class="${currentPath === '/' ? 'text-blue-600 font-bold' : 'text-gray-600'}">홈</a></li>
            <li>
              <a href="/login" class="${currentPath === '/login' ? 'text-blue-600 font-bold' : 'text-gray-600'}"
                >로그인</a
              >
            </li>
          </ul>
        </nav>`;
  };

  let headerHTML = render();
  return headerHTML;
};

export default Header;
