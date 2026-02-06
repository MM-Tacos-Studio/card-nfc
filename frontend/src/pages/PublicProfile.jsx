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

// Logo Snapchat Officiel (SVG précis)
const SnapchatIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2.75c-3.132 0-5.385 1.55-5.385 4.398 0 1.28.604 2.128 1.41 2.766-.192.17-.442.443-.63.743-.332.535-.494 1.15-.494 1.83 0 .428.064.846.19 1.242-1.01.272-1.742.92-1.742 1.942 0 .506.183.945.51 1.303-.306.31-.617.848-.617 1.637 0 .594.177 1.053.475 1.4.152.176.326.31.516.4.145.39.513.68.956.68.12 0 .23-.02.33-.06.27.35.7.57 1.19.57.17 0 .33-.03.48-.08 1.1.56 2.37.89 3.65.89 1.26 0 2.51-.33 3.59-.88.15.05.3.08.47.08.48 0 .91-.22 1.18-.56.1.04.21.06.33.06.44 0 .81-.29.96-.68.19-.09.36-.23.51-.4.3-.347.48-.806.48-1.4 0-.789-.31-1.327-.61-1.637.33-.358.51-.797.51-1.303 0-1.022-.73-1.67-1.74-1.942.13-.396.19-.814.19-1.242 0-.68-.16-1.295-.49-1.83-.19-.3-.44-.573-.63-.743.8-.638 1.41-1.486 1.41-2.766 0-2.848-2.25-4.398-5.38-4.398zm0 1.5c2.19 0 3.88 1.082 3.88 2.898 0 1.206-.72 1.967-1.7 2.415-.22.1-.42.16-.58.19-.24.05-.33.19-.34.33-.01.14.07.29.28.42.19.12.43.34.61.62.24.39.36.85.36 1.38 0 .52-.1.97-.29 1.33-.09.18-.11.33-.02.47.09.14.24.23.49.25.7.06 1.16.4 1.16.94 0 .28-.11.53-.3.73-.13.14-.15.3-.04.45.1.15.34.23.51.5.09.15.15.34.15.57 0 .3-.11.53-.29.65-.13.09-.16.22-.09.35.07.12.22.18.33.31.06.07.1.16.1.28 0 .19-.15.35-.33.35-.11 0-.21-.05-.27-.14-.12-.17-.4-.28-.6-.28-.09 0-.17.02-.24.05-.18.08-.24.23-.19.4.03.1.05.21.05.32 0 .22-.18.4-.4.4-.08 0-.15-.02-.21-.06-.18-.12-.42-.2-.68-.2-.25 0-.49.08-.67.19-.11.07-.16.21-.12.33.05.13.18.23.11.41-.03.07-.11.13-.22.13-.37 0-.7-.16-.95-.42-.1-.11-.26-.14-.39-.08-.85.44-1.84.7-2.84.7s-1.99-.26-2.84-.7c-.13-.06-.29-.03-.39.08-.25.26-.58.42-.95.42-.11 0-.19-.06-.22-.13-.07-.18.06-.28.11-.41.04-.12-.01-.26-.12-.33-.18-.11-.42-.19-.67-.19s-.5.08-.68.2c-.06.04-.13.06-.21.06-.22 0-.4-.18-.4-.4 0-.11.02-.22.05-.32.05-.17-.01-.32-.19-.4-.07-.03-.15-.05-.24-.05-.2 0-.48.11-.6.28-.06.09-.16.14-.27.14-.18 0-.33-.16-.33-.35 0-.12.04-.21.1-.28.11-.13.26-.19.33-.31.07-.13.04-.26-.09-.35-.18-.12-.29-.35-.29-.65 0-.23.06-.42.15-.57.17-.27.41-.35.51-.5.11-.15.09-.31-.04-.45-.19-.2-.3-.45-.3-.73 0-.54.46-.88 1.16-.94.25-.02.4-.11.49-.25.09-.14.07-.29-.02-.47-.19-.36-.29-.81-.29-1.33 0-.53.12-.99.36-1.38.18-.28.42-.5.61-.62.21-.13.29-.28.28-.42-.01-.14-.1-.28-.34-.33-.16-.03-.36-.09-.58-.19-.98-.448-1.7-1.209-1.7-2.415 0-1.816 1.69-2.898 3.88-2.898z" />
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