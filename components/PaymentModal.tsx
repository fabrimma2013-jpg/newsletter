
import React, { useState } from 'react';
import { Modal } from './Modal';
import { LoadingIcon, MobileMoneyIcon, PayPalIcon } from './icons';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type PaymentMethod = 'paypal' | 'mobile_money';

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [phone, setPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');


  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMethod === 'mobile_money' && !/^\+?[0-9\s]{7,}$/.test(phone)) {
        setError('Veuillez entrer un numéro de téléphone valide.');
        return;
    }
    setError('');
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2000);
  };
  
  const handleClose = () => {
    // Reset state before closing
    setIsSuccess(false);
    setIsProcessing(false);
    setSelectedMethod(null);
    setPhone('');
    setError('');
    onClose();
  }
  
  const handleSuccessAndClose = () => {
    onSuccess();
    handleClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Paiement Sécurisé (Simulation)">
      {isSuccess ? (
        <div className="text-center">
          <h3 className="text-lg font-medium text-green-600 dark:text-green-400">Paiement Réussi !</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Merci pour votre abonnement ! Les fonctionnalités Pro sont maintenant activées.
          </p>
          <button
            onClick={handleSuccessAndClose}
            className="mt-4 w-full py-2 px-4 bg-amber-500 text-slate-900 font-bold rounded-lg hover:bg-amber-600"
          >
            Génial !
          </button>
        </div>
      ) : (
        <div>
            {!selectedMethod ? (
                <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Choisissez votre méthode de paiement :</p>
                    <button onClick={() => setSelectedMethod('paypal')} className="w-full flex items-center justify-center p-3 border-2 border-[#0070ba] text-[#0070ba] font-bold rounded-lg hover:bg-[#0070ba]/10 transition-colors">
                        <PayPalIcon className="mr-2"/>
                        Payer avec PayPal
                    </button>
                    <button onClick={() => setSelectedMethod('mobile_money')} className="w-full flex items-center justify-center p-3 border-2 border-slate-400 dark:border-slate-500 text-slate-700 dark:text-slate-200 font-bold rounded-lg hover:bg-slate-400/10 transition-colors">
                        <MobileMoneyIcon className="mr-2"/>
                        Payer par Mobile Money
                    </button>
                </div>
            ) : (
                <form onSubmit={handlePayment}>
                    <button type="button" onClick={() => setSelectedMethod(null)} className="text-sm text-amber-500 hover:underline mb-4">&larr; Changer de méthode</button>
                    {selectedMethod === 'paypal' && (
                        <div className="text-center">
                            <p className="mb-4">Vous serez redirigé vers PayPal pour finaliser votre paiement.</p>
                            <button type="submit" disabled={isProcessing} className="w-full flex items-center justify-center p-3 bg-[#ffc439] text-[#003087] font-bold rounded-lg hover:bg-[#f2bb3a] transition-colors disabled:opacity-50">
                                {isProcessing ? <LoadingIcon className="h-6 w-6"/> : <><PayPalIcon className="mr-2"/><span>Payer $9.99 avec PayPal</span></>}
                            </button>
                        </div>
                    )}
                    {selectedMethod === 'mobile_money' && (
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Numéro de téléphone</label>
                                <input
                                    type="tel"
                                    id="phone-number"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+33 6 12 34 56 78"
                                    className="mt-1 w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700"
                                    disabled={isProcessing}
                                    required
                                />
                            </div>
                             {error && <p role="alert" className="text-red-500 text-xs">{error}</p>}
                            <button type="submit" disabled={isProcessing} className="w-full p-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-lg disabled:bg-amber-300">
                                {isProcessing ? 'Envoi de la demande...' : 'Payer $9.99'}
                            </button>
                        </div>
                    )}
                </form>
            )}
        </div>
      )}
    </Modal>
  );
};
