import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditarPerfil({ usuario, toggleEditarPerfil }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [estilos, setEstilos] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate();

  const id = usuario.id;

  useEffect(() => {
    axios.get(`http://localhost:3001/usuarios/${id}`)
      .then((response) => {
        const { nome, email, senha, estilos } = response.data;
        setNome(nome);
        setEmail(email);
        setSenha(senha);
        setEstilos(estilos);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  function handleSubmit(event) {
    event.preventDefault();
  
    // Verifica se o email já está sendo usado em outra conta
    axios.get(`http://localhost:3001/usuarios?email=${email}`)
      .then((response) => {
        const usuarios = response.data;
        if (usuarios.length > 0 && usuarios[0].id !== id) {
          setMensagem('Este email já está sendo usado em outra conta.');
        } else if (senha.length > 0 && senha.length < 6) {
          setMensagem('A nova senha deve ter pelo menos 6 caracteres.');
        } else {
          axios.put(`http://localhost:3001/usuarios/${id}`, {
            nome,
            email,
            senha,
            estilos,
          })
            .then(() => {
              setMensagem('Perfil atualizado com sucesso!');
              setTimeout(() => {
                navigate('/perfil');
              }, 3000);
            })
            .catch((error) => {
              console.error(error);
              setMensagem('Erro ao atualizar perfil');
            });
        }
      })
      .catch((error) => {
        console.error(error);
        setMensagem('Erro ao verificar email');
      });
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <h1 className="text-center mb-4">Editar Perfil</h1>

            <div className="form-group mb-3">
              <label htmlFor="nome">Altere seu Nome de Usuário</label>
              <input
                type="text"
                className="form-control"
                id="nome"
                placeholder="Digite seu novo user"
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="email">Altere seu E-mail</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Digite seu novo e-mail"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="senha">Altere sua Senha</label>
              <input
                type="password"
                className="form-control"
                id="senha"
                placeholder="Digite sua nova senha"
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="estilos">Selecione seus Estilos Musicais Favoritos</label>
              <select
                multiple
                className="form-control"
                id="estilos"
                value={estilos}
                onChange={(event) => setEstilos(Array.from(event.target.selectedOptions, option => option.value))}
              >
                <option value="rock">Rock</option>
                <option value="pop">Pop</option>
                <option value="hip-hop">Hip Hop</option>
                <option value="eletronica">Eletrônica</option>
              </select>
            </div>

            {mensagem && <div className="alert alert-primary" role="alert">{mensagem}</div>}
            <div className="text-center">
          <button type="submit" className="btn btn-primary">Atualizar</button>
          <button type="button" className="btn btn-secondary" onClick={toggleEditarPerfil}>Cancelar</button>
        </div>
      </form>
    </div>
  </div>
</div>
);
}

export default EditarPerfil;