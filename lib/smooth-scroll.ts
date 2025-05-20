/**
 * Fonction pour faire défiler la page vers une section ciblée avec un décalage vertical
 * pour centrer la section dans la fenêtre du navigateur.
 * 
 * @param targetId - L'ID de la section cible (sans le #)
 * @param offset - Décalage supplémentaire en pixels (par défaut: 0)
 */
export const scrollToSection = (targetId: string, offset: number = 0): void => {
  // Trouver l'élément cible par son ID
  const targetElement = document.getElementById(targetId);
  
  if (!targetElement) {
    console.warn(`Element with id "${targetId}" not found.`);
    return;
  }

  // Calculer la position de l'élément par rapport au haut de la page
  const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
  
  // Calculer la hauteur de la fenêtre
  const windowHeight = window.innerHeight;
  
  // Calculer la hauteur de l'élément cible
  const targetHeight = targetElement.offsetHeight;
  
  // Calculer la position de défilement pour centrer l'élément
  // Si l'élément est plus grand que la fenêtre, on le place en haut
  // Sinon, on le centre verticalement
  let scrollPosition;
  
  if (targetHeight >= windowHeight) {
    // Si l'élément est plus grand que la fenêtre, on le place en haut avec un petit décalage
    scrollPosition = targetPosition - 100 + offset;
  } else {
    // Sinon, on centre l'élément verticalement dans la fenêtre
    scrollPosition = targetPosition - (windowHeight - targetHeight) / 2 + offset;
  }
  
  // Faire défiler la page en douceur
  window.scrollTo({
    top: scrollPosition,
    behavior: 'smooth'
  });
};

/**
 * Fonction pour intercepter les clics sur les liens d'ancrage et appliquer le défilement personnalisé
 * 
 * @param event - L'événement de clic
 */
export const handleAnchorClick = (event: React.MouseEvent<HTMLAnchorElement>): void => {
  const href = event.currentTarget.getAttribute('href');
  
  // Vérifier si c'est un lien d'ancrage interne
  if (href && href.startsWith('#')) {
    event.preventDefault();
    
    // Extraire l'ID de la section cible (sans le #)
    const targetId = href.substring(1);
    
    // Appliquer le défilement personnalisé
    scrollToSection(targetId);
  }
};
