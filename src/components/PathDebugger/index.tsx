import React from 'react';

interface PathDebuggerProps {
  filename: string;
}

const PathDebugger: React.FC<PathDebuggerProps> = ({ filename }) => {
  const paths = [
    `./assets/videos/${filename}`,
    `../assets/videos/${filename}`,
    `../../assets/videos/${filename}`,
    `/assets/videos/${filename}`,
    `videos/${filename}`,
    `./src/assets/videos/${filename}`,
    `../src/assets/videos/${filename}`,
    `${window.location.href.split('/').slice(0, -1).join('/')}/assets/videos/${filename}`
  ];

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px', marginTop: '20px' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Video Path Debugging</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <p>Current URL: <code>{window.location.href}</code></p>
        <p>Protocol: <code>{window.location.protocol}</code></p>
        <p>Testing filename: <code>{filename}</code></p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
        {paths.map((path, index) => (
          <div key={index} style={{ 
            border: '1px solid #ccc', 
            borderRadius: '8px', 
            padding: '15px',
            backgroundColor: 'white' 
          }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '10px' }}>Test Path {index + 1}</h3>
            <p style={{ 
              fontFamily: 'monospace', 
              backgroundColor: '#f5f5f5', 
              padding: '8px', 
              borderRadius: '4px',
              overflowWrap: 'break-word'
            }}>{path}</p>
            
            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
              <video 
                src={path} 
                controls
                width={200}
                muted
                playsInline
                style={{ borderRadius: '4px', maxWidth: '100%' }}
                onError={(e) => {
                  console.log(`Error loading video with path: ${path}`, e);
                  e.currentTarget.style.display = 'none';
                  (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'block';
                }}
                onCanPlay={(e) => {
                  console.log(`Successfully loaded video with path: ${path}`);
                  e.currentTarget.style.border = '2px solid green';
                  (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'none';
                }}
              />
              <div style={{ 
                display: 'none', 
                color: 'red', 
                padding: '10px', 
                textAlign: 'center',
                backgroundColor: '#ffeeee',
                borderRadius: '4px',
                marginTop: '10px'
              }}>
                Failed to load
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PathDebugger;