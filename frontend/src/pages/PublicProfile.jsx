import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Phone, Globe, Mail, Instagram, Facebook, Linkedin, Music2, ExternalLink, ShieldAlert } from 'lucide-react';

const API = "https://jamaney-backend.onrender.com/api";
export default function PublicProfile() {
  const { uniqueLink } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (uniqueLink) {
      axios.get(`${API}/profiles/public/${uniqueLink}`)
        .then(res => {
          setProfile(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [uniqueLink]);

  if (loading) return <div className="h-screen bg-[#0a0a0b] flex items-center justify-center text-white italic tracking-widest">JAMANEY...</div>;
  if (!profile) return <div className="h-screen bg-[#0a0a0b] flex items-center justify-center text-white italic">Profil introuvable</div>;

  // --- LOGIQUE D'ARCHIVAGE (PROFIL SUSPENDU) ---
  if (profile.is_archived) {
    return (
      <div className="h-screen w-full bg-[#0a0a0b] flex justify-center items-center p-6 font-sans">
        <div className="w-full max-w-[400px] bg-gradient-to-b from-[#1a1c1e] to-[#0a0a0b] border border-red-500/20 rounded-[3rem] p-12 text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="flex justify-center mb-8">
            <div className="p-5 bg-red-500/10 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.2)]">
              <ShieldAlert size={50} className="text-red-500 animate-pulse" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Profil Suspendu</h1>
          <p className="text-gray-400 text-sm leading-relaxed mb-10 px-4">
            Ce profil <span className="text-white font-bold">Jamaney Card</span> est actuellement désactivé. Veuillez contacter l'administrateur pour le renouvellement.
          </p>
          <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-gray-700 to-transparent mx-auto mb-8" />
          <p className="text-[10px] text-gray-600 font-black tracking-[0.5em] uppercase">Jamaney Card Premium</p>
        </div>
      </div>
    );
  }

  // --- RENDU NORMAL (TON DESIGN) ---
  const socialIcons = [
    { id: 'instagram', icon: <Instagram size={28} />, color: '#E4405F', url: profile.instagram },
    { id: 'linkedin', icon: <Linkedin size={28} />, color: '#0A66C2', url: profile.linkedin },
    { id: 'facebook', icon: <Facebook size={28} />, color: '#1877F2', url: profile.facebook },
    { id: 'tiktok', icon: <Music2 size={28} />, color: '#FFFFFF', url: profile.tiktok }
  ];

  return (
    <div className="h-screen w-full bg-[#0a0a0b] flex justify-center items-center overflow-hidden font-sans">
      <div className="w-full max-w-[430px] h-full max-h-[932px] bg-gradient-to-b from-[#1a1a1c] via-[#121214] to-[#252529] relative flex flex-col shadow-2xl border-x border-white/5">
        
        {/* Header Photo */}
        <div className="relative w-full h-[30%] shrink-0">
          <img src={profile.cover_url} className="w-full h-full object-cover opacity-30" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-transparent to-black/40" />
        </div>

        {/* Profil Section */}
        <div className="flex flex-col items-center -mt-16 relative z-10 shrink-0">
          <div className="w-32 h-32 rounded-full border-[3px] border-[#D4AF37] p-1 bg-[#121214] shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <img src={profile.photo_url} className="w-full h-full rounded-full object-cover" alt="" />
          </div>
          <div className="mt-4 text-center">
            <h1 className="text-2xl font-black text-white uppercase tracking-tighter">{profile.name}</h1>
            <p className="text-[#D4AF37] text-[10px] font-bold tracking-[0.4em] uppercase opacity-80">{profile.job}</p>
          </div>
        </div>

        {/* Bouton Enregistrer */}
        <div className="px-8 mt-6 shrink-0">
          <button 
            onClick={() => window.location.href = `${API}/profiles/${profile.profile_id}/vcard`}
            className="w-full py-4 bg-gradient-to-r from-[#28a745] to-[#1db954] text-white font-bold rounded-xl shadow-[0_8px_20px_rgba(29,185,84,0.3)] active:scale-95 transition-all text-xs tracking-widest uppercase"
          >
            Enregistrer le contact
          </button>
        </div>

        {/* Coordonnées */}
        <div className="mt-6 px-10 space-y-1 grow overflow-hidden">
          <div onClick={() => window.location.href=`tel:${profile.phone}`} className="flex items-center py-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-all">
            <Phone className="w-4 h-4 mr-6 text-[#D4AF37]" />
            <span className="text-md text-gray-200 font-medium">{profile.phone}</span>
          </div>
          
          {profile.email && (
            <div onClick={() => window.location.href=`mailto:${profile.email}`} className="flex items-center py-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-all">
              <Mail className="w-4 h-4 mr-6 text-[#D4AF37]" />
              <span className="text-md text-gray-200 font-medium truncate">{profile.email}</span>
            </div>
          )}

          {profile.website && (
            <div onClick={() => window.open(profile.website, '_blank')} className="flex items-center py-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-all">
              <Globe className="w-4 h-4 mr-6 text-[#D4AF37]" />
              <div className="flex flex-col">
                <span className="text-[9px] text-gray-500 uppercase font-bold">Site Web Professionnel</span>
                <span className="text-white text-sm flex items-center gap-1 italic underline underline-offset-4">Visiter le site</span>
              </div>
            </div>
          )}
        </div>

        {/* Réseaux Sociaux 3D SANS BACKGROUND */}
        <div className="py-6 flex justify-center gap-8 shrink-0">
          {socialIcons.map((social, i) => social.url && (
            <a key={i} href={social.url} target="_blank" rel="noreferrer"
              className="transition-all hover:scale-125 hover:-translate-y-1"
              style={{ filter: 'drop-shadow(0px 6px 10px rgba(0,0,0,0.9))' }}
            >
              {React.cloneElement(social.icon, { 
                color: profile.design_type === 'modern' ? social.color : '#D4AF37' 
              })}
            </a>
          ))}
        </div>

        {/* Footer avec Dégradé Gris Continu */}
        <div className="mt-auto h-20 w-full relative shrink-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />
          <div className="text-center z-10">
             <p className="text-[9px] text-gray-500 font-black tracking-[0.5em] uppercase">Jamaney Card Premium</p>
             <div className="w-12 h-[1px] bg-[#D4AF37]/40 mx-auto mt-1"></div>
          </div>
        </div>

      </div>
    </div>
  );
}