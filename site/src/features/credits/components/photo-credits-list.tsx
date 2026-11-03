import { getPhotoCredits } from '@/lib/get-photo-credits';
import type { PhotoCategory, PhotoCredit } from '@/types/photo-credit';

const groups: readonly { readonly category: PhotoCategory; readonly label: string }[] = [
  { category: 'kyiv', label: 'Київ' },
  { category: 'zelensky', label: 'Зеленський' },
  { category: 'politician', label: 'Політики' },
];

const linkClassName =
  'break-words text-yellow underline underline-offset-2 hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow';

function getAuthorName(credit: PhotoCredit): string {
  const [head] = credit.attributionUk.split(' / Wikimedia Commons');

  return (head ?? credit.author).replace('Фото: ', '');
}

export function PhotoCreditsList() {
  const credits = getPhotoCredits();

  return (
    <div className="grid gap-8 min-[900px]:grid-cols-2">
      {groups.map((group) => (
        <section key={group.category} aria-labelledby={`credits-${group.category}`}>
          <h4 id={`credits-${group.category}`} className="font-mono text-sm text-yellow">
            {group.label}
          </h4>
          <ul className="mt-3 space-y-3 text-sm leading-relaxed text-paper">
            {credits
              .filter((credit) => credit.category === group.category)
              .map((credit) => (
                <li key={credit.file} className="break-words">
                  {credit.captionUk} — Фото:{' '}
                  <a
                    href={credit.commonsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClassName}
                  >
                    {getAuthorName(credit)}
                  </a>{' '}
                  / Wikimedia Commons,{' '}
                  <a
                    href={credit.licenseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClassName}
                  >
                    {credit.license}
                  </a>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
