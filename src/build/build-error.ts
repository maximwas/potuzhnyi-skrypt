// Очікувана помилка збірки (конфіг, вхідні файли, esbuild): показуємо повідомлення без стеку.
export class BuildError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'BuildError';
  }
}
