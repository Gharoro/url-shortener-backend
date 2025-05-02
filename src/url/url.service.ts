import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ShortenedURL, UrlStore } from '../common/storage/url.store';
import { Status } from '../common/enums/enums';
import {
  DecodeUrlResponse,
  EncodeUrlResponse,
} from '../common/interface/interface';

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

  /**
   * Decodes a shortened URL into the original long URL.
   * Retrieves the original URL from UrlStore using the shortcode.
   * If the shortcode does not exist or the URL is inactive, returns null.
   *
   * @param {string} code - The shortcode of the shortened URL.
   * @returns {DecodeUrlResponse | null} The original long URL or null if the shortcode is invalid.
   */
  decodeShortUrl(code: string): DecodeUrlResponse | null {
    const entry = UrlStore.get(code);

    // If the entry is found and the status is ACTIVE, return the original URL
    if (entry && entry.status === Status.ACTIVE) {
      return {
        originalUrl: entry.originalUrl,
      };
    }

    return null;
  }

  /**
   * Lists all shortened URLs with optional search and pagination metadata.
   *
   * @param {string} [search] - Search term to filter original URLs.
   * @param {number} [page=1] - Page number.
   * @param {number} [limit=10] - Items per page.
   * @returns {{
   *   urls: ShortenedURL[],
   *   totalCount: number,
   *   totalPages: number,
   *   currentPage: number,
   *   hasNextPage: boolean,
   *   hasPreviousPage: boolean
   * }} Paginated result with metadata.
   */
  listAllShortenedUrls(search?: string, page = 1, limit = 10) {
    let entries = Array.from(UrlStore.values());

    if (search) {
      const query = search.toLowerCase();
      entries = entries.filter((entry) =>
        entry.originalUrl.toLowerCase().includes(query),
      );
    }

    const totalCount = entries.length;
    const totalPages = Math.ceil(totalCount / limit);
    const currentPage = Math.max(1, Math.min(page, totalPages || 1));

    const start = (currentPage - 1) * limit;
    const end = start + limit;
    const paginated = entries.slice(start, end);

    return {
      urls: paginated,
      totalCount,
      totalPages,
      currentPage,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    };
  }

  /**
   * Retrieves metadata for a specific shortened URL by shortcode.
   *
   * @param {string} code - The short code representing the URL.
   * @returns {ShortenedURL | null} The stored URL metadata or null if not found.
   */
  getUrlStatistics(code: string): ShortenedURL | null {
    const entry = UrlStore.get(code);

    if (!entry) return null;

    return entry;
  }
}
