import React from 'react';

const ProtectedComponent: React.FC = () => {
  return (
    <div>
      <h1>Protected Component</h1>
      <p>Este es un componente protegido. Solo accesible si estás autenticado.</p>
    </div>
  );
};

export default ProtectedComponent;
