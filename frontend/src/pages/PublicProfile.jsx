import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle, Globe, MapPin, Instagram, Facebook, Linkedin, Download, Mail } from 'lucide-react';
import { FaTiktok, FaYoutube } from 'react-icons/fa';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

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
      <div className="max-w-md mx-auto space-y-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          data-testid="public-profile-card"
          className="glass-card rounded-3xl p-8 text-center text-white shadow-2xl"
        >
          {profile.photo_url && (
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              src={profile.photo_url}
              alt={profile.name}
              className="w-36 h-36 rounded-full mx-auto mb-6 object-cover border-4 border-white/40 shadow-2xl"
            />
          )}
          <h1 className="text-4xl font-bold mb-2 drop-shadow-lg" data-testid="profile-name">{profile.name}</h1>
          <p className="text-xl text-white/95 mb-2 font-medium" data-testid="profile-job">{profile.job}</p>
          <div className="flex items-center justify-center gap-2 text-white/80">
            <Phone className="h-4 w-4" />
            <p data-testid="profile-phone">{profile.phone}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-3"
        >
          <Button
            onClick={openPhone}
            data-testid="call-btn"
            className="w-full glass-card text-white border-white/30 hover:bg-white/25 hover:border-white/50 h-16 text-lg font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Phone className="h-5 w-5" />
              </div>
              <span>Appeler</span>
            </div>
          </Button>

          {(profile.whatsapp || profile.phone) && (
            <Button
              onClick={openWhatsApp}
              data-testid="whatsapp-btn"
              className="w-full glass-card text-white border-white/30 hover:bg-white/25 hover:border-white/50 h-16 text-lg font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <span>WhatsApp</span>
              </div>
            </Button>
          )}

          {profile.website && (
            <Button
              onClick={openWebsite}
              data-testid="website-btn"
              className="w-full glass-card text-white border-white/30 hover:bg-white/25 hover:border-white/50 h-16 text-lg font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Globe className="h-5 w-5" />
                </div>
                <span>Site Web</span>
              </div>
            </Button>
          )}

          {profile.address && (
            <Button
              onClick={openMaps}
              data-testid="maps-btn"
              className="w-full glass-card text-white border-white/30 hover:bg-white/25 hover:border-white/50 h-16 text-lg font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <MapPin className="h-5 w-5" />
                </div>
                <span>Localisation</span>
              </div>
            </Button>
          )}

          <Button
            onClick={downloadVCard}
            data-testid="vcard-download-btn"
            className="w-full glass-card text-white border-white/30 hover:bg-white/25 hover:border-white/50 h-16 text-lg font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Download className="h-5 w-5" />
              </div>
              <span>Enregistrer le contact</span>
            </div>
          </Button>
        </motion.div>

        {(profile.instagram || profile.facebook || profile.linkedin || profile.tiktok || profile.youtube) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass-card rounded-3xl p-8 shadow-lg"
          >
            <h2 className="text-white text-center font-semibold mb-6 text-xl">Réseaux sociaux</h2>
            <div className="flex justify-center gap-4 flex-wrap">
              {profile.instagram && (
                <motion.button
                  whileHover={{ scale: 1.15, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openSocial('instagram', profile.instagram)}
                  data-testid="instagram-btn"
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 flex items-center justify-center text-white shadow-lg transition-all"
                >
                  <Instagram className="h-7 w-7" />
                </motion.button>
              )}
              {profile.facebook && (
                <motion.button
                  whileHover={{ scale: 1.15, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openSocial('facebook', profile.facebook)}
                  data-testid="facebook-btn"
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 flex items-center justify-center text-white shadow-lg transition-all"
                >
                  <Facebook className="h-7 w-7" />
                </motion.button>
              )}
              {profile.linkedin && (
                <motion.button
                  whileHover={{ scale: 1.15, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openSocial('linkedin', profile.linkedin)}
                  data-testid="linkedin-btn"
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 flex items-center justify-center text-white shadow-lg transition-all"
                >
                  <Linkedin className="h-7 w-7" />
                </motion.button>
              )}
              {profile.tiktok && (
                <motion.button
                  whileHover={{ scale: 1.15, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openSocial('tiktok', profile.tiktok)}
                  data-testid="tiktok-btn"
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-800 to-black hover:from-gray-900 hover:to-black flex items-center justify-center text-white shadow-lg transition-all"
                >
                  <FaTiktok className="h-7 w-7" />
                </motion.button>
              )}
              {profile.youtube && (
                <motion.button
                  whileHover={{ scale: 1.15, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openSocial('youtube', profile.youtube)}
                  data-testid="youtube-btn"
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 flex items-center justify-center text-white shadow-lg transition-all"
                >
                  <FaYoutube className="h-8 w-8" />
                </motion.button>
              )}
            </div>
          </motion.div>
        )}

        <div className="text-center pt-6 pb-2">
          <p className="text-white/50 text-sm font-medium tracking-wide">Propulsé par JPM</p>
        </div>
      </div>
    </div>
  );
}