import React, { useState } from 'react';
import { User, login } from '../services/authService';
import { StarIcon } from './icons';

interface AuthPageProps {
  onLoginSuccess: (user: User) => void;
}

const TestimonialCard: React.FC<{ name: string; role: string; children: React.ReactNode }> = ({ name, role, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex-1 min-w-[280px]">
        <div className="flex text-yellow-400 mb-2">
            {[...Array(5)].map((_, i) => <StarIcon key={i} className="w-5 h-5 fill-current" />)}
        </div>
        <p className="text-stone-600 mb-4 text-sm">"{children}"</p>
        <div className="text-right">
            <p className="font-bold text-stone-800">{name}</p>
            <p className="text-sm text-stone-500">{role}</p>
        </div>
    </div>
);

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const user = login(email, password);
      onLoginSuccess(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-stone-50 text-stone-800 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <main className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold">
            ChronicCare AI 🩺
          </h1>
          <p className="text-lg text-stone-600 mt-2">Votre partenaire santé pour une gestion proactive des maladies chroniques.</p>
          <p className="text-md text-stone-500 mt-1">"Prenez le contrôle de votre santé, un jour à la fois."</p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
          <div className="w-full max-w-md">
            <div className="bg-white shadow-xl rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-center text-stone-900 mb-6">
                Accédez à votre espace
              </h2>
              {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
              <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="marie@curie.com"
                    className="w-full px-4 py-2 bg-stone-50 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#c5a382]"
                    required
                    autoComplete="new-password"
                  />
                </div>
                <div>
                  <label htmlFor="password"className="block text-sm font-medium text-stone-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="password123"
                    className="w-full px-4 py-2 bg-stone-50 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#c5a382]"
                    required
                    autoComplete="new-password"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#c5a382] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#b89572] transition-colors duration-200"
                >
                  Sign In
                </button>
              </form>
            </div>
          </div>
          <div className="w-full max-w-md lg:max-w-lg mt-8 lg:mt-0">
              <img 
                src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=800&auto=format&fit=crop" 
                alt="Électrocardiogramme avec un stéthoscope posé dessus" 
                className="rounded-2xl shadow-xl object-cover w-full h-full"
              />
          </div>
        </div>
        
        <div className="mt-16 flex flex-wrap items-stretch justify-center gap-8">
            <TestimonialCard name="Jean D." role="Patient Diabétique">
                Cette application a changé ma façon de gérer mon diabète. Simple et efficace.
            </TestimonialCard>
            <TestimonialCard name="Dr. Eva L." role="Cardiologue">
                Mes patients sont plus engagés et mieux informés. Un outil précieux pour le suivi à distance.
            </TestimonialCard>
            <TestimonialCard name="Sophie T." role="Patiente Hypertendue">
                Recevoir des rappels pour mes médicaments et suivre ma tension est devenu si simple. Je suis rassurée.
            </TestimonialCard>
        </div>
      </main>
    </div>
  );
};