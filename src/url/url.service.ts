import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ShortenedURL, UrlStore } from '../common/storage/url.store';
import { Status } from '../common/enums/enums';
import { EncodeUrlResponse } from '../common/interface/interface';

@Injectable()
export class UrlService {
  private readonly domain = process.env.DOMAIN;

  /**
   * Generates a unique shortcode for the URL.
   * The shortcode is a 6-character alphanumeric string.
   * Ensures that the generated code does not already exist in the UrlStore.
   *
   * @returns {string} The unique shortcode.
   */
  generateShortCode(): string {
    let code: string;
    do {
      code = Math.random().toString(36).substring(2, 8);
    } while (UrlStore.has(code));
    return code;
  }

  /**
   * Encodes a long URL into a shortened URL.
   * Generates a unique shortcode for the original URL and stores it in UrlStore.
   * Returns the shortened URL along with the shortcode.
   *
   * @param {string} originalUrl - The original long URL to be shortened.
   * @returns {EncodeUrlResponse} The shortened URL and the corresponding shortcode.
   */
  encodeLongUrl(originalUrl: string): EncodeUrlResponse {
    const code = this.generateShortCode();
    const entry: ShortenedURL = {
      id: uuidv4(),
      shortCode: code,
      originalUrl,
      createdAt: new Date(),
      visitCount: 0,
      searchCount: 0,
      status: Status.ACTIVE,
    };

    UrlStore.set(code, entry);

    return {
      shortUrl: `${this.domain}/${code}`,
      code,
    };
  }
}
