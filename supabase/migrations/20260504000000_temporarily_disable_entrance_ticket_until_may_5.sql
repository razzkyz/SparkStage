-- Temporarily disable entrance ticket until May 5th, 2026
-- This sets available_until to end of May 4th, so ticket will be unavailable on May 4th
-- and can be re-enabled on May 5th by updating available_until

UPDATE public.tickets
SET available_until = '2026-05-04'::date,
    updated_at = NOW()
WHERE type = 'entrance';
