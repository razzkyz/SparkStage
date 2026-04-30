import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { DressingRoomLook } from '../../hooks/useDressingRoomCollection';
import RentalDurationStep from './rental-steps/RentalDurationStep';
import RentalConditionStep from './rental-steps/RentalConditionStep';
import RentalCustomerStep from './rental-steps/RentalCustomerStep';
import RentalSummaryStep from './rental-steps/RentalSummaryStep';

export interface RentalFormData {
  look: DressingRoomLook;
  durationDays: number;
  rentalStartTime: Date;
  rentalEndTime: Date;
  initialCondition: Record<number, {
    noStain: boolean;
    noRip: boolean;
    noLoose: boolean;
    notes: string;
  }>;
  customerData: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
  };
}

interface RentalFlowModalProps {
  look: DressingRoomLook;
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'duration' | 'condition' | 'customer' | 'summary';

export default function RentalFlowModal({ look, isOpen, onClose }: RentalFlowModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>('duration');
  
  const [formData, setFormData] = useState<RentalFormData>({
    look,
    durationDays: 1,
    rentalStartTime: new Date(),
    rentalEndTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    initialCondition: {},
    customerData: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
    },
  });

  const handleNext = (stepFormData: Partial<RentalFormData>) => {
    setFormData(prev => ({ ...prev, ...stepFormData }));
    
    const steps: Step[] = ['duration', 'condition', 'customer', 'summary'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    const steps: Step[] = ['duration', 'condition', 'customer', 'summary'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto bg-white rounded-lg"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight">
                Sewa Baju - Look {look.look_number}
              </h2>
              <p className="mt-1 text-xs uppercase tracking-widest text-gray-500">
                {formData.look.items.length} item
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="h-10 w-10 inline-flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-8">
            <AnimatePresence mode="wait">
              {currentStep === 'duration' && (
                <RentalDurationStep
                  key="duration"
                  look={look}
                  onNext={handleNext}
                  onClose={onClose}
                  defaultDuration={formData.durationDays}
                />
              )}

              {currentStep === 'condition' && (
                <RentalConditionStep
                  key="condition"
                  look={look}
                  onNext={handleNext}
                  onPrev={handlePrev}
                  defaultCondition={formData.initialCondition}
                />
              )}

              {currentStep === 'customer' && (
                <RentalCustomerStep
                  key="customer"
                  onNext={handleNext}
                  onPrev={handlePrev}
                  defaultData={formData.customerData}
                />
              )}

              {currentStep === 'summary' && (
                <RentalSummaryStep
                  key="summary"
                  rentalData={formData}
                  onPrev={handlePrev}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
