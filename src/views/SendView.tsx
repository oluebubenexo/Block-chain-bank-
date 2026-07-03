import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Search, Scan, User as UserIcon, Check, Loader2, AlertCircle, Copy, CheckSquare } from 'lucide-react';
import { currentUser, refreshUserData, saveTransactionLocally } from '../data';
import { useNetwork } from '../context/NetworkContext';
import { walletManager } from '../lib/blockchain';

interface RecipientDetails {
  name: string;
  username: string;
  accountNumber: string;
  walletAddress: string;
}

export function SendView({ 
  onBack, 
  onComplete, 
  onNavigate 
}: { 
  onBack: () => void; 
  onComplete: () => void; 
  onNavigate?: (view: string) => void; 
}) {
  const { isTestnet } = useNetwork();
  const [step, setStep] = useState<'recipient' | 'amount' | 'confirm' | 'pin' | 'processing' | 'success'>('recipient');
  
  // Inputs
  const [identifier, setIdentifier] = useState('');
  const [amount, setAmount] = useState('0');
  const [pin, setPin] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<any>('ETH');
  const [selectedNetwork, setSelectedNetwork] = useState<any>('Ethereum');
  const [notes, setNotes] = useState('');
  
  // Validation / Loading States
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [transferError, setTransferError] = useState('');
  const [recipient, setRecipient] = useState<RecipientDetails | null>(null);
  const [blockchainTxId, setBlockchainTxId] = useState('');
  const [copied, setCopied] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('Securing MPC credentials...');

  const validateRecipient = async (idValue: string) => {
    if (!idValue.trim()) return;
    setIsValidating(true);
    setValidationError('');
    
    try {
      // Keep using mock for address resolution unless it's a raw address
      let targetAddress = idValue.trim();
      
      // Basic mock lookup for our default users
      if (idValue === '@sjenkins') {
        targetAddress = '0x1234567890123456789012345678901234567890';
      } else if (idValue === '@mwong') {
        targetAddress = '7V4Q2zXZ1Z9rJv5vK4bVZQf3G3Y4A6mN1rA2Q8d2uC9V'; // Solana-like
      }
      
      setRecipient({
        name: idValue.startsWith('@') ? 'Contact' : 'External Wallet',
        username: idValue,
        accountNumber: 'N/A',
        walletAddress: targetAddress
      });
      setStep('amount');
    } catch (err) {
      setValidationError('Network error. Failed to validate recipient.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleAmountInput = (num: string) => {
    setAmount(prev => {
      if (prev === '0') {
        if (num === '.') return '0.';
        return num;
      }
      if (num === '.' && prev.includes('.')) return prev;
      return prev + num;
    });
  };

  const handlePinInput = async (num: string) => {
    if (pin.length < 6) {
      const newPin = pin + num;
      setPin(newPin);
      
      if (newPin.length === 6) {
        setStep('processing');
        setTransferError('');
        setProcessingStatus('Securing MPC credentials...');

        const timers: NodeJS.Timeout[] = [];
        const statusSteps = [
          { delay: 1000, status: `Signing ${selectedNetwork} transaction...` },
          { delay: 2200, status: `Broadcasting to ${selectedNetwork} Network...` },
          { delay: 3500, status: 'Waiting for block confirmation...' },
          { delay: 8000, status: 'Updating local ledger records...' }
        ];

        statusSteps.forEach(s => {
          const t = setTimeout(() => {
            setProcessingStatus(s.status);
          }, s.delay);
          timers.push(t);
        });
        
        try {
          // Send Real Blockchain Transaction
          let txHash = '';
          const targetAddress = recipient?.walletAddress || identifier;
          
          if (selectedNetwork === 'Solana') {
            txHash = await walletManager.sendSolanaTransaction(targetAddress, parseFloat(amount), isTestnet);
          } else if (['Ethereum', 'Base', 'Polygon', 'Arbitrum'].includes(selectedNetwork)) {
            txHash = await walletManager.sendEvmTransaction(selectedNetwork, targetAddress, amount, isTestnet);
          } else {
            throw new Error(`Sending on ${selectedNetwork} is not yet implemented.`);
          }
          
          timers.forEach(clearTimeout);

          setBlockchainTxId(txHash);
          
          // Save locally
          saveTransactionLocally({
            id: `tx_${Math.random().toString(36).substr(2, 9)}`,
            type: 'send',
            amount: parseFloat(amount),
            currency: selectedCurrency,
            network: selectedNetwork,
            date: new Date().toISOString(),
            status: 'completed',
            recipientName: recipient?.name || 'External Wallet',
            blockchainRef: txHash,
            notes: notes.trim()
          });

          setStep('success');
          await refreshUserData(isTestnet); // Refresh local balance & history
        } catch (err: any) {
          timers.forEach(clearTimeout);
          console.error(err);
          setTransferError(err.message || `${selectedNetwork} network error or insufficient funds. Check gas/RPC.`);
          setPin('');
          setStep('confirm');
        }
      }
    }
  };

  const handleCopy = () => {
    if (blockchainTxId) {
      navigator.clipboard.writeText(blockchainTxId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white/40 h-full relative overflow-y-auto no-scrollbar">
      {/* Header */}
      {!['processing', 'success'].includes(step) && (
        <div className="px-6 pt-8 pb-4 flex items-center gap-3 z-10 relative">
          <button 
            onClick={() => {
              if (step === 'recipient') onBack();
              else if (step === 'amount') setStep('recipient');
              else if (step === 'confirm') setStep('amount');
              else if (step === 'pin') setStep('confirm');
            }} 
            className="w-8 h-8 glass-panel shadow-sm border border-gray-200 rounded-full flex items-center justify-center active:scale-95 text-gray-900 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900">
            {step === 'recipient' ? 'Send Money' : step === 'amount' ? 'Enter Amount' : step === 'confirm' ? 'Confirm Details' : 'Security PIN'}
          </h2>
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 'recipient' && (
          <motion.div
            key="recipient"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 px-6 flex flex-col pt-2"
          >
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Name, @username, Account # or Solana Address"
                className="w-full glass-panel shadow-sm border border-gray-200 text-gray-900 text-sm rounded-xl py-3.5 pl-10 pr-10 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium placeholder:text-gray-400"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  setValidationError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') validateRecipient(identifier);
                }}
                disabled={isValidating}
              />
              <button 
                onClick={() => onNavigate && onNavigate('scanner')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 active:scale-95"
              >
                <Scan className="w-4 h-4" />
              </button>
            </div>

            {validationError && (
              <div className="mb-6 bg-red-50 border border-red-100 text-red-600 text-xs font-semibold rounded-xl p-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{validationError}</span>
              </div>
            )}

            <button
              onClick={() => validateRecipient(identifier)}
              disabled={isValidating || !identifier.trim()}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3.5 rounded-xl text-sm active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isValidating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying Recipient Profile...
                </>
              ) : (
                'Validate & Continue'
              )}
            </button>

            <h3 className="text-[10px] font-semibold text-gray-500 mt-8 mb-3 px-2 uppercase tracking-wider">Saved Contacts</h3>
            <div className="space-y-2">
              {[
                { name: 'Sarah Jenkins', identifier: '@sjenkins', acc: '0011661042' },
                { name: 'Marcus Wong', identifier: '@mwong', acc: '0011661084' }
              ].map((contact) => (
                <button 
                  key={contact.identifier}
                  onClick={() => {
                    setIdentifier(contact.identifier);
                    validateRecipient(contact.identifier);
                  }}
                  disabled={isValidating}
                  className="w-full flex items-center gap-3 p-3 glass-panel hover:bg-white/40 rounded-xl transition-all text-left border border-gray-200 hover:border-gray-200 shadow-xs"
                >
                  <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{contact.name}</p>
                    <p className="text-[10px] text-gray-500 font-medium">{contact.identifier} • ACC: {contact.acc}</p>
                  </div>
                  <CheckSquare className="w-4 h-4 text-gray-300 hover:text-emerald-500" />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'amount' && recipient && (
          <motion.div
            key="amount"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col items-center justify-between pb-6 pt-4"
          >
            <div className="flex flex-col items-center w-full px-6">
              <div className="glass-panel shadow-sm border border-gray-200 px-4 py-2 rounded-2xl mb-6 text-center max-w-sm w-full">
                <p className="text-xs font-semibold text-gray-500">To Profile</p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">{recipient.name}</p>
                <p className="text-[10px] font-mono text-gray-400 truncate mt-0.5">{recipient.walletAddress}</p>
              </div>

              {/* Network & Currency Selectors */}
              <div className="flex flex-col gap-2 w-full max-w-[240px] mb-6">
                <select 
                  className="w-full bg-gray-100 text-gray-900 font-semibold rounded-xl px-4 py-2 text-sm border-none focus:ring-0 outline-none"
                  value={selectedNetwork}
                  onChange={(e) => setSelectedNetwork(e.target.value as any)}
                >
                  <option value="Solana">Solana</option>
                  <option value="Ethereum">Ethereum</option>
                  <option value="Bitcoin">Bitcoin</option>
                  <option value="Base">Base</option>
                  <option value="Polygon">Polygon</option>
                  <option value="Arbitrum">Arbitrum</option>
                </select>

                <div className="flex flex-wrap justify-center gap-2 bg-gray-200/50 p-1 rounded-xl">
                  {(['SOL', 'USDC', 'USDT', 'ETH', 'BTC', 'BASE'] as const).map(curr => (
                    <button
                      key={curr}
                      onClick={() => {
                        setSelectedCurrency(curr);
                        setAmount('0');
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                        selectedCurrency === curr 
                          ? 'glass-panel text-gray-900 shadow-sm' 
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-1 mb-2">
                {selectedCurrency === 'USDC' && <span className="text-3xl text-gray-400 font-semibold">$</span>}
                <span className="text-5xl font-bold tracking-tight text-gray-900">{amount}</span>
                {selectedCurrency === 'SOL' && <span className="text-3xl text-gray-400 font-semibold ml-1">SOL</span>}
              </div>
              
              <p className="text-xs text-gray-500 font-semibold">
                Available: {currentUser.balances[selectedCurrency].toLocaleString()} {selectedCurrency}
              </p>
            </div>

            <div className="w-full px-6 mt-auto">
              <div className="grid grid-cols-3 gap-3 w-full max-w-[240px] mx-auto mb-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <button
                    key={num}
                    onClick={() => handleAmountInput(num.toString())}
                    className="h-14 rounded-xl glass-panel shadow-sm border border-gray-200 flex items-center justify-center text-xl font-bold active:bg-white/60 transition-colors text-gray-900 cursor-pointer"
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={() => handleAmountInput('.')}
                  className="h-14 rounded-xl glass-panel shadow-sm border border-gray-200 flex items-center justify-center text-xl font-bold active:bg-white/60 transition-colors text-gray-900 cursor-pointer"
                >
                  .
                </button>
                <button
                  onClick={() => handleAmountInput('0')}
                  className="h-14 rounded-xl glass-panel shadow-sm border border-gray-200 flex items-center justify-center text-xl font-bold active:bg-white/60 transition-colors text-gray-900 cursor-pointer"
                >
                  0
                </button>
                <button
                  onClick={() => setAmount(prev => prev.length > 1 ? prev.slice(0, -1) : '0')}
                  className="h-14 rounded-xl flex items-center justify-center text-gray-500 active:text-gray-900 transition-colors font-semibold text-sm cursor-pointer"
                >
                  Del
                </button>
              </div>

              <button 
                onClick={() => setStep('confirm')}
                disabled={parseFloat(amount) <= 0 || parseFloat(amount) > currentUser.balances[selectedCurrency]}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-gray-900 text-sm font-bold py-4 rounded-xl disabled:opacity-40 disabled:bg-gray-200 disabled:text-gray-400 cursor-pointer transition-all"
              >
                {parseFloat(amount) > currentUser.balances[selectedCurrency] 
                  ? 'Insufficient Funds' 
                  : 'Review Transaction'}
              </button>
            </div>
          </motion.div>
        )}

        {step === 'confirm' && recipient && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 px-6 flex flex-col pt-2 pb-6"
          >
            {transferError && (
              <div className="mb-4 bg-red-50 border border-red-100 text-red-600 text-xs font-semibold rounded-xl p-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{transferError}</span>
              </div>
            )}

            <div className="glass-panel shadow-xs border border-gray-200 rounded-3xl p-6 text-center mb-4">
               <p className="text-xs text-gray-500 font-semibold mb-2">You are sending</p>
               <h2 className="text-4xl font-bold mb-6 text-gray-900">
                 {selectedCurrency === 'USDC' ? '$' : ''}{amount} {selectedCurrency === 'SOL' ? 'SOL' : ''}
               </h2>
               
               <div className="flex items-center justify-between py-3 border-b border-gray-200 text-sm">
                 <span className="text-gray-500 font-medium">To Profile</span>
                 <span className="font-bold text-gray-900">{recipient.name}</span>
               </div>
               <div className="flex items-center justify-between py-3 border-b border-gray-200 text-sm">
                 <span className="text-gray-500 font-medium">Identifier</span>
                 <span className="font-mono text-xs text-gray-900">{recipient.username}</span>
               </div>
               <div className="flex items-center justify-between py-3 border-b border-gray-200 text-sm">
                 <span className="text-gray-500 font-medium">Network Gas Fee</span>
                 <span className="font-bold text-emerald-600">Free (Vaulta Sponsored)</span>
               </div>
               <div className="flex items-center justify-between py-3 text-sm">
                 <span className="text-gray-500 font-medium">Blockchain Network</span>
                 <span className="font-bold flex items-center gap-1.5 text-gray-900">
                   {selectedNetwork} {isTestnet ? 'Testnet' : 'Mainnet'}
                   <div className={`w-2 h-2 rounded-full animate-pulse ${isTestnet ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                 </span>
               </div>
            </div>

            {/* Real Note Input Field */}
            <div className="mb-6">
              <label htmlFor="transfer-notes-input" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5 px-1">
                Add Note (Optional)
              </label>
              <input 
                id="transfer-notes-input"
                type="text"
                placeholder="What is this transfer for?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full glass-panel shadow-xs border border-gray-200 text-gray-900 text-sm rounded-2xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 font-medium placeholder:text-gray-400"
              />
            </div>

            <button 
              onClick={() => setStep('pin')}
              className="mt-auto w-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold py-4 rounded-xl active:scale-95 transition-all cursor-pointer"
            >
              Confirm & Authorize
            </button>
          </motion.div>
        )}

        {step === 'pin' && recipient && (
          <motion.div
            key="pin"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full flex flex-col items-center mt-6 px-6"
          >
            <h2 className="text-2xl font-bold mb-2 text-gray-900 font-sans tracking-tight">Enter PIN</h2>
            <p className="text-sm text-gray-500 mb-8 text-center">
              Enter your 6-digit PIN to sign the Solana transaction and authorize sending {amount} {selectedCurrency} to {recipient.name}
            </p>
            
            <div className="flex gap-4 mb-16">
              {[...Array(6)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-4 h-4 rounded-full ${i < pin.length ? 'bg-gray-900 scale-110' : 'bg-gray-200'}`}
                />
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 sm:gap-6 w-full max-w-[280px]">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button
                  key={num}
                  onClick={() => handlePinInput(num.toString())}
                  className="w-16 h-16 sm:w-16 sm:h-16 rounded-full glass-panel shadow-xs border border-gray-200 flex items-center justify-center text-2xl font-bold active:bg-white/60 mx-auto text-gray-900 transition-colors cursor-pointer"
                >
                  {num}
                </button>
              ))}
              <div />
              <button
                onClick={() => handlePinInput('0')}
                className="w-16 h-16 sm:w-16 sm:h-16 rounded-full glass-panel shadow-xs border border-gray-200 flex items-center justify-center text-2xl font-bold active:bg-white/60 mx-auto text-gray-900 transition-colors cursor-pointer"
              >
                0
              </button>
              <button
                onClick={() => setPin(prev => prev.slice(0, -1))}
                className="w-16 h-16 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-gray-500 active:text-gray-900 mx-auto font-bold transition-colors cursor-pointer"
              >
                Del
              </button>
            </div>
          </motion.div>
        )}

        {step === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-8 text-center"
          >
            {/* Sleek, premium spinning gradient outer ring */}
            <div className="relative w-20 h-20 mb-8 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 border-r-emerald-500/30"
              />
              <div className="w-10 h-10 rounded-full bg-emerald-50/50 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" style={{ animationDuration: '2s' }} />
              </div>
            </div>
            
            {/* Dynamic Real-time Status */}
            <AnimatePresence mode="wait">
              <motion.p
                key={processingStatus}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.25 }}
                className="text-base font-semibold text-gray-900 tracking-tight"
              >
                {processingStatus}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        )}

        {step === 'success' && recipient && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-6 text-center h-full"
          >
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Check className="w-10 h-10 text-emerald-600" />
            </div>
            
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2 font-sans tracking-tight">Transfer Successful</h2>
            <p className="text-gray-500 text-sm max-w-[240px] mx-auto mb-6">
              Your transaction has been securely processed on the {selectedNetwork} blockchain.
            </p>

            <div className="w-full glass-panel rounded-2xl border border-gray-200 p-4 mb-8 text-left max-w-sm">
              <div className="flex justify-between items-center py-2 border-b border-gray-100 text-xs">
                <span className="text-gray-400 font-medium">On-chain Asset</span>
                <span className="font-bold text-gray-900">{amount} {selectedCurrency}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100 text-xs">
                <span className="text-gray-400 font-medium">To Account</span>
                <span className="font-bold text-gray-900">{recipient.name}</span>
              </div>
              {notes.trim() && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100 text-xs">
                  <span className="text-gray-400 font-medium">Note</span>
                  <span className="font-semibold text-gray-900 truncate max-w-[200px]">{notes.trim()}</span>
                </div>
              )}
              <div className="flex justify-between items-start py-2 text-xs">
                <span className="text-gray-400 font-medium shrink-0">Transaction ID</span>
                <div className="flex items-center gap-1.5 ml-auto overflow-hidden max-w-[180px]">
                  <span className="font-mono text-[10px] text-gray-500 truncate">{blockchainTxId}</span>
                  <button 
                    onClick={handleCopy}
                    className="text-gray-400 hover:text-gray-900 p-1 shrink-0 active:scale-90"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <button 
              onClick={onComplete}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold py-4 rounded-xl active:scale-95 transition-all max-w-sm mx-auto cursor-pointer"
            >
              Done
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
