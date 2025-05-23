import { TorControl } from 'node-tor-control';
import { SocksProxyAgent } from 'socks-proxy-agent';

class TorService {
  private static instance: TorService;
  private isConnected: boolean = false;
  private proxyAgent: SocksProxyAgent | null = null;
  private torControl: TorControl;

  private constructor() {
    this.torControl = new TorControl({
      port: 9051,
      password: 'your-control-password'
    });
  }

  static getInstance(): TorService {
    if (!TorService.instance) {
      TorService.instance = new TorService();
    }
    return TorService.instance;
  }

  async start(): Promise<void> {
    try {
      // Check if Tor is already running
      const isRunning = await this.checkTorConnection();
      if (isRunning) {
        console.log('Connected to existing Tor service');
        this.isConnected = true;
        return;
      }

      // Initialize SOCKS proxy agent
      this.proxyAgent = new SocksProxyAgent('socks5h://127.0.0.1:9050');
      
      // Verify connection
      const connected = await this.checkTorConnection();
      if (!connected) {
        throw new Error('Failed to connect to Tor SOCKS proxy');
      }

      this.isConnected = true;
      console.log('Successfully connected to Tor network');
    } catch (error) {
      console.error('Failed to start Tor connection:', error);
      throw error;
    }
  }

  async checkTorConnection(): Promise<boolean> {
    try {
      if (!this.proxyAgent) {
        this.proxyAgent = new SocksProxyAgent('socks5h://127.0.0.1:9050');
      }

      const response = await fetch('https://check.torproject.org/api/ip', {
        agent: this.proxyAgent
      });
      const data = await response.json();
      return data.IsTor === true;
    } catch {
      return false;
    }
  }

  getProxyAgent(): SocksProxyAgent | null {
    return this.proxyAgent;
  }

  isConnectedToTor(): boolean {
    return this.isConnected;
  }

  async stop(): Promise<void> {
    this.isConnected = false;
    this.proxyAgent = null;
    console.log('Tor connection stopped');
  }
}

export default TorService;