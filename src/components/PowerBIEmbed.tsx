
import React from 'react';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';

interface PowerBIReportProps {
  reportId: string;
  embedUrl: string;
  accessToken: string; // Token généré par le backend via Azure AD
  showFilterPane?: boolean;
  showNavContent?: boolean;
}

/**
 * Composant Professionnel pour l'intégration Power BI.
 * Nécessite un Backend pour générer les tokens d'accès sécurisés (Embed Token).
 */
export const MespPowerBIReport: React.FC<PowerBIReportProps> = ({
  reportId,
  embedUrl,
  accessToken,
  showFilterPane = false,
  showNavContent = true
}) => {
  return (
    <div className="h-full w-full bg-slate-50 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
      <PowerBIEmbed
        embedConfig={{
          type: 'report',
          id: reportId,
          embedUrl: embedUrl,
          accessToken: accessToken,
          tokenType: models.TokenType.Embed, // Ou TokenType.Aad pour l'organisation
          settings: {
            panes: {
              filters: {
                expanded: false,
                visible: showFilterPane
              },
              pageNavigation: {
                visible: showNavContent
              }
            },
            background: models.BackgroundType.Transparent,
          }
        }}
        eventHandlers={
          new Map([
            ['loaded', function () { console.log('Rapport Power BI chargé'); }],
            ['rendered', function () { console.log('Rapport rendu'); }],
            ['error', function (event) { console.error('Erreur Power BI:', event?.detail); }]
          ])
        }
        cssClassName={"h-full w-full"}
        getEmbeddedComponent={(embeddedReport) => {
          // Permet de manipuler le rapport via code (ex: changer les filtres dynamiquement)
          // (window as any).report = embeddedReport;
        }}
      />
    </div>
  );
};
