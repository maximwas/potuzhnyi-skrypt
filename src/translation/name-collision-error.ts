interface NameCollisionDetails {
  readonly firstName: string;
  readonly secondName: string;
  readonly latinName: string;
  readonly fileName: string;
  readonly line: number;
}

export class NameCollisionError extends SyntaxError {
  public readonly details: NameCollisionDetails;

  public constructor(details: NameCollisionDetails) {
    super(
      `«${details.secondName}» і «${details.firstName}» дають однакове латинське імʼя ` +
        `«${details.latinName}» (${details.fileName}:${details.line}). Перейменуй одне з них.`,
    );

    this.name = 'NameCollisionError';
    this.details = details;
  }
}
