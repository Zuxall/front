import React from 'react';

/** Input plus grand */
export function Input(props) {
  return (
    <input
      {...props}
      className={`
        border border-gray-300 rounded-xl
        px-6 py-4 w-full text-2xl
        focus:outline-none focus:ring-2 focus:ring-yellow-300
        ${props.className||''}
      `}
    />
  );
}

export function Button({ children, className='', ...rest }) {
  return (
    <button
      {...rest}
      className={`
        bg-yellow-400 text-black font-medium
        rounded-lg px-4 py-2
        hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-300
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export function Card({ children, className='' }) {
  return (
    <div className={`bg-white rounded-xl shadow ${className}`}>
      {children}
    </div>
  );
}
