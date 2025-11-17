import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import './Login.css';

export function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    // Validação simples
    if (!email || !senha) {
      setErro('Por favor, preencha todos os campos');
      setCarregando(false);
      return;
    }

    try {
      // Autenticação com Firebase
      await signInWithEmailAndPassword(auth, email, senha);
      
      // Redireciona após login bem-sucedido
      navigate('/estoque');
    } catch (error: any) {
      console.error('Erro no login:', error);
      
      // Tratamento de erros do Firebase
      let mensagemErro = 'Erro ao fazer login. Tente novamente.';
      
      if (error.code === 'auth/invalid-email') {
        mensagemErro = 'Email inválido.';
      } else if (error.code === 'auth/user-not-found') {
        mensagemErro = 'Usuário não encontrado.';
      } else if (error.code === 'auth/wrong-password') {
        mensagemErro = 'Senha incorreta.';
      } else if (error.code === 'auth/invalid-credential') {
        mensagemErro = 'Credenciais inválidas.';
      } else if (error.code === 'auth/too-many-requests') {
        mensagemErro = 'Muitas tentativas. Tente novamente mais tarde.';
      }
      
      setErro(mensagemErro);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Controle de Estoque</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {erro && <div className="error-message">{erro}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="senha">Senha:</label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          
          <button type="submit" className="btn-login" disabled={carregando}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}

