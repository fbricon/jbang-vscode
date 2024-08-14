import { version } from "../extension";

const DEFAULT_FETCH_CONFIG = {
  headers: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "User-Agent": "jbang-vscode v" + version,
  },
};

export async function getJson(uri: string): Promise<any | undefined> {
  return (await get(uri))?.json();
}

export async function getText(uri: string): Promise<string | undefined> {
  return (await get(uri))?.text();
}

async function get(uri: string): Promise<Response | undefined> {
    console.log(`Fetching ${uri}`);
    try {
      const response = await fetch(uri, DEFAULT_FETCH_CONFIG);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response;
    } catch (error) {
      console.error(`Failed to fetch data from ${uri}`, error);
      return undefined;
    }
  }