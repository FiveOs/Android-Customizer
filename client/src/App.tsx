// NO HOOKS - Testing basic React functionality
function App() {
  // Apply theme without hooks
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
      <h1 style={{ 
        fontSize: '2.5rem', 
        fontWeight: 'bold', 
        textAlign: 'center', 
        marginBottom: '2rem',
        color: '#34d399'
      }}>
        Android Kernel Customizer
      </h1>
      <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
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
            React Status Test (No Hooks)
          </h2>
          <p style={{ color: '#cbd5e1', marginBottom: '1rem' }}>
            Testing React without hooks to isolate the issue...
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
              <span>React Component - Working</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: '#f59e0b', borderRadius: '50%' }}></div>
              <span>React Hooks - Testing...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
