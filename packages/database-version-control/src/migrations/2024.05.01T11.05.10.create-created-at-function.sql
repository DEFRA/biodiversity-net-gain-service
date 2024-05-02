CREATE OR REPLACE FUNCTION bng.fn_set_default_date_created()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.date_created IS NULL THEN
        NEW.date_created := now() AT TIME ZONE 'utc';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;