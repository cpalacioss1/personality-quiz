import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './components/UserContext';
import App from './App';
import './index.css';

const root = createRoot(document.getElementById('root'));
root.render(
	<BrowserRouter>
		<UserProvider>
			<App />
		</UserProvider>
	</BrowserRouter>
);
