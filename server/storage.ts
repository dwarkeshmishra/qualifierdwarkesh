import { ArrayResponse } from "@shared/schema";

export interface IStorage {
  processArray(data: string[]): Promise<ArrayResponse>;
  getOperationCode(): Promise<number>;
}

export class MemStorage implements IStorage {
  private userId = "john_doe_17091999";
  private email = "john@xyz.com"; 
  private rollNumber = "ABCD123";

  async processArray(data: string[]): Promise<ArrayResponse> {
    const numbers: string[] = [];
    const alphabets: string[] = [];
    
    data.forEach(item => {
      if (/^\d+$/.test(item)) {
        numbers.push(item);
      } else if (/^[A-Za-z]$/.test(item)) {
        alphabets.push(item);
      }
    });

    const highest_alphabet = alphabets.length > 0 ? 
      [alphabets.reduce((a, b) => a.toLowerCase() > b.toLowerCase() ? a : b)] : 
      [];

    return {
      is_success: true,
      user_id: this.userId,
      email: this.email,
      roll_number: this.rollNumber,
      numbers,
      alphabets,
      highest_alphabet
    };
  }

  async getOperationCode(): Promise<number> {
    return 1;
  }
}

export const storage = new MemStorage();
