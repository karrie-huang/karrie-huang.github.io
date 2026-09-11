#!/bin/sh
# Fails if any component carries a literal type or spacing value.
#
# The whole point of the token scale is that "make the site bigger" is one edit
# in src/styles/global.css. One hardcoded 1.08rem in a component quietly undoes
# that, and nothing else in the toolchain would ever complain.
hits=$(grep -rnE 'font-size: *[0-9.]+(rem|px|em)|(margin|padding)[a-z-]*: *[^;]*[0-9](rem|px)' \
        src --include='*.astro' --include='*.css' \
      | grep -v -- '--text\|--space\|--measure\|1px\|2px\|-1px')
if [ -n "$hits" ]; then
  echo "Literal type or spacing values found outside the token scale:"
  echo "$hits" | sed 's/^/  /'
  echo ""
  echo "Use var(--text-*) or var(--space-*) from src/styles/global.css instead."
  echo "See AGENTS.md."
  exit 1
fi
echo "Token scale intact: no literal type or spacing values outside global.css."
