import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Cloud, Info, Signature } from 'lucide-react';
import { motion } from 'motion/react';

const CHECKLIST_SECTIONS = [
  {
    id: 'bedroom',
    title: 'The Bedroom',
    items: [
      { 
        id: 'b1', 
        label: 'Laundry', 
        description: 'Wash and dry the bed sheets, pillowcases, and duvet covers.', 
        note: 'Please do not remove the mattress protector and electric blanket.' 
      },
      { 
        id: 'b2', 
        label: 'Room Reset', 
        description: 'Place the bed sheets and linens back according to the initial setup. Return all furniture to its original position.' 
      },
      { 
        id: 'b3', 
        label: 'Cleaning', 
        description: 'Please vacuum the carpet and ensure all surfaces are clear. Remove any rubbish from your room into the main red bin outside.' 
      },
      { 
        id: 'b4', 
        label: 'Windows', 
        description: 'Please ensure all windows in your room are securely closed and locked. Leave the curtains or blinds open to allow for sunlight, which helps keep the room fresh, dry, and ventilated.' 
      },
      { 
        id: 'b5', 
        label: 'Lights and Appliances', 
        description: 'Ensure all lights are turned off and the electric blanket is switched off' 
      },
    ]
  },
  {
    id: 'kitchen',
    title: 'Kitchen & Food Cabinet',
    items: [
      { 
        id: 'k1', 
        label: 'Fridge & Freezer', 
        description: 'Remove all your items. Please wipe down your shelf to leave it fresh for the next person.' 
      },
      { 
        id: 'k2', 
        label: 'Pantry', 
        description: 'Clear out all personal food items from shared cupboards.' 
      },
      { 
        id: 'k3', 
        label: 'Dishes', 
        description: 'Ensure all your dishes are washed, dried, and put away.' 
      },
    ]
  },
  {
    id: 'bathroom',
    title: 'Bathroom & Common Areas',
    items: [
      { 
        id: 'ba1', 
        label: 'Personal Items', 
        description: 'Check the bathroom and living areas for any toiletries, phone chargers, or personal belongings.' 
      },
    ]
  },
  {
    id: 'departure',
    title: 'Final Departure',
    items: [
      { 
        id: 'd1', 
        label: 'Key Card', 
        description: 'Leave your key card on the bedside table or bed frame inside your room.' 
      },
      { 
        id: 'd2', 
        label: 'The "Check-Out Photo"', 
        description: 'Once the room is reset and tidy, please take a quick photo and send it to us.' 
      },
    ]
  }
];

export default function App() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [guestName, setGuestName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [storingLuggage, setStoringLuggage] = useState(false);
  const [collectionDateTime, setCollectionDateTime] = useState('');
  const [isSignedOff, setIsSignedOff] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const totalItems = CHECKLIST_SECTIONS.reduce((acc, section) => acc + section.items.length, 0);
  const completedItems = Object.values(checkedItems).filter(Boolean).length;
  const progress = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);
  const allCompleted = completedItems === totalItems;

  const toggleItem = (id: string) => {
    if (isSignedOff) return;
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSignOffClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (allCompleted && guestName.trim() !== '' && roomNumber !== '') {
      if (storingLuggage && collectionDateTime.trim() === '') return;
      setShowConfirmDialog(true);
    }
  };

  const confirmSignOff = async () => {
    setShowConfirmDialog(false);
    setIsSubmitting(true);
    try {
      await fetch('https://petrelplace.duckdns.org/api/webhook/vCniRSsEe4rPvOtANVu-udbO', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          guestName,
          roomNumber,
          storingLuggage,
          collectionDateTime: storingLuggage ? collectionDateTime : null,
          timestamp: new Date().toISOString(),
          checkedItems
        }),
      });
    } catch (error) {
      console.error('Webhook submission failed:', error);
    } finally {
      setIsSubmitting(false);
      setIsSignedOff(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-24">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src="/wclogo2025.jpg" alt="WhiteCloud Homestay" className="h-12 object-contain" />
            </div>
            <div className="text-sm font-medium text-[#002B7F]/70">
              Check-Out
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs font-medium text-slate-500 mb-1.5">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <motion.div 
                className="bg-[#4CB9E7] h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        {isSignedOff ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center space-y-4"
          >
            <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-green-800">You're all set, {guestName}!</h2>
            <p className="text-green-700 max-w-md mx-auto">
              Thanks again for staying at WhiteCloud Homestay, it was a pleasure having you!
            </p>
            <div className="pt-4">
              <button
                onClick={() => {
                  setIsSignedOff(false);
                  setCheckedItems({});
                  setGuestName('');
                  setRoomNumber('');
                  setStoringLuggage(false);
                  setCollectionDateTime('');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center px-8 py-3 font-semibold rounded-xl text-green-800 bg-green-200/50 hover:bg-green-200 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
          >
            <h2 className="text-2xl font-semibold text-[#002B7F] mb-3">Check-Out Checklist</h2>
            <p className="text-slate-600">
              We hope you enjoy your stay! To help us prepare the room for the next person and to ensure your bond refund is processed smoothly, please complete the following steps before you head off.
            </p>
          </motion.div>
        )}

        <div className="space-y-8">
          {CHECKLIST_SECTIONS.map((section, sectionIdx) => (
            <motion.section 
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIdx * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
            >
              <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100">
                <h3 className="text-lg font-semibold text-[#002B7F]">{section.title}</h3>
              </div>
              <div className="divide-y divide-slate-50">
                {section.items.map((item) => {
                  const isChecked = checkedItems[item.id] || false;
                  return (
                    <div 
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      className={`p-6 flex items-start space-x-4 cursor-pointer transition-colors ${
                        isChecked ? 'bg-[#4CB9E7]/10' : 'hover:bg-slate-50'
                      } ${isSignedOff ? 'pointer-events-none opacity-70' : ''}`}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {isChecked ? (
                          <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          >
                            <CheckCircle2 className="w-6 h-6 text-[#4CB9E7]" />
                          </motion.div>
                        ) : (
                          <Circle className="w-6 h-6 text-slate-300" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${isChecked ? 'text-slate-900' : 'text-[#002B7F]'}`}>
                          {item.label}
                        </p>
                        <p className={`mt-1 text-sm ${isChecked ? 'text-slate-500' : 'text-slate-600'}`}>
                          {item.description}
                        </p>
                        {item.note && (
                          <div className="mt-3 flex items-start space-x-2 bg-amber-50 text-amber-800 p-3 rounded-lg text-sm">
                            <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-600" />
                            <p>{item.note}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.section>
          ))}
        </div>

        {/* Note Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-amber-50 border border-amber-100 rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-amber-900 mb-3 flex items-center">
            <Info className="w-5 h-5 mr-2" />
            A Small Note on the "Room Reset"
          </h3>
          <div className="space-y-3 text-amber-800 text-sm">
            <p>
              We appreciate you helping us keep the house running smoothly! To cover the labor and time for additional cleaning or laundry:
            </p>
            <div className="bg-white/60 p-4 rounded-xl border border-amber-200/50 font-medium">
              A $35 service fee will be deducted from the bond if the linens are not washed and dried, or if the room is not reset to its original state.
            </div>
          </div>
        </motion.section>

        {/* Sign Off Section */}
        {!isSignedOff && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 mt-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-slate-100 p-2 rounded-xl text-[#002B7F]">
                <Signature className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-[#002B7F]">Sign Off</h3>
            </div>
            
            {!allCompleted ? (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
                <p className="text-slate-600 mb-2">Please complete all items on the checklist before signing off.</p>
                <p className="text-sm font-medium text-slate-500">{totalItems - completedItems} items remaining</p>
              </div>
            ) : (
              <form onSubmit={handleSignOffClick} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="guestName" className="block text-sm font-medium text-[#002B7F] mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="guestName"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#4CB9E7] focus:border-[#4CB9E7] outline-none transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="roomNumber" className="block text-sm font-medium text-[#002B7F] mb-2">
                      Room
                    </label>
                    <select
                      id="roomNumber"
                      required
                      value={roomNumber}
                      onChange={(e) => setRoomNumber(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#4CB9E7] focus:border-[#4CB9E7] outline-none transition-all bg-white"
                    >
                      <option value="" disabled>Select your room</option>
                      <option value="1">Room 1</option>
                      <option value="2">Room 2</option>
                      <option value="3">Room 3</option>
                      <option value="4">Room 4</option>
                      <option value="5">Room 5</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-4 border-t border-slate-100 pt-6">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="storingLuggage"
                      checked={storingLuggage}
                      onChange={(e) => setStoringLuggage(e.target.checked)}
                      className="w-5 h-5 text-[#4CB9E7] rounded border-slate-300 focus:ring-[#4CB9E7]"
                    />
                    <label htmlFor="storingLuggage" className="text-sm font-medium text-[#002B7F]">
                      Are you storing any bag/luggage in garage after check-out?
                    </label>
                  </div>

                  {storingLuggage && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="pl-8 space-y-3"
                    >
                      <div>
                        <label htmlFor="collectionDateTime" className="block text-sm font-medium text-[#002B7F] mb-2">
                          Collection Date and Time
                        </label>
                        <input
                          type="datetime-local"
                          id="collectionDateTime"
                          required={storingLuggage}
                          min={new Date().toISOString().slice(0, 16)}
                          value={collectionDateTime}
                          onChange={(e) => setCollectionDateTime(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#4CB9E7] focus:border-[#4CB9E7] outline-none transition-all bg-white"
                        />
                      </div>
                      <div className="text-xs text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-100 flex items-start space-x-2">
                        <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
                        <p><strong>Reminder:</strong> Items are stored at your own risk. Uncollected items will be disposed of after 30 days.</p>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-600">
                  By signing off, I confirm that I have completed all the items on this checklist and understand the room reset policy.
                </div>

                <button
                  type="submit"
                  disabled={guestName.trim() === '' || roomNumber === '' || (storingLuggage && collectionDateTime.trim() === '') || isSubmitting}
                  className="w-full bg-[#002B7F] hover:bg-[#001f5c] text-white font-semibold py-4 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <span>{isSubmitting ? 'Submitting...' : 'Confirm & Sign Off'}</span>
                  {!isSubmitting && <CheckCircle2 className="w-5 h-5" />}
                </button>
              </form>
            )}
          </motion.section>
        )}
        
        {/* Footer */}
        <footer className="text-center text-slate-500 text-sm pt-8 pb-4">
        </footer>
      </main>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-slate-100"
          >
            <h3 className="text-xl font-bold text-[#002B7F] mb-2">Confirm Check-Out</h3>
            <p className="text-slate-600 mb-6">
              Are you sure you want to submit your check-out form? Please ensure all tasks are completed correctly.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmSignOff}
                className="flex-1 px-4 py-3 rounded-xl bg-[#002B7F] text-white font-medium hover:bg-[#001f5c] transition-colors"
              >
                Yes, Submit
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
