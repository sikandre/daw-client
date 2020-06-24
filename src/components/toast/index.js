import React from 'react';

export const HashLink = ({ closeToast, to, title }) => {
  return (
    <a href={to} onClick={closeToast}>
      {title}
    </a>
  );
};
