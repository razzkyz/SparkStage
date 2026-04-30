import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';
import type { DressingRoomLook } from '../../../hooks/useDressingRoomCollection';
import type { RentalFormData } from '../RentalFlowModal';
import { RentalProductGallery } from '../RentalProductGallery';

interface RentalConditionStepProps {
  look: DressingRoomLook;
  defaultCondition: RentalFormData['initialCondition'];
  onNext: (data: Partial<RentalFormData>) => void;
  onPrev: () => void;
}

export default function RentalConditionStep({
  look,
  defaultCondition,
  onNext,
  onPrev,
}: RentalConditionStepProps) {
  const [conditions, setConditions] = useState<Record<number, { noStain: boolean; noRip: boolean; noLoose: boolean; notes: string }>>(
    Object.keys(defaultCondition).length > 0
      ? defaultCondition
      : look.items.reduce(
          (acc, item) => ({
            ...acc,
            [item.id]: {
              noStain: true,
              noRip: true,
              noLoose: true,
              notes: '',
            },
          }),
          {} as Record<number, { noStain: boolean; noRip: boolean; noLoose: boolean; notes: string }>
        )
  );

  const handleConditionChange = (itemId: number, field: string, value: boolean) => {
    setConditions(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value,
      },
    }));
  };

  const handleNotesChange = (itemId: number, notes: string) => {
    setConditions(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        notes,
      },
    }));
  };

  const handleNext = () => {
    onNext({ initialCondition: conditions });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      {/* Step indicator */}
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500">
        <span className="h-2 w-2 rounded-full bg-main-500" />
        <span>Step 2: Kondisi Awal</span>
      </div>

      {/* Product Gallery */}
      <RentalProductGallery look={look} showPricing={false} />

      {/* Info */}
      <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-900 border border-blue-200">
        <p className="font-semibold mb-2">📋 Verifikasi Kondisi Awal Setiap Item</p>
        <p className="text-xs">Checklist ini penting untuk mencegah dispute saat pengembalian. Pastikan semua kondisi sudah sesuai sebelum lanjut.</p>
      </div>

      {/* Conditions checklist */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {look.items.map((item) => {
          const condition = conditions[item.id] || {
            noStain: true,
            noRip: true,
            noLoose: true,
            notes: '',
          };

          return (
            <div
              key={item.id}
              className="rounded-lg border border-gray-200 p-4 space-y-3"
            >
              {/* Item name */}
              <div>
                <p className="font-semibold text-gray-900">
                  {item.label || item.product_variant?.name}
                </p>
                <p className="text-xs text-gray-500">
                  {item.product_variant?.product?.name}
                </p>
              </div>

              {/* Checklist */}
              <div className="space-y-2">
                {[
                  { key: 'noStain' as const, label: '✓ Tidak ada noda', description: 'Bersih tanpa noda atau kotor' },
                  { key: 'noRip' as const, label: '✓ Tidak ada sobek', description: 'Struktur kain masih utuh' },
                  { key: 'noLoose' as const, label: '✓ Kancing lengkap', description: 'Semua kancing & aksesoris lengkap' },
                ].map(({ key, label, description }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleConditionChange(item.id, key, !condition[key])}
                    className="w-full flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="shrink-0 pt-0.5">
                      {condition[key] ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900">{label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{description}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-2">
                  Catatan Tambahan (Opsional)
                </label>
                <textarea
                  value={condition.notes}
                  onChange={(e) => handleNotesChange(item.id, e.target.value)}
                  placeholder="Contoh: Ada noda kecil di lengan, tapi masih oke"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-main-500"
                  rows={2}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Warning */}
      <div className="rounded-lg bg-yellow-50 p-4 text-sm text-yellow-900 border border-yellow-200">
        <p className="font-semibold mb-1">⚠️ Catatan Penting</p>
        <ul className="text-xs space-y-1 list-disc list-inside">
          <li>Laporan kondisi awal ini akan dibandingkan saat pengembalian</li>
          <li>Kerusakan yang tidak dilaporkan akan jadi tanggung jawab customer</li>
          <li>Foto kondisi awal sangat disarankan (opsional)</li>
        </ul>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onPrev}
          className="flex-1 px-4 py-3 border border-gray-300 bg-white text-sm font-bold uppercase tracking-wider text-gray-900 hover:bg-gray-50 transition-colors"
        >
          Kembali
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="flex-1 px-4 py-3 bg-main-500 text-sm font-bold uppercase tracking-wider text-white hover:bg-main-600 transition-colors"
        >
          Lanjut
        </button>
      </div>
    </motion.div>
  );
}
