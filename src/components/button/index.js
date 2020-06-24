import React from 'react';
function Button({ children, onClick, ...rest }) {
  return (
    <button onClick={onClick} {...rest}>
      {children}
    </button>
  );
}

export default Button;
