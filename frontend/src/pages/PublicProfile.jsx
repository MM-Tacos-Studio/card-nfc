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



// Logo Snapchat personnalisé - Version simplifiée et nette
const SnapchatIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3 0 .605-.153.967-.248.18-.045.385-.09.602-.119.187-.03.376-.045.556-.045.984 0 1.689.564 1.689 1.343 0 .508-.203.958-.586 1.328-.318.299-.746.511-1.172.66l-.03.016c-.464.174-.914.346-1.247.699-.311.33-.466.723-.463 1.171.004.66.263 1.065.42 1.305.15.226.359.539.359.944 0 .774-.566 1.31-1.386 1.31-.45 0-.829-.164-1.121-.314-.09-.045-.181-.09-.259-.119-.09.811-.405 1.328-.885 1.811-.525.525-1.214.795-1.998.795-.5 0-.988-.089-1.455-.267-.675.675-1.456 1.006-2.324 1.006-.867 0-1.649-.331-2.324-1.006-.467.178-.955.267-1.455.267-.784 0-1.473-.27-1.998-.795-.48-.483-.795-1-.885-1.811-.078.03-.169.074-.259.119-.292.15-.671.314-1.121.314-.82 0-1.386-.536-1.386-1.31 0-.405.209-.718.359-.944.157-.24.416-.645.42-1.305.003-.448-.152-.841-.463-1.171-.333-.353-.783-.525-1.247-.699l-.03-.016c-.426-.149-.854-.361-1.172-.66-.383-.37-.586-.82-.586-1.328 0-.779.705-1.343 1.689-1.343.18 0 .369.015.556.045.217.03.422.074.602.119.362.095.667.248.967.248.198 0 .326-.045.401-.09-.008-.165-.018-.33-.03-.51l-.003-.06c-.104-1.628-.23-3.654.299-4.847C7.859 1.069 11.216.793 12.206.793z"/>
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