#!/bin/bash

# Vector Support Validation Script
# This script validates that all vector support components are properly configured

echo "🔍 Validating Vector Support Implementation..."
echo "=================================================="

# Check migration files
echo ""
echo "📁 Checking Migration Files..."
migrations=(
  "supabase/migrations/20250101000000_vector_support.sql"
  "supabase/migrations/20250101000001_test_vector_support.sql"
)

for migration in "${migrations[@]}"; do
  if [ -f "$migration" ]; then
    echo "✅ $migration exists"
  else
    echo "❌ $migration missing"
  fi
done

# Check edge functions
echo ""
echo "⚡ Checking Edge Functions..."
functions=(
  "supabase/functions/ingestLesson/index.ts"
  "supabase/functions/processEmbeddingQueue/index.ts"
)

for func in "${functions[@]}"; do
  if [ -f "$func" ]; then
    echo "✅ $func exists"
  else
    echo "❌ $func missing"
  fi
done

# Check documentation
echo ""
echo "📚 Checking Documentation..."
docs=(
  "VECTOR_SETUP_GUIDE.md"
  ".env.example"
)

for doc in "${docs[@]}"; do
  if [ -f "$doc" ]; then
    echo "✅ $doc exists"
  else
    echo "❌ $doc missing"
  fi
done

# Check environment variables in .env.example
echo ""
echo "🔧 Checking Environment Variables..."
if grep -q "VITE_OPENAI_API_KEY" .env.example; then
  echo "✅ OpenAI API key variable configured"
else
  echo "❌ OpenAI API key variable missing"
fi

if grep -q "VITE_EMBEDDING_PROVIDER" .env.example; then
  echo "✅ Embedding provider variable configured"
else
  echo "❌ Embedding provider variable missing"
fi

# Check migration content
echo ""
echo "🗄️  Checking Migration Content..."
if grep -q "CREATE EXTENSION IF NOT EXISTS vector" supabase/migrations/20250101000000_vector_support.sql; then
  echo "✅ pgvector extension enabled in migration"
else
  echo "❌ pgvector extension not found in migration"
fi

if grep -q "lesson_embeddings" supabase/migrations/20250101000000_vector_support.sql; then
  echo "✅ lesson_embeddings table found in migration"
else
  echo "❌ lesson_embeddings table not found in migration"
fi

if grep -q "ivfflat" supabase/migrations/20250101000000_vector_support.sql; then
  echo "✅ ivfflat index found in migration"
else
  echo "❌ ivfflat index not found in migration"
fi

# Check edge function content
echo ""
echo "🔗 Checking Edge Function Content..."
if grep -q "ingestLesson" supabase/functions/ingestLesson/index.ts; then
  echo "✅ ingestLesson function properly named"
else
  echo "❌ ingestLesson function name issue"
fi

if grep -q "501" supabase/functions/ingestLesson/index.ts; then
  echo "✅ ingestLesson returns 501 (placeholder status)"
else
  echo "❌ ingestLesson placeholder status missing"
fi

# Check documentation updates
echo ""
echo "📖 Checking Documentation Updates..."
if grep -q "Vector Support" supabase/README.md; then
  echo "✅ Supabase README updated with vector support"
else
  echo "❌ Supabase README not updated"
fi

echo ""
echo "=================================================="
echo "🎉 Vector Support Validation Complete!"
echo ""
echo "Next Steps:"
echo "1. Run migrations: supabase db push"
echo "2. Deploy edge functions: supabase functions deploy"
echo "3. Configure environment variables"
echo "4. Test with real embedding API keys"
echo ""
echo "For detailed setup instructions, see: VECTOR_SETUP_GUIDE.md"