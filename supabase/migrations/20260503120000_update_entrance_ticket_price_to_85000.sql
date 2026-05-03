-- Migration: Update Entrance Ticket Price to 85.000
-- Date: 2026-05-03
-- Description: Ensure on-stage entrance ticket price is set to 85.000
-- ============================================

UPDATE public.tickets
SET price = 85000,
    updated_at = NOW()
WHERE type = 'entrance';
