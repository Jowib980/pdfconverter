import React, { useEffect, useState } from 'react';
import Header from './Header.js';
import Footer from './Footer.js';

function Main({children}) {
	return(
		<div className="content w-full">
			<Header />
				<main className="flex-grow w-full mt-4 py-6 bg-gray-100">
			        {children}
			      </main>
			<Footer />
		</div>
		);
}

export default Main;