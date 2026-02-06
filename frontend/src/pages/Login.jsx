import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { LogIn } from 'lucide-react';

const API = "https://jamaney-backend.onrender.com/api";
export default function Login() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ email: '', password: '', name: '' });
  const [loading, setLoading] = useState(false);


const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API}/auth/login`, loginData, {
        withCredentials: true
      });
      
      // --- LA LIGNE MAGIQUE À AJOUTER ---
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      // ---------------------------------

      toast.success('Connexion réussie !');
      navigate('/dashboard', { state: { user: response.data.user } });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };
















  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API}/auth/register`, registerData, {
        withCredentials: true
      });
      toast.success('Compte créé avec succès !');
      navigate('/dashboard', { state: { user: response.data.user } });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur d\'inscription');
    } finally {
      setLoading(false);
    }
  };

  // const handleGoogleLogin = () => {
  //   // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
  //   const redirectUrl = window.location.origin + '/dashboard';
  //   window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  // };
  const handleGoogleLogin = () => {
    toast.error("La connexion Google est en cours de configuration pour JPM.");
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-jpm-black p-4"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1761437855740-c894da924d79?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODh8MHwxfHNlYXJjaHwxfHxkYXJrJTIwbHV4dXJ5JTIwZ29sZCUyMHRleHR1cmUlMjBiYWNrZ3JvdW5kfGVufDB8fHx8MTc3MDE1MTcyM3ww&ixlib=rb-4.1.0&q=85)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-jpm-gold to-jpm-gold-light">
            JPM
          </h1>
          <p className="text-jpm-gold-light text-sm tracking-widest uppercase">Cartes de visite digitales</p>
        </div>

        <div className="bg-jpm-surface/80 backdrop-blur-xl border border-jpm-gold/20 rounded-2xl p-8 shadow-2xl">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-jpm-black/50">
              <TabsTrigger value="login" data-testid="login-tab">Connexion</TabsTrigger>
              <TabsTrigger value="register" data-testid="register-tab">Inscription</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4 mt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-email" className="text-gray-300">Email</Label>
                  <Input
                    id="login-email"
                    data-testid="login-email-input"
                    type="email"
                    required
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className="mt-2 bg-white/5 border-white/10 text-white focus:border-jpm-gold"
                  />
                </div>
                <div>
                  <Label htmlFor="login-password" className="text-gray-300">Mot de passe</Label>
                  <Input
                    id="login-password"
                    data-testid="login-password-input"
                    type="password"
                    required
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="mt-2 bg-white/5 border-white/10 text-white focus:border-jpm-gold"
                  />
                </div>
                <Button 
                  type="submit" 
                  data-testid="login-submit-btn"
                  disabled={loading}
                  className="w-full bg-jpm-gold hover:bg-jpm-gold-light text-black font-semibold"
                >
                  {loading ? 'Connexion...' : 'Se connecter'}
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-jpm-surface px-2 text-gray-400">Ou</span>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleGoogleLogin}
                data-testid="google-login-btn"
                variant="outline"
                className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Connexion avec Google
              </Button>
            </TabsContent>
            
            <TabsContent value="register" className="space-y-4 mt-6">
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label htmlFor="register-name" className="text-gray-300">Nom complet</Label>
                  <Input
                    id="register-name"
                    data-testid="register-name-input"
                    type="text"
                    required
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    className="mt-2 bg-white/5 border-white/10 text-white focus:border-jpm-gold"
                  />
                </div>
                <div>
                  <Label htmlFor="register-email" className="text-gray-300">Email</Label>
                  <Input
                    id="register-email"
                    data-testid="register-email-input"
                    type="email"
                    required
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    className="mt-2 bg-white/5 border-white/10 text-white focus:border-jpm-gold"
                  />
                </div>
                <div>
                  <Label htmlFor="register-password" className="text-gray-300">Mot de passe</Label>
                  <Input
                    id="register-password"
                    data-testid="register-password-input"
                    type="password"
                    required
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    className="mt-2 bg-white/5 border-white/10 text-white focus:border-jpm-gold"
                  />
                </div>
                <Button 
                  type="submit"
                  data-testid="register-submit-btn"
                  disabled={loading}
                  className="w-full bg-jpm-gold hover:bg-jpm-gold-light text-black font-semibold"
                >
                  {loading ? 'Inscription...' : 'Créer un compte'}
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-jpm-surface px-2 text-gray-400">Ou</span>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleGoogleLogin}
                data-testid="google-register-btn"
                variant="outline"
                className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Inscription avec Google
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}