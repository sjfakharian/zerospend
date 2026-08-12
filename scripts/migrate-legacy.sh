#!/bin/sh
set -eu
echo 'Legacy migration is intentionally non-destructive.'
echo 'Review source and destination paths, then copy only configuration metadata. Secrets and databases are never migrated automatically.'
