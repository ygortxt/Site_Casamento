document.addEventListener('DOMContentLoaded', function() {
    // 1. Funcionalidade da Galeria de Fotos (Página Inicial)
    const photoGrid = document.getElementById('photo-grid');
    if (photoGrid) {
        const photos = [
            { img: 'img/foto1.jpg', title: 'Nosso Primeiro Encontro', description: 'Foi em um dia ensolarado que nossos caminhos se cruzaram e tudo começou.' },
            { img: 'img/foto2.jpg', title: 'Pedido de Casamento', description: 'Um momento mágico, onde o "sim" selou nosso amor para sempre.' },
            { img: 'img/foto3.jpg', title: 'Momentos de Alegria', description: 'Compartilhando risadas e construindo memórias inesquecíveis.' },
            { img: 'img/foto4.jpg', title: 'Nossa Família', description: 'Onde o amor se multiplica e a felicidade transborda.' }
            // Adicione mais fotos aqui! Certifique-se de que as imagens existam na pasta 'img/'
        ];

        photos.forEach(photoData => {
            const photoItem = document.createElement('div');
            photoItem.classList.add('photo-item');
            photoItem.innerHTML = `
                <img src="${photoData.img}" alt="${photoData.title}">
                <div class="photo-description">
                    <h3>${photoData.title}</h3>
                    <p>${photoData.description}</p>
                </div>
            `;
            photoItem.addEventListener('click', function() {
                this.classList.toggle('flipped');
            });
            photoGrid.appendChild(photoItem);
        });
    }

    // 2. Funcionalidade do Formulário RSVP (rsvp.html)
    const rsvpForm = document.getElementById('rsvpForm');
    const confirmationModal = document.getElementById('confirmationModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const closeModalButton = document.getElementById('closeModalButton');

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Impede o envio padrão do formulário

            const formData = new FormData(rsvpForm);
            const data = {};
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }

            // **IMPORTANTE: Substitua com a URL do seu Google Apps Script para o formulário RSVP**
            const scriptURL = 'https://script.google.com/macros/s/AKfycbzcqtkdusAaa0cIxYGLUEt7JOSoPqyiWPgiZSHEfw6wC8e3EOF8pwHJsV0AcRg811eY/exec'; // Ex: 'https://script.google.com/macros/s/AKfycbz_XXXXXXXXXXXX/exec'

            fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors', // Necessário para evitar CORS issues com Google Apps Script
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(data).toString()
            })
            .then(response => {
                // Como usamos no-cors, não podemos verificar response.ok diretamente.
                // A validação de sucesso/erro é feita pelo Apps Script e a resposta é "interna".
                const presenca = document.querySelector('input[name="presenca"]:checked').value;
                if (presenca === 'Sim') {
                    modalTitle.textContent = 'Presença Confirmada!';
                    modalMessage.textContent = 'Agradecemos a sua presença! Mal podemos esperar para celebrar com você.';
                } else {
                    modalTitle.textContent = 'Que Pena!';
                    modalMessage.textContent = 'Que pena que não poderá vir, mas agradecemos por avisar e por fazer parte da nossa história!';
                }
                confirmationModal.style.display = 'flex'; // Mostra o modal
                rsvpForm.reset(); // Limpa o formulário
            })
            .catch(error => {
                console.error('Erro ao enviar formulário:', error);
                modalTitle.textContent = 'Erro!';
                modalMessage.textContent = 'Houve um erro ao confirmar sua presença. Por favor, tente novamente mais tarde.';
                confirmationModal.style.display = 'flex';
            });
        });

        if (closeModalButton) {
            closeModalButton.addEventListener('click', function() {
                confirmationModal.style.display = 'none'; // Esconde o modal
            });
        }
        window.addEventListener('click', function(event) {
            if (event.target == confirmationModal) { // Clica fora do modal para fechar
                confirmationModal.style.display = 'none';
            }
        });
    }

    // 3. Funcionalidade da Lista de Presentes (presentes.html)
    const giftButtons = document.querySelectorAll('.gift-button');
    if (giftButtons.length > 0) {
        giftButtons.forEach(button => {
            button.addEventListener('click', function() {
                const itemName = this.dataset.item;
                alert(`Obrigado por nos abençoar com "${itemName}"! Que Deus te abençoe em dobro, você é parte da nossa história ♥`);
                // Esta funcionalidade é apenas um alerta. Para um controle de presentes real,
                // seria necessário um back-end mais robusto.
            });
        });
    }

    // Funcionalidade de copiar chave Pix
    const copyPixButton = document.querySelector('.copy-pix-button');
    if (copyPixButton) {
        // Usa a biblioteca Clipboard.js para copiar.
        // Certifique-se de que o script da biblioteca está incluído no HTML de presentes.
        // <script src="https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.8/clipboard.min.js"></script>
        const clipboard = new ClipboardJS(copyPixButton);

        clipboard.on('success', function(e) {
            alert('Chave Pix copiada com sucesso!');
            e.clearSelection();
        });

        clipboard.on('error', function(e) {
            console.error('Erro ao copiar a chave Pix:', e);
            alert('Erro ao copiar a chave Pix. Por favor, tente copiar manualmente.');
        });
    }


    // 4. Carregar Mensagens do Mural (mural.html)
    const muralMessagesContainer = document.getElementById('muralMessagesContainer');
    if (muralMessagesContainer) {
        // **IMPORTANTE: Substitua com a URL do seu Google Apps Script para o Mural de Recados**
        const muralScriptURL = 'Shttps://script.google.com/macros/s/AKfycbyxXZwXJkD4xxpWiXiOEQDNsqxx0muSDCMilQQniXMPfm37ikxjKqUph9PBTI--dRiEIg/exec'; // Ex: 'https://script.google.com/macros/s/AKfycbz_MURAL_XXXXXXXXXXXX/exec'

        fetch(muralScriptURL)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na rede ou no servidor ao carregar mural.');
                }
                return response.json();
            })
            .then(messages => {
                muralMessagesContainer.innerHTML = ''; // Limpa "Carregando mensagens..."
                if (messages.length > 0) {
                    messages.forEach(msg => {
                        const messageCard = document.createElement('div');
                        messageCard.classList.add('message-card');
                        // Garante que 'Nome' e 'Mensagem' existem antes de usar
                        const nome = msg.Nome || 'Convidado Anônimo';
                        const mensagem = msg.Mensagem || 'Nenhuma mensagem.';
                        messageCard.innerHTML = `
                            <strong>${nome}</strong>
                            <p>${mensagem}</p>
                        `;
                        muralMessagesContainer.appendChild(messageCard);
                    });
                } else {
                    muralMessagesContainer.innerHTML = '<p style="text-align: center; color: #777;">Nenhuma mensagem ainda. Seja o primeiro a deixar um recado!</p>';
                }
            })
            .catch(error => {
                console.error('Erro ao carregar mensagens do mural:', error);
                muralMessagesContainer.innerHTML = '<p style="text-align: center; color: #E74C3C;">Não foi possível carregar as mensagens. Por favor, tente novamente mais tarde.</p>';
            });
    }
});