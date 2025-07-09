import React, { useEffect, useState } from 'react';
import Main from '../partials/Main';

function Blog() {

	const conversion = [
		{
			title: "✅ Word to PDF",
			description: "Transform your DOC or DOCX files into high-quality PDFs. Our converter preserves formatting, fonts, and images, ensuring your documents look exactly how you intended."
		},
		{
			title: "✅ Excel to PDF",
			description: "Turn your spreadsheets into secure PDFs while maintaining table structure and formulas. Perfect for reports, invoices, or records."
		},
		{
			title: "✅ HTML to PDF",
			description: "Save entire web pages or HTML code as sleek, printable PDF documents. Great for offline viewing and sharing."
		},
		{
			title: "✅ JPG to PDF",
			description: "Convert images to PDFs in seconds. Combine multiple pictures into a single, shareable file without compromising on quality."
		}
	];

	const organize = [
		{
			title: "🔗 Merge PDF",
			description: "Combine two or more PDF files into one organized document. Perfect for project reports, application bundles, or booklets."
		},
		{
			title: "✂️ Split PDF",
			description: "Need only a few pages from a large document? Our split tool lets you extract the pages you want—fast and accurately."
		},
		{
			title: "🔄 Rotate PDF",
			description: "Fix upside-down or sideways pages by rotating your PDF files in 90° increments. Apply to a single page or the whole document."
		}
	];

	const protect = [
		{
			title: "💦 Add Watermark",
			description: "Protect your content and claim ownership by adding custom text or image watermarks. Choose position, transparency, and font with full flexibility."
		}
	];

	return (

		<div className="content">
		  <Main>

		  	<div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 ">
			    <div className="min-h-screen bg-gray-100 flex justify-center items-start px-6 md:px-12 py-12">
			      <div className="w-full max-w-5xl bg-white border border-gray-200 rounded-2xl shadow-xl p-8 md:p-16 space-y-12">
			        
			        {/* Blog Header */}
			        <div className="text-center space-y-4">
			          <h1 className="text-4xl font-bold text-gray-800">📝 Welcome to the PDFTools Blog</h1>
			          <p className="text-lg text-gray-600">
			            Discover the latest updates, tips, and guides on all things PDF. Whether you're converting Word documents, merging files, or adding watermarks, our tools are here to make your workflow faster and simpler.
			          </p>
			        </div>

			        {/* Convert Section */}
			        <section className="space-y-6">
			          <h2 className="text-2xl font-semibold text-blue-600 border-b border-blue-300 pb-2">🔄 Convert with Ease</h2>
			          {conversion.map((item, index) => (
			            <div
			              key={index}
			              className="bg-blue-50 p-6 rounded-lg shadow hover:shadow-md transition-all duration-200"
			            >
			              <h3 className="text-xl font-semibold text-blue-800">{item.title}</h3>
			              <p className="text-gray-700 mt-2">{item.description}</p>
			            </div>
			          ))}
			        </section>

			        {/* Organize Section */}
			        <section className="space-y-6">
			          <h2 className="text-2xl font-semibold text-green-600 border-b border-green-300 pb-2">🧰 Organize Your PDFs</h2>
			          {organize.map((item, index) => (
			            <div
			              key={index}
			              className="bg-green-50 p-6 rounded-lg shadow hover:shadow-md transition-all duration-200"
			            >
			              <h3 className="text-xl font-semibold text-green-800">{item.title}</h3>
			              <p className="text-gray-700 mt-2">{item.description}</p>
			            </div>
			          ))}
			        </section>

			        {/* Protect Section */}
			        <section className="space-y-6">
			          <h2 className="text-2xl font-semibold text-purple-600 border-b border-purple-300 pb-2">💧 Add Protection & Branding</h2>
			          {protect.map((item, index) => (
			            <div
			              key={index}
			              className="bg-purple-50 p-6 rounded-lg shadow hover:shadow-md transition-all duration-200"
			            >
			              <h3 className="text-xl font-semibold text-purple-800">{item.title}</h3>
			              <p className="text-gray-700 mt-2">{item.description}</p>
			            </div>
			          ))}
			        </section>
			      </div>
			    </div>
		    </div>
		  </Main>
		</div>

	);
}

export default Blog;