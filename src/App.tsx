import React from 'react';

const App: React.FC = () => {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Motion Study Sprites
        </h1>
        <p style={{ fontSize: '1.25rem' }}>Setup successful!</p>
      </div>
    </div>
  );
};

export default App;