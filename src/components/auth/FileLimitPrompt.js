import React from 'react';
import File from '../../assets/images/files.svg';

function FileLimitPrompt({ selectedFiles = [], freeLimit = 1, premiumLimit = 10, onContinueFree, onContinuePremium, closeFileLimitPrompt }) {
  const totalFiles = selectedFiles.length;
  const filesToRemove = totalFiles - freeLimit;

  return (

    <div className="content">
      <div className="flex items-center justify-center px-4 mt-6">
        <div className="bg-white rounded-xl shadow-lg p-10 max-w-4xl w-full flex flex-col md:flex-row gap-6 items-center relative">


          {/* Left Illustration */}
          <div className="hidden md:block w-1/3">
            <img
              src={File}
              alt="Files"
              className="w-full"
            />
          </div>

          {/* Right Content */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              This tool is limited to <strong>{freeLimit} file{freeLimit > 1 ? 's' : ''}</strong> per task
            </h2>

            <div className="flex justify-between text-sm font-bold mb-2 text-gray-600">
              <span className="text-green-500">
                FREE<br />
                <span className="font-normal">{freeLimit} file{freeLimit > 1 ? 's' : ''} per task</span>
              </span>
              <span className="text-yellow-500 text-right">
                PREMIUM<br />
                <span className="font-normal">{premiumLimit} files per task</span>
              </span>
            </div>

            {/* Slider */}
            <div className="relative mb-4">
              <input
                type="range"
                min={0}
                max={premiumLimit}
                value={totalFiles}
                readOnly
                className="w-full appearance-none h-2 rounded bg-yellow-200 cursor-default"
              />
              <div
                className="absolute -top-8 bg-black text-white text-xs px-2 py-1 rounded"
                style={{ left: `${(totalFiles / premiumLimit) * 100}%`, transform: 'translateX(-50%)' }}
              >
                {totalFiles} file{totalFiles > 1 ? 's' : ''}
              </div>
            </div>

            <p className="text-sm text-gray-700 mb-6">
              If you continue for free, <span className="text-red-600 font-semibold">{filesToRemove} file{filesToRemove > 1 ? 's' : ''}</span> will be removed from process.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button
                className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-3 rounded-md shadow"
                onClick={onContinuePremium}
              >
                Continue with Premium<br />
                <span className="text-sm font-normal">{totalFiles} file{totalFiles > 1 ? 's' : ''}</span>
              </button>
              <button
                className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-semibold px-6 py-3 rounded-md shadow"
                onClick={onContinueFree}
              >
                Continue for free<br />
                <span className="text-sm font-normal">{freeLimit} file{freeLimit > 1 ? 's' : ''}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FileLimitPrompt;
