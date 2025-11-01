import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

interface ProcessQueueResponse {
  success: boolean
  processed: number
  errors: number
  message?: string
  details?: Array<{
    lesson_chunk_id: string
    success: boolean
    error?: string
  }>
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get pending items from queue
    const { data: queueItems, error: queueError } = await supabase
      .from('embedding_queue')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(10) // Process in batches

    if (queueError) {
      throw new Error(`Failed to fetch queue: ${queueError.message}`)
    }

    if (!queueItems || queueItems.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          processed: 0,
          errors: 0,
          message: 'No items in embedding queue'
        } as ProcessQueueResponse),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const results = []
    let processedCount = 0
    let errorCount = 0

    // Process each queue item
    for (const item of queueItems) {
      try {
        // TODO: This is a placeholder implementation
        // In a full implementation, you would:
        // 1. Get the lesson chunk text
        // 2. Generate embedding using the appropriate API
        // 3. Store the embedding in lesson_embeddings table
        // 4. Remove from queue or mark as processed

        // For now, we'll just simulate processing and remove from queue
        const { error: processingError } = await supabase
          .from('embedding_queue')
          .delete()
          .eq('lesson_chunk_id', item.lesson_chunk_id)

        if (processingError) {
          throw processingError
        }

        results.push({
          lesson_chunk_id: item.lesson_chunk_id,
          success: true
        })
        processedCount++

      } catch (error) {
        console.error(`Error processing ${item.lesson_chunk_id}:`, error)
        
        // Update queue item with error
        await supabase
          .from('embedding_queue')
          .update({
            attempts: item.attempts + 1,
            last_attempt_at: new Date().toISOString(),
            error_message: error.message
          })
          .eq('lesson_chunk_id', item.lesson_chunk_id)

        results.push({
          lesson_chunk_id: item.lesson_chunk_id,
          success: false,
          error: error.message
        })
        errorCount++
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: processedCount,
        errors: errorCount,
        message: `Processed ${processedCount} items, ${errorCount} errors`,
        details: results
      } as ProcessQueueResponse),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in processEmbeddingQueue function:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        processed: 0,
        errors: 1,
        message: 'Internal server error',
        details: [{
          lesson_chunk_id: 'unknown',
          success: false,
          error: error.message
        }]
      } as ProcessQueueResponse),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

/* 
Expected Usage:

POST /functions/v1/processEmbeddingQueue
(no body required)

Response:
{
  "success": true,
  "processed": 5,
  "errors": 1,
  "message": "Processed 5 items, 1 errors",
  "details": [
    {
      "lesson_chunk_id": "uuid1",
      "success": true
    },
    {
      "lesson_chunk_id": "uuid2", 
      "success": false,
      "error": "API rate limit exceeded"
    }
  ]
}

This function should be called periodically (e.g., every 5 minutes) to process
the embedding queue and generate embeddings for new/updated lesson chunks.
*/