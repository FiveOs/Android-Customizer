// Pure vanilla JS test - no React at all
import './index.css';

console.log('=== VANILLA JS TEST START ===');
console.log('Document loaded:', document.readyState);

const rootElement = document.getElementById('root');
console.log('Root element found:', !!rootElement);

if (rootElement) {
  rootElement.innerHTML = `
    <div class="min-h-screen bg-slate-900 text-emerald-100 p-8">
      <h1 class="text-4xl font-bold text-center text-emerald-400">
        🚀 BREAKTHROUGH! Vanilla JS Working!
      </h1>
      <div class="mt-8 text-center space-y-4">
        <p class="text-lg">✅ Vite bundling: SUCCESS</p>
        <p class="text-lg">✅ Tailwind CSS: SUCCESS</p>
        <p class="text-lg">✅ JavaScript execution: SUCCESS</p>
        <p class="text-lg text-yellow-400">❌ React: FAILED (but isolated the problem!)</p>
      </div>
      <div class="mt-8 text-center">
        <button id="test-btn" class="bg-emerald-600 hover:bg-emerald-700 px-6 py-2 rounded">
          Test Interactivity
        </button>
        <p id="result" class="mt-4 text-yellow-300"></p>
      </div>
    </div>
  `;
  
  const button = document.getElementById('test-btn');
  const result = document.getElementById('result');
  
  if (button && result) {
    button.addEventListener('click', () => {
      result.textContent = '🎉 Interactive JavaScript Working Perfectly!';
      console.log('Button clicked - interactivity confirmed');
    });
  }
  
  console.log('=== VANILLA JS TEST COMPLETE ===');
  console.log('Result: Vite + Vanilla JS = WORKING');
} else {
  console.error('Root element not found!');
}