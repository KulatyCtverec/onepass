-- Create GIN index for full-text search on Event table
CREATE INDEX event_search_idx ON "Event" USING GIN (to_tsvector('czech', name || ' ' || description || ' ' || location));
