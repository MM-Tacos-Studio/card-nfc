import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Phone, Globe, Mail, Instagram, Facebook, Linkedin, Music2 } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function PublicProfile() {
  const { uniqueLink } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uniqueLink || uniqueLink === 'undefined') return;
    axios.get(`${API}/profiles/public/${uniqueLink}`)
      .then(res => setProfile(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [uniqueLink]);

  if (loading || !profile) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-black flex justify-center items-start">
      <div className="w-full max-w-[430px] min-h-screen bg-[#121214] relative overflow-hidden flex flex-col items-center shadow-2xl">
        
        {/* HEADER IMAGE */}
        <div className="absolute top-0 w-full h-64">
          <img src={profile.cover_url} className="w-full h-full object-cover opacity-60 grayscale-[20%]" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-[#121214]/40" />
        </div>

        {/* PROFILE PHOTO */}
        <div className="mt-40 relative z-10">
          <div className="w-36 h-36 rounded-full border-[3px] border-white/20 p-1 bg-[#121214]">
            <img src={profile.photo_url} className="w-full h-full rounded-full object-cover shadow-2xl" alt="" />
          </div>
        </div>

        {/* INFOS */}
        <div className="mt-6 text-center z-10 px-6">
          <h1 className="text-3xl font-bold text-white uppercase tracking-tight">{profile.name}</h1>
          <p className="text-gray-400 mt-2 text-sm uppercase tracking-[0.2em] font-light">
            {profile.job} {profile.company ? `| ${profile.company}` : ''}
          </p>
        </div>

        {/* BUTTON */}
        <button 
          onClick={() => window.location.href = `${API}/profiles/${profile.profile_id}/vcard`}
          className="mt-10 w-[85%] py-4 bg-gradient-to-r from-[#228B22] via-[#32CD32] to-[#228B22] text-white font-bold rounded-2xl shadow-[0_10px_30px_rgba(34,139,34,0.4)]"
        >
          Enregistrer le contact
        </button>

        {/* CONTACT LIST */}
        <div className="mt-10 w-full px-10 space-y-0 text-white/90">
          <div onClick={() => window.location.href = `tel:${profile.phone}`} className="flex items-center py-5 border-t border-white/10 cursor-pointer">
            <Phone className="w-5 h-5 mr-6 text-gray-400" />
            <span className="text-lg font-medium">{profile.phone}</span>
          </div>
          {profile.email && (
            <div className="flex items-center py-5 border-t border-white/10">
              <Mail className="w-5 h-5 mr-6 text-gray-400" />
              <span className="text-lg truncate">{profile.email}</span>
            </div>
          )}
        </div>

        {/* SOCIALS */}
        <div className="mt-12 mb-12 flex justify-center gap-5">
          {[
            { icon: <Instagram className="w-6 h-6" />, url: profile.instagram },
            { icon: <Linkedin className="w-6 h-6" />, url: profile.linkedin },
            { icon: <Facebook className="w-6 h-6" />, url: profile.facebook },
            { icon: <Music2 className="w-6 h-6" />, url: profile.tiktok }
          ].map((social, i) => social.url && (
            <a key={i} href={social.url} target="_blank" className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              {social.icon}
            </a>
          ))}
        </div>
        
        <p className="mt-auto mb-8 text-[10px] text-gray-600 uppercase tracking-[0.4em]">Propulsé par JPM</p>
      </div>
    </div>
  );
}