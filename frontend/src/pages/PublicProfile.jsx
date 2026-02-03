import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle, Globe, MapPin, Instagram, Facebook, Linkedin, Download } from 'lucide-react';
import { FaTiktok, FaYoutube } from 'react-icons/fa';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function PublicProfile() {
  const { uniqueLink } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [uniqueLink]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API}/profiles/public/${uniqueLink}`);
      if (response.data.is_archived) {
        navigate('/suspended');
        return;
      }
      setProfile(response.data);
    } catch (error) {
      toast.error('Profil non trouvé');
      navigate('/suspended');
    } finally {
      setLoading(false);
    }
  };

  const downloadVCard = async () => {
    try {
      const response = await axios.get(
        `${API}/profiles/${profile.profile_id}/vcard`,
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${profile.name}.vcf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Contact téléchargé !');
    } catch (error) {
      toast.error('Erreur lors du téléchargement');
    }
  };

  const openPhone = () => {
    window.location.href = `tel:${profile.phone}`;
  };

  const openWhatsApp = () => {
    const phone = (profile.whatsapp || profile.phone).replace(/\D/g, '');
    window.open(`https://wa.me/${phone}`, '_blank');
  };

  const openWebsite = () => {
    window.open(profile.website, '_blank');
  };

  const openMaps = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.address)}`, '_blank');
  };

  const openSocial = (platform, handle) => {
    const urls = {
      instagram: `https://instagram.com/${handle.replace('@', '')}`,
      facebook: handle.startsWith('http') ? handle : `https://facebook.com/${handle}`,
      linkedin: handle.startsWith('http') ? handle : `https://linkedin.com/in/${handle}`,
      tiktok: `https://tiktok.com/@${handle.replace('@', '')}`,
      youtube: handle.startsWith('http') ? handle : `https://youtube.com/@${handle}`
    };
    window.open(urls[platform], '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="text-white text-lg">Chargement...</div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const bgGradient = `linear-gradient(135deg, ${profile.primary_color} 0%, ${profile.secondary_color} 100%)`;

  return (
    <div 
      className="min-h-screen py-8 px-4 font-outfit"
      style={{ background: bgGradient }}
    >
      <div className="max-w-md mx-auto space-y-4">
        <div 
          data-testid="public-profile-card"
          className="glass-card rounded-3xl p-8 text-center text-white"
        >
          {profile.photo_url && (
            <img
              src={profile.photo_url}
              alt={profile.name}
              className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-white/30 shadow-xl"
            />
          )}
          <h1 className="text-3xl font-bold mb-2" data-testid="profile-name">{profile.name}</h1>
          <p className="text-xl text-white/90 mb-1" data-testid="profile-job">{profile.job}</p>
          <p className="text-white/70" data-testid="profile-phone">{profile.phone}</p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={openPhone}
            data-testid="call-btn"
            className="w-full glass-card text-white border-white/20 hover:bg-white/20 h-14 text-lg font-semibold rounded-2xl"
          >
            <Phone className="mr-3 h-5 w-5" />
            Appeler
          </Button>

          {(profile.whatsapp || profile.phone) && (
            <Button
              onClick={openWhatsApp}
              data-testid="whatsapp-btn"
              className="w-full glass-card text-white border-white/20 hover:bg-white/20 h-14 text-lg font-semibold rounded-2xl"
            >
              <MessageCircle className="mr-3 h-5 w-5" />
              WhatsApp
            </Button>
          )}

          {profile.website && (
            <Button
              onClick={openWebsite}
              data-testid="website-btn"
              className="w-full glass-card text-white border-white/20 hover:bg-white/20 h-14 text-lg font-semibold rounded-2xl"
            >
              <Globe className="mr-3 h-5 w-5" />
              Site Web
            </Button>
          )}

          {profile.address && (
            <Button
              onClick={openMaps}
              data-testid="maps-btn"
              className="w-full glass-card text-white border-white/20 hover:bg-white/20 h-14 text-lg font-semibold rounded-2xl"
            >
              <MapPin className="mr-3 h-5 w-5" />
              Localisation
            </Button>
          )}

          <Button
            onClick={downloadVCard}
            data-testid="vcard-download-btn"
            className="w-full glass-card text-white border-white/20 hover:bg-white/20 h-14 text-lg font-semibold rounded-2xl"
          >
            <Download className="mr-3 h-5 w-5" />
            Enregistrer le contact
          </Button>
        </div>

        {(profile.instagram || profile.facebook || profile.linkedin || profile.tiktok || profile.youtube) && (
          <div className="glass-card rounded-3xl p-6">
            <h2 className="text-white text-center font-semibold mb-4 text-lg">Réseaux sociaux</h2>
            <div className="flex justify-center gap-4 flex-wrap">
              {profile.instagram && (
                <button
                  onClick={() => openSocial('instagram', profile.instagram)}
                  data-testid="instagram-btn"
                  className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white backdrop-blur-sm border border-white/20 transition-all hover:scale-110"
                >
                  <Instagram className="h-6 w-6" />
                </button>
              )}
              {profile.facebook && (
                <button
                  onClick={() => openSocial('facebook', profile.facebook)}
                  data-testid="facebook-btn"
                  className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white backdrop-blur-sm border border-white/20 transition-all hover:scale-110"
                >
                  <Facebook className="h-6 w-6" />
                </button>
              )}
              {profile.linkedin && (
                <button
                  onClick={() => openSocial('linkedin', profile.linkedin)}
                  data-testid="linkedin-btn"
                  className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white backdrop-blur-sm border border-white/20 transition-all hover:scale-110"
                >
                  <Linkedin className="h-6 w-6" />
                </button>
              )}
              {profile.tiktok && (
                <button
                  onClick={() => openSocial('tiktok', profile.tiktok)}
                  data-testid="tiktok-btn"
                  className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white backdrop-blur-sm border border-white/20 transition-all hover:scale-110"
                >
                  <FaTiktok className="h-6 w-6" />
                </button>
              )}
              {profile.youtube && (
                <button
                  onClick={() => openSocial('youtube', profile.youtube)}
                  data-testid="youtube-btn"
                  className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white backdrop-blur-sm border border-white/20 transition-all hover:scale-110"
                >
                  <FaYoutube className="h-6 w-6" />
                </button>
              )}
            </div>
          </div>
        )}

        <div className="text-center pt-4">
          <p className="text-white/60 text-sm">Propulsé par JPM</p>
        </div>
      </div>
    </div>
  );
}