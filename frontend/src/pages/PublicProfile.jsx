import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Phone, Globe, Mail, Instagram, Facebook, Linkedin, ShieldAlert } from 'lucide-react';

const API = "https://jamaney-backend.onrender.com/api";

// Logo TikTok personnalisé
const TikTokIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.6-4.12-1.31a8.73 8.73 0 01-1.89-1.42l-.01 7.41c.02 1.34-.17 2.72-.73 3.94-.62 1.39-1.68 2.62-3.04 3.36-1.39.78-3.04 1.12-4.63 1.01-1.61-.08-3.23-.62-4.54-1.6-1.37-1-2.4-2.47-2.85-4.08-.48-1.65-.36-3.48.35-5.06.63-1.45 1.73-2.73 3.12-3.49 1.43-.8 3.14-1.15 4.75-1.01.01 1.41.01 2.82.01 4.23-1.03-.22-2.16-.14-3.1.34-.84.41-1.52 1.17-1.81 2.06-.32.93-.24 2 .24 2.87.41.77 1.15 1.38 2.01 1.62.88.26 1.86.19 2.69-.21.78-.36 1.41-1.04 1.74-1.83.24-.59.32-1.23.31-1.87L12.52.02z"/>
  </svg>
);


// Logo Snapchat Officiel - Version Web Optimisée
const SnapchatIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 512 512" fill={color}>
    <path d="M485.4 345.5c-15.3-7.5-35.1-13.7-44.5-16.7-6.2-2-9.7-5.5-10.4-10.4-.6-4.5.9-14.9 1.4-20 1-11.4 12.3-15.6 18.2-22.1 4.5-5 7.6-11.4 7.6-19.1 0-11-8.5-18.7-18.7-20.4 1.1-3.6 2-7.8 2-12.7 0-11.2-4.1-19.6-11.2-25.2-1.3-1-2.9-1.9-4.5-2.7.5-1.9.9-4 1.2-6.2 3.8-29.2-20-49.8-51.5-49.8-4.1 0-8.2.4-12.1 1.2-13.6-21.7-39.6-35.9-69.2-35.9-29.4 0-55.2 14-68.9 35.3-3.8-.8-7.7-1.2-11.8-1.2-31.5 0-55.3 20.6-51.5 49.8.3 2.3.7 4.5 1.2 6.5-1.7.8-3.2 1.7-4.5 2.7-7.1 5.6-11.2 14-11.2 25.2 0 4.7.8 8.8 1.9 12.3-10.3 1.7-18.8 9.5-18.8 20.6 0 7.7 3.1 14.1 7.6 19.1 5.9 6.5 17.2 10.7 18.2 22.1.5 5.1 2 15.5 1.4 20-.7 4.9-4.2 8.4-10.4 10.4-9.4 3-29.2 9.2-44.5 16.7-18.1 8.9-24.8 18.8-24.8 33.6 0 5.4 1.7 10.2 4.9 14.1 3.5 4.3 8.7 7.5 15.3 9.4 1.7 6.1 7.2 10.6 13.9 10.6 1.7 0 3.3-.3 4.8-.9 4.1 5.5 10.7 9.1 18.1 9.1 2.6 0 5.1-.4 7.4-1.3 17.1 8.7 36.9 14.1 56.9 15.7 6.3 7 15.2 11.5 25.3 11.5 1.5 0 3-.1 4.5-.3 15.4 8.7 34.2 13.7 54.3 13.7s38.9-5 54.3-13.7c1.5.2 3 .3 4.5.3 10.1 0 19.1-4.5 25.3-11.5 20-1.6 39.7-7 56.9-15.7 2.3.9 4.8 1.3 7.4 1.3 7.5 0 14-3.6 18.1-9.1 1.5.6 3.1.9 4.8.9 6.6 0 12.1-4.5 13.9-10.6 6.5-1.9 11.8-5.1 15.3-9.4 3.2-3.9 4.9-8.7 4.9-14.1-.1-14.8-6.8-24.7-24.9-33.6z"/>
  </svg>
);

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

  if (loading) return <div className="h-screen bg-[#0a0a0b] flex items-center justify-center text-white italic tracking-widest uppercase text-xs">Jamaney...</div>;
  if (!profile) return <div className="h-screen bg-[#0a0a0b] flex items-center justify-center text-white italic">Profil introuvable</div>;

  if (profile.is_archived) {
    return (
      <div className="h-screen w-full bg-[#0a0a0b] flex justify-center items-center p-6 font-sans">
        <div className="w-full max-w-[400px] bg-gradient-to-b from-[#1a1c1e] to-[#0a0a0b] border border-red-500/20 rounded-[3rem] p-12 text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="flex justify-center mb-8">
            <div className="p-5 bg-red-500/10 rounded-full">
              <ShieldAlert size={50} className="text-red-500 animate-pulse" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Profil Suspendu</h1>
          <p className="text-gray-400 text-sm mb-10 px-4">
            Ce profil <span className="text-white font-bold">Jamaney Card</span> est actuellement désactivé.
          </p>
          <p className="text-[10px] text-gray-600 font-black tracking-[0.5em] uppercase">Jamaney Card Premium</p>
        </div>
      </div>
    );
  }

  const socialIcons = [
    { id: 'instagram', icon: <Instagram size={28} />, color: '#E4405F', url: profile.instagram },
    { id: 'linkedin', icon: <Linkedin size={28} />, color: '#0A66C2', url: profile.linkedin },
    { id: 'facebook', icon: <Facebook size={28} />, color: '#1877F2', url: profile.facebook },
    { id: 'tiktok', icon: <TikTokIcon size={28} />, color: '#FFFFFF', url: profile.tiktok },
    { id: 'snapchat', icon: <SnapchatIcon size={28} />, color: '#FFFC00', url: profile.snapchat }
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
          <div className="w-32 h-32 rounded-full border-4 border-white shadow-[0_10px_30px_rgba(0,0,0,0.5)] bg-[#121214]">
            <img src={profile.photo_url} className="w-full h-full rounded-full object-cover" alt="" />
          </div>
          <div className="mt-4 text-center px-4">
            <h1 className="text-2xl font-black text-white uppercase tracking-tighter">{profile.name}</h1>
            <p className="text-[#D4AF37] text-[10px] font-bold tracking-[0.4em] uppercase opacity-80">{profile.job}</p>
          </div>
        </div>

        {/* Bouton Enregistrer */}
        <div className="px-8 mt-6 shrink-0">
          <button 
            onClick={() => window.location.href = `${API}/profiles/${profile.profile_id}/vcard`}
            className="w-full py-4 bg-[#28a745] hover:bg-[#1db954] text-white font-bold rounded-xl shadow-[0_8px_20px_rgba(29,185,84,0.3)] active:scale-95 transition-all text-xs tracking-widest uppercase"
          >
            Enregistrer le contact
          </button>
        </div>

        {/* Coordonnées */}
        <div className="mt-6 px-10 space-y-1 grow overflow-y-auto custom-scrollbar">
          <div onClick={() => window.location.href=`tel:${profile.phone}`} className="flex items-center py-4 border-b border-white/5 cursor-pointer group transition-all">
            <Phone className="w-5 h-5 mr-6 text-gray-500 group-hover:text-white transition-colors" />
            <span className="text-md text-gray-200 font-medium group-hover:text-white">{profile.phone}</span>
          </div>
          
          {/* CHAMP EMAIL AJOUTÉ ICI */}
          {profile.email && (
            <div onClick={() => window.location.href=`mailto:${profile.email}`} className="flex items-center py-4 border-b border-white/5 cursor-pointer group transition-all">
              <Mail className="w-5 h-5 mr-6 text-gray-500 group-hover:text-white transition-colors" />
              <span className="text-md text-gray-200 font-medium truncate group-hover:text-white">{profile.email}</span>
            </div>
          )}

          {profile.website && (
            <div onClick={() => window.open(profile.website.startsWith('http') ? profile.website : `https://${profile.website}`, '_blank')} className="flex items-center py-4 border-b border-white/5 cursor-pointer group transition-all">
              <Globe className="w-5 h-5 mr-6 text-gray-500 group-hover:text-white transition-colors" />
              <div className="flex flex-col">
                <span className="text-[9px] text-gray-500 uppercase font-bold">Site Web Professionnel</span>
                <span className="text-white text-sm italic underline underline-offset-4 group-hover:text-[#D4AF37]">Visiter le site</span>
              </div>
            </div>
          )}
        </div>

        {/* Réseaux Sociaux */}
        <div className="py-8 flex justify-center gap-6 shrink-0 flex-wrap">
          {socialIcons.map((social, i) => social.url && (
            <a key={i} href={social.url.startsWith('http') ? social.url : `https://${social.id}.com/${social.url}`} target="_blank" rel="noreferrer"
              className="transition-all hover:scale-125 hover:-translate-y-1"
              style={{ filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.5))' }}
            >
              {React.cloneElement(social.icon, { 
                color: profile.design_type === 'modern' ? social.color : '#D4AF37' 
              })}
            </a>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto h-16 w-full flex items-center justify-center shrink-0">
          <div className="text-center">
             <p className="text-[9px] text-gray-600 font-black tracking-[0.5em] uppercase">Jamaney Card Premium</p>
             <div className="w-12 h-[1px] bg-[#D4AF37]/30 mx-auto mt-1"></div>
          </div>
        </div>

      </div>
    </div>
  );
}