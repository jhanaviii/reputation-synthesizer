
import { ExternalLink } from 'lucide-react';
import { Person } from '../utils/mockData';

interface SocialMediaLinksProps {
  person: Person;
}

export const SocialMediaLinks = ({ person }: SocialMediaLinksProps) => {
  // Map platform names to colors
  const platformColors: Record<string, string> = {
    LinkedIn: 'bg-[#0A66C2] hover:bg-[#0A66C2]/90',
    Twitter: 'bg-[#1DA1F2] hover:bg-[#1DA1F2]/90',
    GitHub: 'bg-[#333333] hover:bg-[#333333]/90',
    Dribbble: 'bg-[#EA4C89] hover:bg-[#EA4C89]/90',
    Instagram: 'bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] hover:opacity-90',
    Facebook: 'bg-[#1877F2] hover:bg-[#1877F2]/90',
    'Stack Overflow': 'bg-[#F48024] hover:bg-[#F48024]/90',
    Medium: 'bg-[#000000] hover:bg-[#000000]/90',
    YouTube: 'bg-[#FF0000] hover:bg-[#FF0000]/90',
    Behance: 'bg-[#1769FF] hover:bg-[#1769FF]/90'
  };
  
  // Map platform names to default colors if not found
  const getButtonStyle = (platform: string): string => {
    return platformColors[platform] || 'bg-secondary hover:bg-secondary/80';
  };
  
  // Social media platforms grouped by category
  const professionalPlatforms = ['LinkedIn', 'GitHub', 'Stack Overflow', 'Medium', 'Behance'];
  const socialPlatforms = ['Twitter', 'Instagram', 'Facebook', 'YouTube', 'Dribbble'];
  
  const professionalLinks = person.socialMedia.filter(social => 
    professionalPlatforms.includes(social.platform)
  );
  
  const socialLinks = person.socialMedia.filter(social => 
    socialPlatforms.includes(social.platform)
  );
  
  return (
    <div className="premium-card">
      <div className="px-6 py-5 border-b border-border/40">
        <h2 className="text-lg font-semibold">Online Presence</h2>
      </div>
      
      <div className="px-6 py-4">
        {person.socialMedia.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm">No social media profiles available</p>
          </div>
        ) : (
          <div className="space-y-5">
            {professionalLinks.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-3">Professional</h3>
                <div className="flex flex-wrap gap-2">
                  {professionalLinks.map(social => (
                    <a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center px-4 py-2 rounded-full text-white text-sm font-medium transition-all ${getButtonStyle(social.platform)}`}
                    >
                      {social.platform}
                      <ExternalLink className="w-3.5 h-3.5 ml-2" />
                    </a>
                  ))}
                </div>
              </div>
            )}
            
            {socialLinks.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-3">Social</h3>
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map(social => (
                    <a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center px-4 py-2 rounded-full text-white text-sm font-medium transition-all ${getButtonStyle(social.platform)}`}
                    >
                      {social.platform}
                      <ExternalLink className="w-3.5 h-3.5 ml-2" />
                    </a>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <h3 className="text-sm font-medium mb-1">Reputation Score</h3>
              <div className="flex items-center space-x-2">
                <div className="flex-1">
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-in-out"
                      style={{ 
                        width: `${person.reputationScore}%`,
                        backgroundColor: 
                          person.reputationScore >= 80 ? '#22c55e' :
                          person.reputationScore >= 60 ? '#f59e0b' :
                          '#ef4444'
                      }}
                    ></div>
                  </div>
                </div>
                <div className="text-sm font-semibold">
                  {person.reputationScore}/100
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Based on {person.socialMedia.length} online platforms and activity metrics
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialMediaLinks;
