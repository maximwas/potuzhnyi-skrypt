import { withBasePath } from '@/lib/with-base-path';
import { getPhotoCredit } from '@/lib/get-photo-credits';

interface HeroPhotoProps {
  readonly file: string;
  readonly aspectClassName: string;
  readonly isPriority?: boolean;
}

export function HeroPhoto({ file, aspectClassName, isPriority = false }: HeroPhotoProps) {
  const credit = getPhotoCredit(file);

  return (
    <figure className="m-0 flex h-full flex-col">
      <img
        src={withBasePath(`/photos/${credit.file}`)}
        alt={credit.altUk}
        width={credit.width}
        height={credit.height}
        loading={isPriority ? 'eager' : 'lazy'}
        fetchPriority={isPriority ? 'high' : 'auto'}
        decoding="async"
        className={`w-full rounded-sm border-2 border-paper object-cover ${aspectClassName}`}
      />
      <figcaption className="mt-2 text-sm leading-snug text-paper">
        {credit.captionUk}
        <span className="mt-0.5 block font-mono text-xs text-paper-2">{credit.attributionUk}</span>
      </figcaption>
    </figure>
  );
}
