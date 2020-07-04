export class Utils {
  getIdFromURL(url: string) {
    return url.split('/').pop();
  }
}
