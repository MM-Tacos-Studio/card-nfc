import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft, Upload } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function ProfileForm() {
  const navigate = useNavigate();
  const { profileId } = useParams();
  const isEdit = Boolean(profileId);

  const [formData, setFormData] = useState({
    name: '',
    job: '',
    phone: '',
    whatsapp: '',
    website: '',
    address: '',
    instagram: '',
    facebook: '',
    linkedin: '',
    tiktok: '',
    youtube: '',
    photo_url: '',
    primary_color: '#3B82F6',
    secondary_color: '#8B5CF6'
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchProfile();
    }
  }, [profileId]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API}/profiles/${profileId}`, {
        withCredentials: true
      });
      setFormData(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement du profil');
      navigate('/dashboard');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const response = await axios.post(`${API}/upload`, formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      setFormData({ ...formData, photo_url: `${process.env.REACT_APP_BACKEND_URL}${response.data.url}` });
      toast.success('Image téléchargée avec succès');
    } catch (error) {
      toast.error('Erreur lors du téléchargement');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        await axios.put(`${API}/profiles/${profileId}`, formData, {
          withCredentials: true
        });
        toast.success('Profil mis à jour avec succès');
      } else {
        await axios.post(`${API}/profiles`, formData, {
          withCredentials: true
        });
        toast.success('Profil créé avec succès');
      }
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="min-h-screen bg-jpm-black">
      <div className="bg-jpm-surface border-b border-jpm-gold/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Button
              onClick={() => navigate('/dashboard')}
              data-testid="back-to-dashboard-btn"
              variant="ghost"
              className="mr-4 text-jpm-gold hover:bg-jpm-gold/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-serif text-3xl font-bold text-jpm-gold">
                {isEdit ? 'Modifier le profil' : 'Nouveau profil'}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-jpm-surface border border-white/5 rounded-xl p-6">
            <h2 className="text-jpm-gold-light font-semibold text-lg mb-4">Informations principales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-gray-300">Nom complet *</Label>
                <Input
                  id="name"
                  data-testid="profile-name-input"
                  required
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="mt-2 bg-white/5 border-white/10 text-white focus:border-jpm-gold"
                />
              </div>
              <div>
                <Label htmlFor="job" className="text-gray-300">Métier *</Label>
                <Input
                  id="job"
                  data-testid="profile-job-input"
                  required
                  value={formData.job}
                  onChange={(e) => handleChange('job', e.target.value)}
                  className="mt-2 bg-white/5 border-white/10 text-white focus:border-jpm-gold"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-gray-300">Téléphone *</Label>
                <Input
                  id="phone"
                  data-testid="profile-phone-input"
                  required
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+33612345678"
                  className="mt-2 bg-white/5 border-white/10 text-white focus:border-jpm-gold"
                />
              </div>
              <div>
                <Label htmlFor="whatsapp" className="text-gray-300">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  data-testid="profile-whatsapp-input"
                  value={formData.whatsapp}
                  onChange={(e) => handleChange('whatsapp', e.target.value)}
                  placeholder="+33612345678"
                  className="mt-2 bg-white/5 border-white/10 text-white focus:border-jpm-gold"
                />
              </div>
            </div>
          </div>

          <div className="bg-jpm-surface border border-white/5 rounded-xl p-6">
            <h2 className="text-jpm-gold-light font-semibold text-lg mb-4">Photo / Logo</h2>
            <div className="flex items-center gap-4">
              {formData.photo_url && (
                <img
                  src={formData.photo_url}
                  alt="Preview"
                  className="w-24 h-24 rounded-lg object-cover border border-white/10"
                />
              )}
              <div className="flex-1">
                <Label htmlFor="photo" className="text-gray-300">Télécharger une image</Label>
                <div className="mt-2">
                  <label htmlFor="photo" className="cursor-pointer">
                    <div className="border border-dashed border-white/20 rounded-lg p-4 text-center hover:border-jpm-gold/50 transition-colors">
                      <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-400">
                        {uploading ? 'Téléchargement...' : 'Cliquer pour choisir une image'}
                      </p>
                    </div>
                    <input
                      id="photo"
                      data-testid="profile-photo-input"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-jpm-surface border border-white/5 rounded-xl p-6">
            <h2 className="text-jpm-gold-light font-semibold text-lg mb-4">Couleurs personnalisées</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primary_color" className="text-gray-300">Couleur primaire</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="primary_color"
                    data-testid="profile-primary-color-input"
                    type="color"
                    value={formData.primary_color}
                    onChange={(e) => handleChange('primary_color', e.target.value)}
                    className="w-20 h-12 cursor-pointer"
                  />
                  <Input
                    value={formData.primary_color}
                    onChange={(e) => handleChange('primary_color', e.target.value)}
                    className="flex-1 bg-white/5 border-white/10 text-white focus:border-jpm-gold"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="secondary_color" className="text-gray-300">Couleur secondaire</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="secondary_color"
                    data-testid="profile-secondary-color-input"
                    type="color"
                    value={formData.secondary_color}
                    onChange={(e) => handleChange('secondary_color', e.target.value)}
                    className="w-20 h-12 cursor-pointer"
                  />
                  <Input
                    value={formData.secondary_color}
                    onChange={(e) => handleChange('secondary_color', e.target.value)}
                    className="flex-1 bg-white/5 border-white/10 text-white focus:border-jpm-gold"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-jpm-surface border border-white/5 rounded-xl p-6">
            <h2 className="text-jpm-gold-light font-semibold text-lg mb-4">Coordonnées</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="website" className="text-gray-300">Site web</Label>
                <Input
                  id="website"
                  data-testid="profile-website-input"
                  value={formData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  placeholder="https://example.com"
                  className="mt-2 bg-white/5 border-white/10 text-white focus:border-jpm-gold"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address" className="text-gray-300">Adresse physique</Label>
                <Input
                  id="address"
                  data-testid="profile-address-input"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="123 Rue de Paris, 75001 Paris"
                  className="mt-2 bg-white/5 border-white/10 text-white focus:border-jpm-gold"
                />
              </div>
            </div>
          </div>

          <div className="bg-jpm-surface border border-white/5 rounded-xl p-6">
            <h2 className="text-jpm-gold-light font-semibold text-lg mb-4">Réseaux sociaux</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="instagram" className="text-gray-300">Instagram</Label>
                <Input
                  id="instagram"
                  data-testid="profile-instagram-input"
                  value={formData.instagram}
                  onChange={(e) => handleChange('instagram', e.target.value)}
                  placeholder="@username"
                  className="mt-2 bg-white/5 border-white/10 text-white focus:border-jpm-gold"
                />
              </div>
              <div>
                <Label htmlFor="facebook" className="text-gray-300">Facebook</Label>
                <Input
                  id="facebook"
                  data-testid="profile-facebook-input"
                  value={formData.facebook}
                  onChange={(e) => handleChange('facebook', e.target.value)}
                  placeholder="facebook.com/username"
                  className="mt-2 bg-white/5 border-white/10 text-white focus:border-jpm-gold"
                />
              </div>
              <div>
                <Label htmlFor="linkedin" className="text-gray-300">LinkedIn</Label>
                <Input
                  id="linkedin"
                  data-testid="profile-linkedin-input"
                  value={formData.linkedin}
                  onChange={(e) => handleChange('linkedin', e.target.value)}
                  placeholder="linkedin.com/in/username"
                  className="mt-2 bg-white/5 border-white/10 text-white focus:border-jpm-gold"
                />
              </div>
              <div>
                <Label htmlFor="tiktok" className="text-gray-300">TikTok</Label>
                <Input
                  id="tiktok"
                  data-testid="profile-tiktok-input"
                  value={formData.tiktok}
                  onChange={(e) => handleChange('tiktok', e.target.value)}
                  placeholder="@username"
                  className="mt-2 bg-white/5 border-white/10 text-white focus:border-jpm-gold"
                />
              </div>
              <div>
                <Label htmlFor="youtube" className="text-gray-300">YouTube</Label>
                <Input
                  id="youtube"
                  data-testid="profile-youtube-input"
                  value={formData.youtube}
                  onChange={(e) => handleChange('youtube', e.target.value)}
                  placeholder="youtube.com/@channel"
                  className="mt-2 bg-white/5 border-white/10 text-white focus:border-jpm-gold"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              onClick={() => navigate('/dashboard')}
              data-testid="cancel-profile-btn"
              variant="outline"
              className="border-white/10 text-gray-300 hover:bg-white/5"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              data-testid="save-profile-btn"
              disabled={loading}
              className="bg-jpm-gold hover:bg-jpm-gold-light text-black font-semibold"
            >
              {loading ? 'Enregistrement...' : (isEdit ? 'Mettre à jour' : 'Créer le profil')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}