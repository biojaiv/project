import { SocksProxyAgent } from 'socks-proxy-agent';

class TorService {
  private static instance: TorService;
  private isConnected: boolean = false;
  private proxyAgent: SocksProxyAgent | null = null;

  private constructor() {}

  static getInstance(): TorService {
    if (!TorService.instance) {
      TorService.instance = new TorService();
    }
    return TorService.instance;
  }

  async start(): Promise<void> {
    try {
      // Check if Tor connection is available through our Edge Function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/check-tor`, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        this.isConnected = true;
        console.log('Connected to Tor network');
      } else {
        throw new Error('Failed to connect to Tor network');
      }
    } catch (error) {
      console.error('Failed to start Tor:', error);
      this.isConnected = false;
      throw error;
    }
  }

  async checkTorConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/check-tor`, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      });
      
      const data = await response.json();
      return data.success === true;
    } catch {
      return false;
    }
  }

  isConnectedToTor(): boolean {
    return this.isConnected;
  }

  async stop(): Promise<void> {
    this.isConnected = false;
    this.proxyAgent = null;
  }
}

export default TorService;