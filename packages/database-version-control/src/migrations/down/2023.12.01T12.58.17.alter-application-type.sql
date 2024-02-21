DELETE FROM pg_enum
WHERE enumlabel = 'CreditsPurchase'
AND enumtypid = (
  SELECT oid FROM pg_type WHERE typname = 'APPLICATION_TYPE'
)