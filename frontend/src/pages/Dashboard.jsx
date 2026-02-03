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
      await axios.patch(
        `${API}/profiles/${profileId}/archive`,
        {},
        { withCredentials: true }
      );
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
    nextRenewal.setDate(nextRenewal.getDate() + 30);
    const today = new Date();
    const diffTime = nextRenewal - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-jpm-black">
      <div className="bg-jpm-surface border-b border-jpm-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="font-serif text-3xl font-bold text-jpm-gold">JPM Dashboard</h1>
              <p className="text-gray-400 text-sm mt-1">Gestion des cartes de visite digitales</p>
            </div>
            <Button
              onClick={handleLogout}
              data-testid="logout-btn"
              variant="outline"
              className="border-jpm-gold/30 text-jpm-gold hover:bg-jpm-gold/10"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              data-testid="search-input"
              placeholder="Rechercher par nom ou métier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-jpm-surface border-white/10 text-white focus:border-jpm-gold"
            />
          </div>

          <Button
            onClick={() => navigate('/profiles/new')}
            data-testid="create-profile-btn"
            className="bg-jpm-gold hover:bg-jpm-gold-light text-black font-semibold"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Profil
          </Button>
        </div>

        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          <Button
            onClick={() => setFilterType('all')}
            data-testid="filter-all-btn"
            variant={filterType === 'all' ? 'default' : 'outline'}
            className={filterType === 'all' ? 'bg-jpm-gold text-black' : 'border-white/10 text-gray-300 hover:bg-white/5'}
          >
            <Filter className="mr-2 h-4 w-4" />
            Tous
          </Button>
          <Button
            onClick={() => setFilterType('expiring')}
            data-testid="filter-expiring-btn"
            variant={filterType === 'expiring' ? 'default' : 'outline'}
            className={filterType === 'expiring' ? 'bg-jpm-gold text-black' : 'border-white/10 text-gray-300 hover:bg-white/5'}
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Expire &lt; 30j
          </Button>
          <Button
            onClick={() => setFilterType('archived')}
            data-testid="filter-archived-btn"
            variant={filterType === 'archived' ? 'default' : 'outline'}
            className={filterType === 'archived' ? 'bg-jpm-gold text-black' : 'border-white/10 text-gray-300 hover:bg-white/5'}
          >
            <Archive className="mr-2 h-4 w-4" />
            Archivés
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Chargement...</div>
        ) : filteredProfiles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">Aucun profil trouvé</p>
            <Button
              onClick={() => navigate('/profiles/new')}
              className="bg-jpm-gold hover:bg-jpm-gold-light text-black"
            >
              Créer votre premier profil
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((profile) => {
              const daysUntilRenewal = getDaysUntilRenewal(profile.subscription_start);
              const isExpiringSoon = daysUntilRenewal <= 30 && daysUntilRenewal > 0;
              const isExpired = daysUntilRenewal <= 0;

              return (
                <div
                  key={profile.profile_id}
                  data-testid={`profile-card-${profile.profile_id}`}
                  className="bg-jpm-surface border border-white/5 rounded-xl p-6 hover:border-jpm-gold/30 transition-all hover:shadow-lg hover:shadow-jpm-gold/5"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-jpm-gold-light font-semibold text-lg mb-1">{profile.name}</h3>
                      <p className="text-gray-400 text-sm">{profile.job}</p>
                    </div>
                    {profile.is_archived && (
                      <Badge variant="secondary" className="bg-red-500/20 text-red-300">Archivé</Badge>
                    )}
                    {!profile.is_archived && isExpiringSoon && (
                      <Badge variant="secondary" className="bg-orange-500/20 text-orange-300">
                        {daysUntilRenewal}j restants
                      </Badge>
                    )}
                    {!profile.is_archived && isExpired && (
                      <Badge variant="secondary" className="bg-red-500/20 text-red-300">Expiré</Badge>
                    )}
                  </div>

                  <div className="text-sm text-gray-500 mb-4">
                    <p>Tél: {profile.phone}</p>
                    <p className="mt-1 font-mono text-xs text-jpm-gold/60">{profile.unique_link}</p>
                    <p className="mt-1 text-xs">Créé: {new Date(profile.created_at).toLocaleDateString('fr-FR')}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => window.open(`/${profile.unique_link}`, '_blank')}
                      data-testid={`view-profile-${profile.profile_id}`}
                      size="sm"
                      variant="outline"
                      className="flex-1 border-white/10 text-gray-300 hover:bg-white/5"
                    >
                      <Eye className="mr-1 h-4 w-4" />
                      Voir
                    </Button>
                    <Button
                      onClick={() => navigate(`/profiles/edit/${profile.profile_id}`)}
                      data-testid={`edit-profile-${profile.profile_id}`}
                      size="sm"
                      variant="outline"
                      className="flex-1 border-white/10 text-gray-300 hover:bg-white/5"
                    >
                      <Edit className="mr-1 h-4 w-4" />
                      Modifier
                    </Button>
                    <Button
                      onClick={() => handleArchive(profile.profile_id, profile.is_archived)}
                      data-testid={`archive-profile-${profile.profile_id}`}
                      size="sm"
                      variant="outline"
                      className="border-white/10 text-gray-300 hover:bg-white/5"
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                  </div>

                  {!profile.is_archived && isExpiringSoon && profile.phone && (
                    <Button
                      onClick={() => openWhatsApp(profile.phone, profile.name)}
                      data-testid={`whatsapp-${profile.profile_id}`}
                      size="sm"
                      className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      WhatsApp Renouvellement
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}