// يضبط الوضع الداكن قبل ظهور الصفحة لتجنب الوميض
export function ThemeScript() {
  const code = `(function(){try{var t=localStorage.getItem('wasl-dam:theme');var m=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(!t&&m)){document.documentElement.classList.add('dark');}}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
