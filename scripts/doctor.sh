#!/bin/sh
set -eu
exec node "$(dirname "$0")/../cli/zerospend.mjs" doctor
