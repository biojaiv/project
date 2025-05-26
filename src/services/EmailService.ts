import { SocksProxyAgent } from 'socks-proxy-agent';

interface EmailConfig {
  user: string;
  password: string;
  host: string;
  port: number;
  tls: boolean;
}

interface ProviderConfig {
  host: string;
  port: number;
  tls: boolean;
  requiresCaptcha?: boolean;
  captchaUrl?: string;
}

const EMAIL_PROVIDERS: Record<string, ProviderConfig> = {
  gmail: {
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    requiresCaptcha: true,
    captchaUrl: 'https://accounts.google.com/v3/signin/challenge/pwd'
  },
  outlook: {
    host: 'outlook.office365.com',
    port: 993,
    tls: true
  },
  yahoo: {
    host: 'imap.mail.yahoo.com',
    port: 993,
    tls: true,
    requiresCaptcha: true,
    captchaUrl: 'https://login.yahoo.com/account/challenge/session-expired'
  },
  icloud: {
    host: 'imap.mail.me.com',
    port: 993,
    tls: true
  },
  gmx: {
    host: 'imap.gmx.net',
    port: 993,
    tls: true
  },
  webde: {
    host: 'imap.web.de',
    port: 993,
    tls: true
  }
};

class EmailService {
  private static instance: EmailService;
  private connections: Map<string, any> = new Map();
  private captchaCallbacks: Map<string, (token: string) => void> = new Map();

  private constructor() {}

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  async verifyConnection(email: string, password: string, provider: string): Promise<{ 
    success: boolean; 
    requiresCaptcha?: boolean; 
    captchaUrl?: string;
    message?: string;
  }> {
    const providerConfig = EMAIL_PROVIDERS[provider.toLowerCase()];
    if (!providerConfig) {
      return { 
        success: false, 
        message: 'Unsupported email provider' 
      };
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password,
          provider,
          host: providerConfig.host,
          port: providerConfig.port,
          tls: providerConfig.tls
        })
      });

      const data = await response.json();

      if (data.requiresCaptcha) {
        return {
          success: false,
          requiresCaptcha: true,
          captchaUrl: providerConfig.captchaUrl,
          message: 'CAPTCHA verification required'
        };
      }

      return {
        success: data.success,
        message: data.message
      };
    } catch (error) {
      console.error('Email verification error:', error);
      return {
        success: false,
        message: error.message || 'Failed to verify email connection'
      };
    }
  }

  async handleCaptchaCompletion(email: string, token: string): Promise<boolean> {
    const callback = this.captchaCallbacks.get(email);
    if (callback) {
      callback(token);
      this.captchaCallbacks.delete(email);
      return true;
    }
    return false;
  }

  async disconnect(email: string): Promise<void> {
    const connection = this.connections.get(email);
    if (connection) {
      await connection.logout();
      this.connections.delete(email);
    }
  }

  async disconnectAll(): Promise<void> {
    for (const [email] of this.connections) {
      await this.disconnect(email);
    }
  }
}

export default EmailService;