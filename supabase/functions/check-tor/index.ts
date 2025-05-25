import { SocksProxyAgent } from 'npm:socks-proxy-agent@latest';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Tor SOCKS proxy agent
    const torProxy = new SocksProxyAgent('socks5h://127.0.0.1:9050');

    // Test connection through Tor by checking torproject.org
    const response = await fetch('https://check.torproject.org/api/ip', {
      // @ts-ignore - Type mismatch between browser and Deno fetch
      agent: torProxy
    });

    const data = await response.json();
    
    return new Response(
      JSON.stringify({ 
        success: data.IsTor === true,
        message: data.IsTor ? 'Connected to Tor network' : 'Not connected to Tor network'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Tor check error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Failed to check Tor connection',
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});