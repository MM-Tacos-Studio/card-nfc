import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Plus, LogOut, Eye, Edit, Archive, MessageCircle, Search, Filter, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Dashboard() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = profiles.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.job.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProfiles(filtered);
    } else {
      setFilteredProfiles(profiles);
    }
  }, [searchQuery, profiles]);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/profiles`, {
        params: filterType !== 'all' ? { filter: filterType } : {},
        withCredentials: true
      });
      setProfiles(response.data);
      setFilteredProfiles(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des profils');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
      navigate('/login');
    } catch (error) {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  const handleArchive = async (profileId, isArchived) => {
    try {
      await axios.patch(`${API}/profiles/${profileId}/archive`, {}, { withCredentials: true });
      toast.success(isArchived ? 'Profil réactivé' : 'Profil archivé');
      fetchProfiles();
    } catch (error) {
      toast.error('Erreur lors de l\'archivage');
    }
  };

  const openWhatsApp = (phone, name) => {
    const message = encodeURIComponent(`Bonjour ${name}, votre abonnement JPM arrive à expiration. Souhaitez-vous le renouveler ?`);
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  const getDaysUntilRenewal = (subscriptionStart) => {
    const start = new Date(subscriptionStart);
    const nextRenewal = new Date(start);
    nextRenewal.setFullYear(nextRenewal.getFullYear() + 1);
    const today = new Date();
    const diffTime = nextRenewal - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen bg-[#0f1113] text-white">
      {/* HEADER */}
      <div className="bg-[#1a1c1e] border-b border-jpm-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-jpm-gold">JPM Cards</h1>
            <p className="text-gray-500 text-sm">Administration des profils premium</p>
          </div>
          <Button onClick={handleLogout} variant="ghost" className="text-gray-400 hover:text-white">
            <LogOut className="mr-2 h-4 w-4" /> Déconnexion
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ACTIONS & RECHERCHE */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input 
              placeholder="Rechercher un client..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#1a1c1e] border-white/5"
            />
          </div>
          <Button onClick={() => navigate('/profiles/new')} className="bg-jpm-gold text-black font-bold w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Nouveau Profil
          </Button>
        </div>

        {/* FILTRES */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {['all', 'expiring', 'archived'].map((type) => (
            <Button
              key={type}
              onClick={() => setFilterType(type)}
              variant={filterType === type ? 'default' : 'outline'}
              className={filterType === type ? 'bg-jpm-gold text-black' : 'border-white/5 text-gray-400'}
            >
              {type === 'all' && `Tous (${profiles.length})`}
              {type === 'expiring' && `A renouveler (${profiles.filter(p => getDaysUntilRenewal(p.subscription_start) <= 30).length})`}
              {type === 'archived' && `Archives (${profiles.filter(p => p.is_archived).length})`}
            </Button>
          ))}
        </div>

        {/* GRILLE DE PROFILS */}
        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-jpm-gold"></div></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((profile) => {
              const days = getDaysUntilRenewal(profile.subscription_start);
              return (
                <div key={profile.profile_id} className="bg-[#1a1c1e] rounded-2xl overflow-hidden border border-white/5 hover:border-jpm-gold/50 transition-all group">
                  {/* MINIATURE COVER */}
                  <div className="h-24 w-full bg-gray-800 relative">
                    <img src={profile.cover_url || "https://images.unsplash.com/photo-1557683316-973673baf926"} className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" alt="" />
                    <div className="absolute top-2 right-2">
                      {profile.is_archived ? (
                        <Badge className="bg-red-500">Archivé</Badge>
                      ) : days <= 30 ? (
                        <Badge className="bg-orange-500">{days}j restants</Badge>
                      ) : (
                        <Badge className="bg-green-600">Actif</Badge>
                      )}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-4 mb-4">
                      <img src={profile.photo_url || "https://via.placeholder.com/150"} className="w-12 h-12 rounded-full border border-jpm-gold/20 object-cover" alt="" />
                      <div>
                        <h3 className="font-bold text-white">{profile.name}</h3>
                        <p className="text-gray-500 text-xs">{profile.job}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                     <Button onClick={() => window.open(`/p/${profile.unique_link}`, '_blank')} variant="outline" size="sm" className="flex-1 border-white/5 hover:bg-white/10">
  <Eye className="h-4 w-4 mr-2" /> Voir
</Button>
                      <Button onClick={() => navigate(`/profiles/edit/${profile.profile_id}`)} variant="outline" size="sm" className="flex-1 border-white/5 hover:bg-white/10">
                        <Edit className="h-4 w-4 mr-2" /> Éditer
                      </Button>
                      <Button onClick={() => handleArchive(profile.profile_id, profile.is_archived)} variant="outline" size="sm" className="border-white/5 hover:text-red-400">
                        <Archive className="h-4 w-4" />
                      </Button>
                    </div>

                    {!profile.is_archived && days <= 30 && (
                      <Button onClick={() => openWhatsApp(profile.phone, profile.name)} className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white text-xs">
                        <MessageCircle className="h-3 w-3 mr-2" /> Relancer via WhatsApp
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}