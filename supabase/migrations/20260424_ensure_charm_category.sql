-- ============================================
-- Migration: Ensure Charm Category Exists
-- Date: 2026-04-24
-- Description: Add Charm category to categories table
-- ============================================

-- Add Charm category if it doesn't exist
INSERT INTO public.categories (name, slug, is_active, created_at, updated_at)
VALUES ('Charm', 'charm', true, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;
