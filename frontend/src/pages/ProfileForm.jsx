import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

// const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const API = "https://jamaney-backend.onrender.com/api";
export default function ProfileForm() {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // État initial regroupant tous les champs
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
    tiktok: '',
    design_type: 'classic' // Valeur par défaut
  });
  
  const [photoFile, setPhotoFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  // --- LOGIQUE DE PRÉ-REMPLISSAGE ---
  useEffect(() => {
    if (profileId) {
      const fetchProfile = async () => {
        try {
          const res = await axios.get(`${API}/profiles/${profileId}`, { withCredentials: true });
          // On met à jour le formulaire avec les données reçues de l'API
          setFormData({
            name: res.data.name || '',
            job: res.data.job || '',
            company: res.data.company || '',
            phone: res.data.phone || '',
            email: res.data.email || '',
            website: res.data.website || '',
            instagram: res.data.instagram || '',
            facebook: res.data.facebook || '',
            linkedin: res.data.linkedin || '',
            tiktok: res.data.tiktok || '',
            design_type: res.data.design_type || 'classic'
          });
        } catch (err) {
          console.error(err);
          toast.error("Impossible de charger les données du profil");
        }
      };
      fetchProfile();
    }
  }, [profileId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation pour la création uniquement
    if (!profileId && (!photoFile || !coverFile)) {
      return toast.error("La photo et la couverture sont obligatoires !");
    }

    setLoading(true);
    const data = new FormData();
    
    // Ajout des textes
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key] || "");
    });

    // Ajout des fichiers si présents
    if (photoFile) data.append('photo', photoFile);
    if (coverFile) data.append('cover', coverFile);

    try {
      const config = { 
        headers: { 'Content-Type': 'multipart/form-data' }, 
        withCredentials: true 
      };

      if (profileId) {
        // Mode Edition (PUT ou PATCH selon ton serveur)
        await axios.put(`${API}/profiles/${profileId}`, data, config);
        toast.success("Profil mis à jour avec succès !");
      } else {
        // Mode Création
        await axios.post(`${API}/profiles`, data, config);
        toast.success("Profil JPM créé avec succès !");
      }
      
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.detail || "Erreur lors de l'enregistrement");
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1113] text-white p-4 md:p-8 flex justify-center items-center">
      <div className="w-full max-w-2xl bg-[#1a1c1e] p-6 md:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <h1 className="text-2xl font-bold mb-8 text-[#D4AF37]">
          {profileId ? "MODIFIER LE PROFIL" : "NOUVEAU PROFIL JPM"}
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section Identité */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
               <label className="text-[10px] font-bold text-gray-500 ml-1 uppercase">Nom Complet *</label>
               <Input name="name" value={formData.name} onChange={handleInputChange} required className="bg-white/5 border-white/10 h-12" />
            </div>
            <div className="space-y-1">
               <label className="text-[10px] font-bold text-gray-500 ml-1 uppercase">Métier / Poste *</label>
               <Input name="job" value={formData.job} onChange={handleInputChange} required className="bg-white/5 border-white/10 h-12" />
            </div>
          </div>

          {/* Section Design */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#D4AF37] ml-1 uppercase">Style des Icônes</label>
            <select 
              name="design_type" 
              value={formData.design_type} 
              onChange={handleInputChange}
              className="w-full bg-white/5 border border-white/10 h-12 px-4 rounded-md text-sm outline-none focus:border-[#D4AF37] transition-colors"
            >
              <option value="classic" className="bg-[#1a1c1e]">Premium Gold (Icônes Or)</option>
              <option value="modern" className="bg-[#1a1c1e]">Vibrant Color (Icônes Couleurs)</option>
            </select>
          </div>

          {/* Section Entreprise et Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 ml-1 uppercase">Entreprise</label>
              <Input name="company" value={formData.company} onChange={handleInputChange} className="bg-white/5 border-white/10 h-12" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 ml-1 uppercase">Téléphone *</label>
              <Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+221..." required className="bg-white/5 border-white/10 h-12" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 ml-1 uppercase">Email Professionnel</label>
            <Input name="email" type="email" value={formData.email} onChange={handleInputChange} className="bg-white/5 border-white/10 h-12" />
          </div>

          {/* Section Réseaux Sociaux */}
          <div className="p-6 bg-black/20 rounded-2xl border border-white/5 space-y-4">
            <p className="text-[10px] text-[#D4AF37] font-black tracking-widest uppercase">Réseaux Sociaux & Liens</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] text-gray-600 font-bold ml-1 uppercase">Instagram</label>
                <Input name="instagram" placeholder="Lien profil" value={formData.instagram} onChange={handleInputChange} className="bg-white/5 border-white/10 text-xs h-10" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] text-gray-600 font-bold ml-1 uppercase">LinkedIn</label>
                <Input name="linkedin" placeholder="Lien profil" value={formData.linkedin} onChange={handleInputChange} className="bg-white/5 border-white/10 text-xs h-10" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] text-gray-600 font-bold ml-1 uppercase">Facebook</label>
                <Input name="facebook" placeholder="Lien profil" value={formData.facebook} onChange={handleInputChange} className="bg-white/5 border-white/10 text-xs h-10" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] text-gray-600 font-bold ml-1 uppercase">TikTok</label>
                <Input name="tiktok" placeholder="Lien profil" value={formData.tiktok} onChange={handleInputChange} className="bg-white/5 border-white/10 text-xs h-10" />
              </div>
            </div>
            <div className="space-y-1 pt-2">
              <label className="text-[9px] text-gray-600 font-bold ml-1 uppercase">Site Web Personnel / Pro</label>
              <Input name="website" placeholder="https://..." value={formData.website} onChange={handleInputChange} className="bg-white/5 border-white/10 text-xs h-10" />
            </div>
          </div>

          {/* Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#D4AF37]">Photo de Profil</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={e => setPhotoFile(e.target.files[0])} 
                className="block w-full text-[10px] text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-white/10 file:text-white" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#D4AF37]">Couverture</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={e => setCoverFile(e.target.files[0])} 
                className="block w-full text-[10px] text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-white/10 file:text-white" 
              />
            </div>
          </div>

          {/* Bouton de validation */}
          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-[#D4AF37] hover:bg-yellow-600 text-black font-extrabold h-14 rounded-2xl shadow-lg shadow-[#D4AF37]/10 transition-all"
          >
            {loading ? "TRANSFERT EN COURS..." : profileId ? "METTRE À JOUR LA CARTE" : "CRÉER MA CARTE JPM"}
          </Button>
        </form>
      </div>
    </div>
  );
}