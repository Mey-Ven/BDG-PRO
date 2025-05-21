import { nanoid } from 'nanoid';
import prisma from './prisma';

/**
 * Génère un code de référence unique pour un agent
 * Format: AG-XXXXX (où X est un caractère alphanumérique)
 */
export async function generateReferralCode(): Promise<string> {
  let isUnique = false;
  let code = '';
  
  while (!isUnique) {
    // Générer un code de 5 caractères
    const randomPart = nanoid(5).toUpperCase();
    code = `AG-${randomPart}`;
    
    // Vérifier si le code existe déjà
    const existingAgent = await prisma.agent.findUnique({
      where: { referralCode: code },
    });
    
    if (!existingAgent) {
      isUnique = true;
    }
  }
  
  return code;
}

/**
 * Récupère un agent par son code de référence
 */
export async function getAgentByReferralCode(code: string) {
  if (!code) return null;
  
  return prisma.agent.findUnique({
    where: { referralCode: code },
  });
}

/**
 * Récupère tous les agents
 */
export async function getAllAgents() {
  return prisma.agent.findMany({
    orderBy: { name: 'asc' },
  });
}

/**
 * Récupère les statistiques de référencement pour un agent
 */
export async function getAgentReferralStats(agentId: string) {
  const totalSubmissions = await prisma.formSubmission.count({
    where: { agentId },
  });
  
  const submissionsByMonth = await prisma.$queryRaw`
    SELECT 
      strftime('%Y-%m', "createdAt") as month,
      COUNT(*) as count
    FROM "FormSubmission"
    WHERE "agentId" = ${agentId}
    GROUP BY month
    ORDER BY month DESC
    LIMIT 12
  `;
  
  return {
    totalSubmissions,
    submissionsByMonth,
  };
}

/**
 * Récupère les statistiques globales de référencement
 */
export async function getGlobalReferralStats() {
  const totalSubmissions = await prisma.formSubmission.count({
    where: {
      NOT: { agentId: null },
    },
  });
  
  const submissionsByAgent = await prisma.formSubmission.groupBy({
    by: ['agentId'],
    _count: {
      id: true,
    },
    where: {
      NOT: { agentId: null },
    },
    orderBy: {
      _count: {
        id: 'desc',
      },
    },
  });
  
  // Récupérer les noms des agents
  const agentIds = submissionsByAgent.map(item => item.agentId as string);
  const agents = await prisma.agent.findMany({
    where: {
      id: {
        in: agentIds,
      },
    },
    select: {
      id: true,
      name: true,
    },
  });
  
  // Combiner les données
  const statsWithNames = submissionsByAgent.map(stat => {
    const agent = agents.find(a => a.id === stat.agentId);
    return {
      agentId: stat.agentId,
      agentName: agent?.name || 'Agent inconnu',
      count: stat._count.id,
    };
  });
  
  return {
    totalSubmissions,
    submissionsByAgent: statsWithNames,
  };
}
