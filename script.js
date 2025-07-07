// script.js

const RSVP_URL = 'https://script.google.com/macros/s/SEU_ID_RSVD/exec'; // Coloque o URL do seu Web App RSVP
const MURAL_URL = 'https://script.google.com/macros/s/SEU_ID_MURAL/exec'; // URL do Web App Mural

// Enviar dados do RSVP
async function enviarRSVP(formData) {
  try {
    const response = await fetch(RSVP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (data.status === 'success') {
      alert('RSVP enviado com sucesso! Obrigado.');
    } else {
      alert('Erro ao enviar RSVP: ' + data.message);
    }
  } catch (error) {
    alert('Erro na conexão: ' + error.message);
  }
}

// Enviar recado para o mural
async function enviarRecado(formData) {
  try {
    const response = await fetch(MURAL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (data.status === 'success') {
      alert('Recado enviado! Obrigado.');
      carregarRecados(); // Atualiza a lista após envio
    } else {
      alert('Erro ao enviar recado: ' + data.message);
    }
  } catch (error) {
    alert('Erro na conexão: ' + error.message);
  }
}

// Buscar e exibir recados do mural
async function carregarRecados() {
  try {
    const response = await fetch(MURAL_URL);
    const data = await response.json();
    if (data.status === 'success') {
      const recadosDiv = document.getElementById('lista-recados');
      recadosDiv.innerHTML = '';
      data.recados.forEach(recado => {
        const p = document.createElement('p');
        p.innerHTML = `<strong>${recado.nome}</strong> (${recado.data}):<br>${recado.mensagem}`;
        recadosDiv.appendChild(p);
      });
    } else {
      alert('Erro ao carregar recados: ' + data.message);
    }
  } catch (error) {
    alert('Erro na conexão: ' + error.message);
  }
}

// Exemplo: conectar ao formulário RSVP no DOM
document.getElementById('form-rsvp').addEventListener('submit', e => {
  e.preventDefault();
  const formData = {
    nome: e.target.nome.value,
    presenca: e.target.presenca.value,
    convidados: e.target.convidados.value,
    mensagem: e.target.mensagem.value,
  };
  enviarRSVP(formData);
  e.target.reset();
});

// Exemplo: conectar ao formulário do mural no DOM
document.getElementById('form-recado').addEventListener('submit', e => {
  e.preventDefault();
  const formData = {
    nome: e.target.nome.value,
    mensagem: e.target.mensagem.value,
  };
  enviarRecado(formData);
  e.target.reset();
});

// Carrega os recados ao abrir a página
window.onload = carregarRecados;
