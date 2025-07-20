// Ultra-minimal React test - NO HOOKS
function App() {
  // Apply styles without hooks
  document.documentElement.classList.add('dark');
  document.body.style.backgroundColor = '#0f172a';
  document.body.style.color = '#d1fae5';
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0f172a', 
      color: '#d1fae5', 
      padding: '2rem',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          textAlign: 'center', 
          marginBottom: '2rem',
          color: '#34d399'
        }}>
          Android Kernel Customizer
        </h1>
        <div style={{
          backgroundColor: '#1e293b',
          border: '1px solid rgba(52, 211, 153, 0.3)',
          borderRadius: '0.5rem',
          padding: '1.5rem'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            marginBottom: '1rem',
            color: '#34d399'
          }}>
            React Test - Zero Hooks
          </h2>
          <p style={{ color: '#cbd5e1', marginBottom: '1rem' }}>
            Testing basic React functionality without any hooks...
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
              <span>Basic React - Testing...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
