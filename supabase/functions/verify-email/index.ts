import { SocksProxyAgent } from 'npm:socks-proxy-agent@latest';
import { connect } from 'npm:imap@0.8.19';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

interface EmailVerificationRequest {
  email: string;
  password: string;
  provider: string;
}

interface ImapConfig {
  [key: string]: {
    host: string;
    port: number;
    tls: boolean;
  };
}

const imapConfigs: ImapConfig = {
  gmail: {
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
  },
  outlook: {
    host: 'outlook.office365.com',
    port: 993,
    tls: true,
  },
  yahoo: {
    host: 'imap.mail.yahoo.com',
    port: 993,
    tls: true,
  },
  icloud: {
    host: 'imap.mail.me.com',
    port: 993,
    tls: true,
  },
};

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.text();
    if (!body) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Request body is empty' 
        }),
        { headers: corsHeaders }
      );
    }

    let requestData: EmailVerificationRequest;
    try {
      requestData = JSON.parse(body);
    } catch (e) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Invalid JSON in request body' 
        }),
        { headers: corsHeaders }
      );
    }

    const { email, password, provider } = requestData;

    if (!email || !password || !provider) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Missing required fields' 
        }),
        { headers: corsHeaders }
      );
    }

    // Get IMAP config for provider
    const config = imapConfigs[provider];
    if (!config) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Unsupported email provider' 
        }),
        { headers: corsHeaders }
      );
    }

    // Create Tor SOCKS proxy agent
    const torProxy = new SocksProxyAgent('socks5h://127.0.0.1:9050');

    // Test connection through Tor
    const imapConfig = {
      user: email,
      password: password,
      host: config.host,
      port: config.port,
      tls: config.tls,
      agent: torProxy,
      authTimeout: 10000,
    };

    return new Promise((resolve) => {
      const imap = connect(imapConfig);

      // Set a timeout to prevent hanging connections
      const timeout = setTimeout(() => {
        imap.end();
        resolve(new Response(
          JSON.stringify({ 
            success: false, 
            message: 'Connection timed out' 
          }),
          { headers: corsHeaders }
        ));
      }, 15000);

      imap.once('ready', () => {
        clearTimeout(timeout);
        imap.end();
        resolve(new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Connection successful' 
          }),
          { headers: corsHeaders }
        ));
      });

      imap.once('error', (err) => {
        clearTimeout(timeout);
        imap.end();
        console.error('IMAP error:', err);
        resolve(new Response(
          JSON.stringify({ 
            success: false, 
            message: 'Failed to connect through Tor',
            error: err.message 
          }),
          { headers: corsHeaders }
        ));
      });

      try {
        imap.connect();
      } catch (err) {
        clearTimeout(timeout);
        console.error('Connection error:', err);
        resolve(new Response(
          JSON.stringify({ 
            success: false, 
            message: 'Failed to establish connection',
            error: err.message 
          }),
          { headers: corsHeaders }
        ));
      }
    });

  } catch (error) {
    console.error('Verification error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Verification failed',
        error: error.message 
      }),
      { headers: corsHeaders }
    );
  }
});