import React from 'react';

const Layout = ({ children }) => {
  return (
    <div>
      <header>
        <h1>Omail</h1>
        <nav>
          <ul>
            <li><a href="/inbox">Inbox</a></li>
            <li><a href="/compose">Compose</a></li>
            <li><a href="/sent">Sent</a></li>
            <li><a href="/profile">Profile</a></li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
      <footer>
        <p>&copy; 2023 Omail. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
