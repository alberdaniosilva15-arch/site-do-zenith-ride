import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';

// Validador ofuscado para a password (não depende do crypto.subtle que falha em HTTP/IPs locais)
const VALIDATOR = [49, 74, 77, 57, 82, 68, 74, 65, 72, 81, 89, 53, 50, 48, 48, 49, 51, 49, 48, 53];

export default function SecurityShield({ children }: { children: React.ReactNode }) {
  const [isLocked, setIsLocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    // Se o dono já introduziu a password, desliga as armadilhas
    if (isUnlocked) return;

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Previne F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) ||
        (e.ctrlKey && (e.key === 'U' || e.key === 'u')) ||
        (e.metaKey && e.altKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) ||
        (e.metaKey && (e.key === 'U' || e.key === 'u'))
      ) {
        e.preventDefault();
        setIsLocked(true);
      }
    };

    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('dragstart', handleDragStart);

    // DevTools detection: monitora a diferença entre o tamanho externo e interno da janela
    // Quando o DevTools está aberto, a diferença aumenta significativamente
    const interval = setInterval(() => {
      if (isLocked) return;
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      // Normalmente a diferença é < 100px (barra do browser). Se for > 200px, o DevTools abriu.
      if (widthDiff > 200 || heightDiff > 300) {
        setIsLocked(true);
      }
    }, 2000);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('dragstart', handleDragStart);
      clearInterval(interval);
    };
  }, [isUnlocked]);

  const checkPassword = (pass: string) => {
    if (pass.length !== VALIDATOR.length) return false;
    for (let i = 0; i < pass.length; i++) {
      if (pass.charCodeAt(i) !== VALIDATOR[i]) return false;
    }
    return true;
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Regra: tem de ter exactamente 20 dígitos.
    if (password.length !== 20) {
      setError(true);
      setPassword("");
      return;
    }
    
    const isValid = checkPassword(password);
    if (isValid) {
      setIsUnlocked(true);
      setIsLocked(false);
      setError(false);
    } else {
      setError(true);
      setPassword("");
    }
  };

  return (
    <>
      {isLocked && !isUnlocked && (
        <div className="fixed inset-0 z-[999999] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center p-4 transition-all duration-500">
          <div className="bg-[#0a0a0a] border border-gold-royal/20 p-10 rounded-xl max-w-md w-full text-center relative overflow-hidden shadow-2xl shadow-gold-royal/10">
            <div className="absolute inset-0 bg-gradient-to-b from-gold-royal/10 to-transparent pointer-events-none" />
            
            <Lock className="w-12 h-12 text-gold-royal mx-auto mb-6 opacity-90" />
            
            <h2 className="font-display text-2xl text-gold-gradient mb-2 uppercase tracking-widest">Acesso Restrito</h2>
            <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.2em] mb-10 leading-relaxed">
              Protocolo Anti-Inspecção Zenith Ride. Tentativa de cópia interceptada.
            </p>
            
            <form onSubmit={handleUnlock} className="flex flex-col gap-5">
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Introduza a chave mestre"
                className="bg-black/80 border border-white/5 rounded-lg px-4 py-4 text-center text-white font-mono focus:outline-none focus:border-gold-royal/50 transition-colors tracking-widest"
              />
              
              <div className="h-6">
                {error && (
                  <p className="text-red-500/80 font-mono text-[10px] uppercase tracking-widest animate-pulse">Acesso Negado</p>
                )}
              </div>
              
              <button 
                type="submit"
                className="mt-2 bg-gold-royal text-black font-mono text-xs uppercase tracking-[0.3em] font-bold py-4 rounded-lg hover:bg-gold-light transition-colors"
              >
                Autenticar
              </button>
            </form>
          </div>
        </div>
      )}
      
      {/* O site original fica desfocado e com os cliques desactivados quando está bloqueado */}
      {/* Adicionamos select-none globalmente para não conseguirem copiar texto arrastando o rato */}
      <div 
        className={`transition-all duration-700 w-full h-full select-none ${
          isLocked && !isUnlocked ? "opacity-0 blur-3xl pointer-events-none" : "opacity-100"
        }`}
      >
        {children}
      </div>
    </>
  );
}
