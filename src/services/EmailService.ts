import { ImapFlow } from 'imapflow';
import nodemailer from 'nodemailer';
import TorService from './TorService';

interface EmailConfig {
  user: string;
  password: string;
  host: string;
  port: number;
  tls: boolean;
}

class EmailService {
  private static instance: EmailService;
  private connections: Map<string, ImapFlow> = new Map();
  private torService: TorService;

  private constructor() {
    this.torService = TorService.getInstance();
  }

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  async connect(config: EmailConfig): Promise<boolean> {
    try {
      // Ensure Tor is running
      if (!this.torService.isConnectedToTor()) {
        await this.torService.start();
      }

      const proxyAgent = this.torService.getProxyAgent();
      if (!proxyAgent) {
        throw new Error('No Tor proxy available');
      }

      const client = new ImapFlow({
        host: config.host,
        port: config.port,
        secure: config.tls,
        auth: {
          user: config.user,
          pass: config.password
        },
        proxy: proxyAgent
      });

      await client.connect();
      this.connections.set(config.user, client);
      
      console.log(`Connected to email account: ${config.user}`);
      return true;
    } catch (error) {
      console.error('Failed to connect to email:', error);
      return false;
    }
  }

  async fetchEmails(email: string, folder: string = 'INBOX'): Promise<any[]> {
    const client = this.connections.get(email);
    if (!client) {
      throw new Error('Not connected to email account');
    }

    const lock = await client.getMailboxLock(folder);
    try {
      const messages = await client.fetch('1:*', { envelope: true, source: true });
      return Array.from(messages);
    } finally {
      lock.release();
    }
  }

  async sendEmail(from: string, to: string, subject: string, body: string): Promise<void> {
    const proxyAgent = this.torService.getProxyAgent();
    if (!proxyAgent) {
      throw new Error('No Tor proxy available');
    }

    const transport = nodemailer.createTransport({
      proxy: proxyAgent.proxy.href,
      secure: true,
      // Add email provider specific settings
    });

    await transport.sendMail({
      from,
      to,
      subject,
      text: body
    });
  }

  async disconnect(email: string): Promise<void> {
    const client = this.connections.get(email);
    if (client) {
      await client.logout();
      this.connections.delete(email);
    }
  }

  async disconnectAll(): Promise<void> {
    for (const [email, client] of this.connections) {
      await this.disconnect(email);
    }
  }
}

export default EmailService;