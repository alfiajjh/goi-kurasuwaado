import { useState } from 'react';

type Props = {
  onSubmit: (name: string) => void;
};

export default function UsernameScreen({ onSubmit }: Props) {
  const [name, setName] = useState('');
  const trimmed = name.trim();
  const canSubmit = trimmed.length > 0;

  const handleSubmit = () => {
    if (canSubmit) onSubmit(trimmed);
  };

  return (
    <div className="flex flex-col h-full bg-[#F5F2ED] items-center justify-center px-8">
      <div className="w-40 h-40 bg-white p-2 rounded-3xl shadow-sm border border-[#E6E2D3] mb-8">
        <div className="w-full h-full bg-[#7B8E61] rounded-2xl overflow-hidden flex items-center justify-center shadow-inner">
          <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/>
          </svg>
        </div>
      </div>

      <div className="text-center mb-8 px-4">
        <h1 className="text-3xl font-bold text-[#2D2D2A] tracking-tight mb-1">Goi Kurosuwaado</h1>
        <p className="text-[#8B8B7A] text-sm">JLPT N4 Vocabulary Training</p>
      </div>

      <div className="w-full max-w-sm mb-6">
        <input
          type="text"
          autoFocus
          maxLength={20}
          placeholder="Masukkan nama kamu..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
          className="w-full bg-white border border-[#E6E2D3] rounded-2xl py-4 px-5 text-[#2D2D2A] text-base font-medium focus:outline-none focus:border-[#7B8E61] focus:ring-4 focus:ring-[#7B8E61]/10 transition-all shadow-sm text-center"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`w-full max-w-sm bg-[#7B8E61] text-white rounded-xl py-4 text-lg font-bold tracking-wide shadow-md transition-all ${
          canSubmit ? 'hover:bg-[#687951] active:scale-[0.98]' : 'opacity-50 cursor-not-allowed'
        }`}
      >
        MULAI
      </button>
    </div>
  );
}
