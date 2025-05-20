"use client"

import { useEffect } from 'react';
import { scrollToSection } from '@/lib/smooth-scroll';

/**
 * Composant qui ajoute un comportement de défilement personnalisé aux liens d'ancrage
 * pour centrer verticalement les sections ciblées dans la fenêtre du navigateur.
 */
export default function SmoothScroll() {
  useEffect(() => {
    // Fonction pour gérer les clics sur les liens d'ancrage
    const handleClick = (event: MouseEvent) => {
      // Vérifier si l'élément cliqué est un lien
      const target = event.target as HTMLElement;
      const link = target.closest('a');
      
      if (!link) return;
      
      const href = link.getAttribute('href');
      
      // Vérifier si c'est un lien d'ancrage interne
      if (href && href.startsWith('#') && href.length > 1) {
        event.preventDefault();
        
        // Extraire l'ID de la section cible (sans le #)
        const targetId = href.substring(1);
        
        // Appliquer le défilement personnalisé
        scrollToSection(targetId);
        
        // Mettre à jour l'URL sans recharger la page
        window.history.pushState(null, '', href);
      }
    };
    
    // Ajouter l'écouteur d'événements au document
    document.addEventListener('click', handleClick);
    
    // Gérer les liens d'ancrage dans l'URL lors du chargement initial
    const handleInitialHash = () => {
      const hash = window.location.hash;
      if (hash && hash.length > 1) {
        // Attendre que le DOM soit complètement chargé
        setTimeout(() => {
          scrollToSection(hash.substring(1));
        }, 100);
      }
    };
    
    // Appliquer le défilement initial si nécessaire
    handleInitialHash();
    
    // Nettoyer l'écouteur d'événements lors du démontage du composant
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);
  
  // Ce composant ne rend rien dans le DOM
  return null;
}
