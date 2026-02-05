import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function ProfileForm() {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // État initial avec tous les champs attendus par le Backend
  const [formData, setFormData] = useState({
    name: '', 
    job: '', 
    company: '', 
    phone: '', 
    email: '',
    website: '', 
    instagram: '', 
    facebook: '', 
    linkedin: '', 
    tiktok: ''
  });
  
  const [photoFile, setPhotoFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Vérification des fichiers pour un nouveau profil
    if (!profileId && (!photoFile || !coverFile)) {
      return toast.error("La photo et la couverture sont obligatoires !");
    }

    setLoading(true);
    const data = new FormData();
    
    // On ajoute tous les champs texte au FormData
    Object.keys(formData).forEach(key => {
      // On envoie une chaîne vide si le champ est null/undefined pour éviter les erreurs 422
      data.append(key, formData[key] || "");
    });

    // Ajout des fichiers binaires (ton PC -> Backend)
    if (photoFile) data.append('photo', photoFile);
    if (coverFile) data.append('cover', coverFile);

    try {
      const config = { 
        headers: { 'Content-Type': 'multipart/form-data' }, 
        withCredentials: true 
      };

      if (profileId) {
        await axios.put(`${API}/profiles/${profileId}`, data, config);
      } else {
        await axios.post(`${API}/profiles`, data, config);
      }
      
      toast.success("Profil JPM enregistré avec succès !");
      navigate('/dashboard');
    } catch (err) {
      console.error("Détail erreur:", err.response?.data);
      const errorMsg = err.response?.data?.detail || "Erreur de connexion au serveur";
      toast.error(`Erreur : ${errorMsg}`);
    } finally { 
      setLoading(false); 
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-[#0f1113] text-white p-8 flex justify-center items-center">
      <div className="w-full max-w-2xl bg-[#1a1c1e] p-8 rounded-3xl border border-white/5 shadow-2xl">
        <h1 className="text-2xl font-bold mb-8 text-[#D4AF37]">Nouveau Profil JPM</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
               <label className="text-[10px] font-bold text-gray-500 ml-1">NOM COMPLET *</label>
               <Input name="name" value={formData.name} onChange={handleInputChange} required className="bg-white/5 border-white/10 focus:border-[#D4AF37]" />
            </div>
            <div className="space-y-1">
               <label className="text-[10px] font-bold text-gray-500 ml-1">MÉTIER / POSTE *</label>
               <Input name="job" value={formData.job} onChange={handleInputChange} required className="bg-white/5 border-white/10 focus:border-[#D4AF37]" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 ml-1">ENTREPRISE (FACULTATIF)</label>
              <Input name="company" value={formData.company} onChange={handleInputChange} className="bg-white/5 border-white/10" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 ml-1">EMAIL PRO *</label>
              <Input name="email" type="email" value={formData.email} onChange={handleInputChange} className="bg-white/5 border-white/10" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 ml-1">TÉLÉPHONE (AVEC INDICATIF) *</label>
            <Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+221..." required className="bg-white/5 border-white/10" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 ml-1">INSTAGRAM (LIEN)</label>
              <Input name="instagram" placeholder="https://..." value={formData.instagram} onChange={handleInputChange} className="bg-white/5 border-white/10 text-xs" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 ml-1">LINKEDIN (LIEN)</label>
              <Input name="linkedin" placeholder="https://..." value={formData.linkedin} onChange={handleInputChange} className="bg-white/5 border-white/10 text-xs" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#D4AF37]">Photo de Profil *</label>
              <input type="file" accept="image/*" onChange={e => setPhotoFile(e.target.files[0])} className="block w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-white/10 file:text-white cursor-pointer hover:file:bg-[#D4AF37] hover:file:text-black transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#D4AF37]">Image de Couverture *</label>
              <input type="file" accept="image/*" onChange={e => setCoverFile(e.target.files[0])} className="block w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-white/10 file:text-white cursor-pointer hover:file:bg-[#D4AF37] hover:file:text-black transition-all" />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-[#D4AF37] text-black font-extrabold h-14 rounded-2xl hover:scale-[1.02] transition-transform shadow-lg shadow-[#D4AF37]/20 mt-4">
            {loading ? "TRANSFERT VERS LE CLOUD..." : "CRÉER MA CARTE JPM"}
          </Button>
        </form>
      </div>
    </div>
  );
}