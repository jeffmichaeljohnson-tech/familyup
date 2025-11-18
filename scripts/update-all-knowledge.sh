#!/bin/bash
# Update All Knowledge Files
# Regenerates all knowledge files from skill zip files

set -e

echo "🚀 Updating all knowledge files..."
echo ""

# Run enhanced extraction
echo "📚 Running enhanced extraction..."
npx tsx scripts/extract-skills-enhanced.ts

echo ""
echo "✅ All knowledge files updated!"
echo ""
echo "📁 Knowledge files location: .claude/knowledge/"
echo "📋 Master index: .claude/MASTER_INDEX.md"
echo "📖 Maximum awareness guide: .claude/MAXIMUM_AWARENESS_GUIDE.md"
echo ""
echo "💡 Read .claude/MAXIMUM_AWARENESS_GUIDE.md for complete usage instructions"

