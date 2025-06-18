import React from 'react';


function Tools() {
	return(
		<div className="content">

			
			<div className="p-4">
				<h1 className="home-title text-center font-bold py-4">Every tool you need to work with PDFs in one place</h1>
				<h2 className="home-subtitle text-center">Every tool you need to use PDFs, at your fingertips. All are 100% FREE and easy to use! Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks.</h2>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 p-4 m-4">
			  {[
			    {
			      title: "Word to PDF",
			      description: "Make DOC and DOCX files easy to read by converting them to PDF.",
			      icon: "ico--wordpdf",
			      link: "/word-to-pdf",
			    },
			    // {
			    //   title: "Split PDF",
			    //   description: "Separate one page or a whole set for easy conversion into independent PDF files.",
			    //   icon: "ico--split",
			    // },
			    // {
			    //   title: "Compress PDF",
			    //   description: "Reduce file size while optimizing for maximal PDF quality.",
			    //   icon: "ico--compress",
			    // },
			    // {
			    //   title: "PDF to Word",
			    //   description: "Easily convert your PDF files into DOC and DOCX documents.",
			    //   icon: "ico--pdfword",
			    // },
			    // {
			    //   title: "PDF to PowerPoint",
			    //   description: "Turn your PDF files into editable PPT and PPTX slideshows.",
			    //   icon: "ico--pdfpowerpoint",
			    // },
			  ].map((tool, index) => (
			    <a href={tool.link}><div
			      key={index}
			      className="tool-div bg-white rounded-xl shadow-md hover:shadow-lg p-6 transition-all duration-300"
			    >
			      <div className="text-4xl mb-3"><i className={`ico ${tool.icon}`}></i></div>
			      <h3 className="font-bold text-xl text-slate-800 mb-2">{tool.title}</h3>
			      <p className="text-sm text-slate-600">{tool.description}</p>
			    </div></a>
			  ))}
			</div>


		</div>
	);
}

export default Tools;