#!/bin/bash

echo "═══════════════════════════════════════"
echo "🚀 ADDING ENVIRONMENT VARIABLES TO VERCEL"
echo "═══════════════════════════════════════"
echo ""

# Read .env.local line by line
while IFS='=' read -r key value || [ -n "$key" ]; do
  # Skip empty lines and comments
  [[ -z "$key" ]] && continue
  [[ "$key" =~ ^# ]] && continue
  
  # Trim whitespace
  key=$(echo "$key" | xargs)
  value=$(echo "$value" | xargs)
  
  # Skip if no value
  [ -z "$value" ] && continue
  
  # Skip empty keys
  [ -z "$key" ] && continue
  
  echo "📌 Adding: $key"
  
  # Add to all 3 environments
  echo "$value" | vercel env add "$key" production 2>&1 | grep -E "✓|Already exists|Error" || true
  echo "$value" | vercel env add "$key" preview 2>&1 | grep -E "✓|Already exists|Error" || true
  echo "$value" | vercel env add "$key" development 2>&1 | grep -E "✓|Already exists|Error" || true
done < .env.local

echo ""
echo "═══════════════════════════════════════"
echo "✅ ALL VARIABLES ADDED"
echo "═══════════════════════════════════════"
