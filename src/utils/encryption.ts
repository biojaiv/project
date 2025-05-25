// Use native Web Crypto API
const encoder = new TextEncoder();
const decoder = new TextDecoder();

// Generate a random encryption key
const generateKey = async (): Promise<CryptoKey> => {
  return await crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256
    },
    true,
    ['encrypt', 'decrypt']
  );
};

// Encrypt data
export const encryptData = async (data: string): Promise<string> => {
  try {
    const key = await generateKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encodedData = encoder.encode(data);

    const encryptedData = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv
      },
      key,
      encodedData
    );

    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + new Uint8Array(encryptedData).length);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedData), iv.length);

    // Convert to base64
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

// Decrypt data
export const decryptData = async (encryptedData: string): Promise<string> => {
  try {
    const key = await generateKey();
    const combined = new Uint8Array(
      atob(encryptedData)
        .split('')
        .map(char => char.charCodeAt(0))
    );

    // Extract IV and encrypted data
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    const decryptedData = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv
      },
      key,
      data
    );

    return decoder.decode(decryptedData);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
};

// Hash password using SHA-256
export const hashPassword = async (password: string): Promise<string> => {
  const encodedPassword = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', encodedPassword);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Verify password
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  const hashedInput = await hashPassword(password);
  return hashedInput === hashedPassword;
};

// Generate secure random password
export const generateSecurePassword = (): string => {
  const length = 16;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset[array[i] % charset.length];
  }
  return password;
};