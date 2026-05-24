import { Award, ExternalLink, ShieldCheck, Compass, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import api from '../services/api';

const certificationsData = [
  {
    id: 'aws-csa',
    title: 'AWS Certified Solutions Architect - Associate',
    provider: 'Amazon Web Services',
    difficulty: 'Intermediate',
    category: 'Cloud',
    sequence: 1,
    url: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/',
    logoColor: 'from-amber-500 to-orange-600',
    description: 'Validates ability to design robust, secure, and cost-effective cloud systems on AWS.'
  },
  {
    id: 'azure-fund',
    title: 'Microsoft Certified: Azure Fundamentals',
    provider: 'Microsoft Azure',
    difficulty: 'Beginner',
    category: 'Cloud',
    sequence: 2,
    url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/',
    logoColor: 'from-blue-500 to-indigo-600',
    description: 'Foundational level knowledge of cloud services and how Azure provides those services.'
  },
  {
    id: 'gcp-ace',
    title: 'Google Cloud Associate Cloud Engineer',
    provider: 'Google Cloud Platform',
    difficulty: 'Intermediate',
    category: 'Cloud',
    sequence: 3,
    url: 'https://cloud.google.com/learn/certification/associate-cloud-engineer',
    logoColor: 'from-emerald-500 to-teal-600',
    description: 'Validates ability to deploy applications, monitor operations, and manage enterprise cloud solutions.'
  },
  {
    id: 'cka',
    title: 'Certified Kubernetes Administrator (CKA)',
    provider: 'Cloud Native Computing Foundation',
    difficulty: 'Advanced',
    category: 'DevOps',
    sequence: 4,
    url: 'https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka/',
    logoColor: 'from-cyan-500 to-blue-600',
    description: 'Confirms skills in managing, configuring, and containerizing apps in Kubernetes clusters.'
  },
  {
    id: 'terraform-assoc',
    title: 'HashiCorp Certified: Terraform Associate',
    provider: 'HashiCorp',
    difficulty: 'Intermediate',
    category: 'DevOps',
    sequence: 5,
    url: 'https://www.hashicorp.com/certification/terraform-associate',
    logoColor: 'from-purple-500 to-pink-600',
    description: 'Demonstrates understanding of Infrastructure as Code principles and Terraform CLI usage.'
  }
];

export default function CertificationsPage() {
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/user/progress', { params: { userId: user.id } })
      .then(({ data }) => {
        setProgress(data.progress);
        setLoading(false);
      })
      .catch(() => {
        setProgress(null);
        setLoading(false);
      });
  }, [user.id]);

  // Calculate certificate category progress based on roadmap progress
  const getCategoryProgress = (category) => {
    if (!progress || !progress.categories) return 0;
    const cat = progress.categories.find(c => c.category.toLowerCase() === category.toLowerCase());
    return cat ? cat.completionPercentage : 0;
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        eyebrow="Credentials Guide"
        title="Enterprise Certifications"
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {certificationsData.map((cert, index) => {
          const catProgress = getCategoryProgress(cert.category);
          
          return (
            <motion.article
              key={cert.id}
              className="glass-panel group relative flex flex-col justify-between overflow-hidden rounded-3xl p-6 transition-all duration-300 hover:border-neon-purple/40 hover:shadow-neon-purple"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5 }}
            >
              {/* Card Header */}
              <div>
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${cert.logoColor} text-white shadow-lg`}>
                    <Award size={24} className="animate-pulse" />
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="rounded-full border border-slate-700 bg-slate-950 px-2.5 py-0.5 text-xs font-semibold text-slate-300">
                      Step {cert.sequence}
                    </span>
                    <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      cert.difficulty === 'Beginner' 
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' 
                        : cert.difficulty === 'Intermediate'
                        ? 'border-neon-blue/30 bg-neon-blue/10 text-neon-blue'
                        : 'border-neon-purple/30 bg-neon-purple/10 text-neon-purple'
                    }`}>
                      {cert.difficulty}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-neon-cyan">{cert.provider}</p>
                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-neon-purple transition-colors line-clamp-2">
                    {cert.title}
                  </h3>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  {cert.description}
                </p>
              </div>

              {/* Progress Tracking Section */}
              <div className="mt-6 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Compass size={14} /> Related {cert.category} Syllabus
                    </span>
                    <span className="font-bold text-neon-purple">{catProgress}% Complete</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-950">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan transition-all duration-500" 
                      style={{ width: `${catProgress}%` }}
                    />
                  </div>
                </div>

                {/* External Button */}
                <a
                  href={cert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-neon-purple to-neon-blue py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:shadow-neon-purple hover:-translate-y-0.5"
                >
                  Open Official Page
                  <ExternalLink size={15} />
                </a>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
