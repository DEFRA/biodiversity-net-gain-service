ALTER TABLE IF EXISTS bng.application_session
  ADD COLUMN IF NOT EXISTS date_of_expiry_notification TIMESTAMP WITH TIME ZONE;

