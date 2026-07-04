import fs from 'fs';
import path from 'path';
import styles from './collaborate.module.css';

export default function CollaboratePage() {
  const collaboratorsDir = path.join(process.cwd(), 'public', 'collaborators');
  let logos: string[] = [];

  try {
    if (fs.existsSync(collaboratorsDir)) {
      logos = fs.readdirSync(collaboratorsDir).filter(file => 
        file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png') || file.endsWith('.svg') || file.endsWith('.webp')
      );
    }
  } catch (error) {
    console.error('Error reading collaborators directory:', error);
  }


  const baseLogos = logos.length > 0 ? logos : Array.from({ length: 6 }, (_, i) => `placeholder-${i}`);


  const displayLogos: string[] = [];
  while (displayLogos.length < 10) {
    displayLogos.push(...baseLogos);
  }

  return (
    <main className={styles.collaboratePage}>
      <div className={styles.contentWrapper}>
        <h1 className={`font-display ${styles.mainTitle}`}>COLLABORATE WITH US</h1>

        <div className={styles.infoBlock}>
          <h2 className={`font-display ${styles.subTitle}`}>LET&apos;S MAKE{' '}<br className={styles.desktopBr} />SOMETHING HAPPEN</h2>
          <p className={styles.text}>
            We partner with cultural institutions, venues,{' '}<br className={styles.desktopBr} />
            local businesses, and makers to bring{' '}<br className={styles.desktopBr} />
            communities together. Private events,{' '}<br className={styles.desktopBr} />
            programming consultancy, event coordination,{' '}<br className={styles.desktopBr} />
            community activation, and more.
          </p>
          <p className={styles.text}>
            We also greatly appreciate any helping hand for{' '}<br className={styles.desktopBr} />
            organizing our events and teaching Mahjong to{' '}<br className={styles.desktopBr} />
            new players.
          </p>

          <div className={styles.socialBlock}>
            <a href="https://www.instagram.com/reddragonsocialclub" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              <span>@reddragonsocialclub</span>
            </a>
            <div className={styles.socialLink}>
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span>reddragonsocialclub@gmail.com</span>
            </div>
          </div>
        </div>

        <h2 className={`font-display ${styles.friendsTitle}`}>OUR FRIENDS AND COLLABORATORS</h2>
      </div>

      <div className={styles.marqueeContainer}>
        <div className={styles.marqueeTrack}>
          {/* We render two identical content blocks. The animation translates the track exactly 50% seamlessly */}
          <div className={styles.marqueeContent}>
            {displayLogos.map((logo, index) => (
              <div key={`set1-${logo}-${index}`} className={styles.logoCircle}>
                {logos.length > 0 && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={`/collaborators/${logo}`} alt="Collaborator Logo" className={styles.logoImage} />
                )}
              </div>
            ))}
          </div>
          <div className={styles.marqueeContent}>
            {displayLogos.map((logo, index) => (
              <div key={`set2-${logo}-${index}`} className={styles.logoCircle}>
                {logos.length > 0 && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={`/collaborators/${logo}`} alt="Collaborator Logo" className={styles.logoImage} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
