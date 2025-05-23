import { TorControl } from 'node-tor-control';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { spawn } from 'child_process';
import { join } from 'path';
import { torBinary } from 'tor-binary';

class TorService {
  private static instance: TorService;
  private torProcess: any;
  private torControl: TorControl;
  private isConnected: boolean = false;
  private proxyAgent: SocksProxyAgent | null = null;

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
        console.log('Tor is already running');
        this.isConnected = true;
        return;
      }

      // Start embedded Tor process
      const torPath = torBinary.path;
      this.torProcess = spawn(torPath, [
        '--SocksPort', '9050',
        '--ControlPort', '9051',
        '--DataDirectory', join(process.cwd(), '.tor')
      ]);

      this.torProcess.stdout.on('data', (data: Buffer) => {
        console.log('Tor:', data.toString());
      });

      this.torProcess.stderr.on('data', (data: Buffer) => {
        console.error('Tor error:', data.toString());
      });

      // Wait for Tor to bootstrap
      await this.waitForTorBootstrap();
      
      this.proxyAgent = new SocksProxyAgent('socks5h://127.0.0.1:9050');
      this.isConnected = true;
      
      console.log('Tor started successfully');
    } catch (error) {
      console.error('Failed to start Tor:', error);
      throw error;
    }
  }

  private async waitForTorBootstrap(): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Tor bootstrap timeout'));
      }, 60000);

      const checkBootstrap = async () => {
        try {
          const info = await this.torControl.getInfo('status/bootstrap-phase');
          if (info.includes('PROGRESS=100')) {
            clearTimeout(timeout);
            resolve();
          } else {
            setTimeout(checkBootstrap, 1000);
          }
        } catch (error) {
          clearTimeout(timeout);
          reject(error);
        }
      };

      checkBootstrap();
    });
  }

  async checkTorConnection(): Promise<boolean> {
    try {
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
    if (this.torProcess) {
      this.torProcess.kill();
      this.isConnected = false;
      this.proxyAgent = null;
    }
  }
}

export default TorService;