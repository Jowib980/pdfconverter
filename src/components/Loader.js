import React from 'react';
import { TailSpin } from 'react-loader-spinner';

function Loader() {
  return (
    <div className="flex justify-center items-center h-full">
      <TailSpin
        visible={true}
        height="80"
        width="100"
        color="#ef4444" // red-500
        ariaLabel="tail-spin-loading"
        radius="1"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
}

export default Loader;
