
import { observarUsuario, fazerLogout } from "./auth.js";
import { listarMusicas } from "./musicas.js";

const emailUsuario = document.getElementById("emailUsuario");
const btnSair = document.getElementById("btnSair");
const lista = document.getElementById("listaMusicas");
const mensagem = document.getElementById("mensagem");

let usuarioAtual = null;

function criarElemento(tag, texto) {
    const elemento = document.createElement(tag);
    elemento.textContent = texto || "";
    return elemento;
}

async function carregarMusicas() {
    mensagem.textContent = "Carregando músicas...";
    lista.replaceChildren();

    try {
        const musicas = await listarMusicas();

        if (musicas.length === 0) {
            mensagem.textContent = "Ainda não há músicas cadastradas.";
            return;
        }

        mensagem.textContent = "";

        musicas.forEach((musica) => {
            const card = document.createElement("article");
            card.className = "musica-card";

            const informacoes = document.createElement("div");
            informacoes.className = "musica-info";

            const titulo = criarElemento("h4", musica.titulo);
            const artista = criarElemento("p", musica.artista);

            const audio = document.createElement("audio");
            audio.controls = true;
            audio.preload = "none";
            audio.src = musica.audioUrl;
            audio.setAttribute(
                "aria-label",
                `Reproduzir ${musica.titulo} - ${musica.artista}`
            );

            // Evita reproduzir várias músicas ao mesmo tempo.
            audio.addEventListener("play", () => {
                document.querySelectorAll(".lista-musicas audio")
                    .forEach((outroAudio) => {
                        if (outroAudio !== audio) {
                            outroAudio.pause();
                        }
                    });
            });

            informacoes.append(titulo, artista);
            card.append(informacoes, audio);
            lista.append(card);
        });
    } catch (erro) {
        console.error("Erro ao carregar músicas:", erro);

        mensagem.textContent =
            "Não foi possível carregar as músicas. Tente novamente.";
    }
}

// Verifica se existe uma sessão autenticada.
observarUsuario(async (usuario) => {
    if (!usuario) {
        window.location.replace("./usuario.html");
        return;
    }

    // Evita recarregar a lista se o mesmo usuário continuar conectado.
    if (usuarioAtual === usuario.uid) return;

    usuarioAtual = usuario.uid;
    emailUsuario.textContent = usuario.email || "";

    await carregarMusicas();
});

// Botão de sair.
btnSair.addEventListener("click", async () => {
    btnSair.disabled = true;

    try {
        await fazerLogout();
        window.location.replace("./usuario.html");
    } catch (erro) {
        console.error("Erro ao sair:", erro);
        mensagem.textContent = "Não foi possível sair da conta.";
        btnSair.disabled = false;
    }
});