-- Re-enable every previously-drafted product.
--
-- All products now ship as PHYSICAL books with a bundled bonus PDF, so the
-- 30 GMC-disapproved items hidden by migration 0003 should be visible again.
-- The feed routes have been updated to sanitize digital-format tokens out
-- of titles/descriptions before they reach Google Merchant Center, so these
-- listings will no longer trip "Digital books not supported".

UPDATE Products SET draft = 0 WHERE draft = 1;
