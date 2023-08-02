CREATE FUNCTION bng.fn_random_string(LENGTH integer) RETURNS text
  LANGUAGE plpgsql
  AS
$$
DECLARE
  chars text[] := '{0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z}';
  result text := '';
  i integer := 0;
BEGIN
  IF LENGTH < 0 THEN
    raise exception 'Given length cannot be less than 0';
  END IF;
  FOR i in 1..LENGTH LOOP
    result := result || chars[1+random()*(array_length(chars, 1)-1)];
  END LOOP;
  RETURN result;
END;
$$