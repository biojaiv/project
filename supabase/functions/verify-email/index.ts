import { SocksProxyAgent } from 'npm:socks-proxy-agent@8.0.2';
import { connect } from 'npm:imap@0.8.19';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
    const { email, password, provider } = await req.json() as EmailVerificationRequest;

    // Get IMAP config for provider
    const config = imapConfigs[provider];
    if (!config) {
      throw new Error('Unsupported email provider');
    }

    // Create Tor SOCKS proxy agent
    const torProxy = new SocksProxyAgent('socks5h://127.0.0.1:9050');

    // Verify Tor connection first
    try {
      const torCheck = await fetch('https://check.torproject.org/api/ip', {
        agent: torProxy,
      });
      const torData = await torCheck.json();
      
      if (!torData.IsTor) {
        throw new Error('Not connected to Tor network');
      }
    } catch (error) {
      throw new Error('Failed to verify Tor connection: ' + error.message);
    }

    // Test email connection through Tor
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

      imap.once('ready', () => {
        imap.end();
        resolve(new Response(
          JSON.stringify({ success: true, message: 'Connection successful' }),
          { 
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          }
        ));
      });

      imap.once('error', (err) => {
        console.error('IMAP error:', err);
        resolve(new Response(
          JSON.stringify({ 
            success: false, 
            message: 'Failed to connect through Tor',
            error: err.message 
          }),
          { 
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          }
        ));
      });

      imap.connect();
    });

  } catch (error) {
    console.error('Verification error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Verification failed',
        error: error.message 
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});