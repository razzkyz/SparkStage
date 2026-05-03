-- Disable entrance ticket by setting is_active to false
-- This completely disables the ticket from being purchased

UPDATE public.tickets
SET is_active = false,
    updated_at = NOW()
WHERE type = 'entrance';
