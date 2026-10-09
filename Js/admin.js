
import {
    observarUsuario,
    fazerLogout
} from "./auth.js";

import {
    cadastrarMusica,
    listarMusicas,
    editarMusica,
    excluirMusica
} from "./musicas.js";

const UID_ADMIN = "QjjdnmbhsbVkN57Y8gRZw1c154y1";

const emailAdmin = document.getElementById("emailAdmin");
const btnMusica = document.getElementById("btnMusica");
const btnSair = document.getElementById("btnSair");
const formMusica = document.getElementById("formMusica");
const tituloFormulario = document.getElementById("tituloFormulario");
const titulo = document.getElementById("titulo");
const artista = document.getElementById("artista");
const capaUrl = document.getElementById("capaUrl");
const audioUrl = document.getElementById("audioUrl");
const btnSalvar = document.getElementById("btnSalvar");
const btnCancelar = document.getElementById("btnCancelar");
const mensagem = document.getElementById("mensagem");
const listaMusicas = document.getElementById("listaMusicas");

let ehAdmin = false;
let idEdicao = null;

observarUsuario(async (usuario) => {
    if (!usuario) {
        window.location.replace("./usuario.html");
        return;
    }

    ehAdmin = usuario.uid === UID_ADMIN;
    emailAdmin.textContent = usuario.email || "";

    if (!ehAdmin) {
        alert("Acesso permitido somente para o administrador.");
        window.location.replace("./main.html");
        return;
    }

    await carregarMusicas();
});

function criarCapa(url, tituloMusica) {
    const imagem = document.createElement("img");
    imagem.className = "capa-musica-admin";
    imagem.alt = `Capa de ${tituloMusica || "música"}`;
    imagem.src = url || "./icons/icon-192.png";

    imagem.onerror = () => {
        imagem.onerror = null;
        imagem.src = "./icons/icon-192.png";
    };

    return imagem;
}

async function carregarMusicas() {
    mensagem.textContent = "Carregando músicas...";
    listaMusicas.replaceChildren();

    try {
        const musicas = await listarMusicas();

        if (!musicas.length) {
            mensagem.textContent = "Ainda não há músicas cadastradas.";
            return;
        }

        mensagem.textContent = "";

        musicas.forEach((musica) => {
            const card = document.createElement("article");
            card.className = "musica-admin";

            const informacoes = document.createElement("div");
            informacoes.className = "musica-info-admin";

            const capa = criarCapa(musica.capaUrl, musica.titulo);

            const nome = document.createElement("h4");
            nome.textContent = musica.titulo || "";

            const artistaTexto = document.createElement("p");
            artistaTexto.textContent = musica.artista || "";

            const audio = document.createElement("audio");
            audio.controls = true;
            audio.preload = "none";
            audio.src = musica.audioUrl || "";

            const botoes = document.createElement("div");
            botoes.className = "musica-acoes";

            const btnEditar = document.createElement("button");
            btnEditar.type = "button";
            btnEditar.textContent = "Editar";

            btnEditar.addEventListener("click", () => {
                if (!ehAdmin) return;

                idEdicao = musica.id;
                titulo.value = musica.titulo || "";
                artista.value = musica.artista || "";
                capaUrl.value = musica.capaUrl || "";
                audioUrl.value = musica.audioUrl || "";

                tituloFormulario.textContent = "Editar música";
                btnSalvar.textContent = "Salvar alterações";
                btnCancelar.hidden = false;

                window.scrollTo({ top: 0, behavior: "smooth" });
            });

            const btnExcluir = document.createElement("button");
            btnExcluir.type = "button";
            btnExcluir.textContent = "Excluir";

            btnExcluir.addEventListener("click", async () => {
                if (!ehAdmin) return;

                if (!confirm(`Deseja excluir "${musica.titulo}"?`)) {
                    return;
                }

                try {
                    await excluirMusica(musica.id);
                    mensagem.textContent = "Música excluída com sucesso.";
                    await carregarMusicas();
                } catch (erro) {
                    console.error(erro);
                    mensagem.textContent = "Não foi possível excluir a música.";
                }
            });

            informacoes.append(capa, nome, artistaTexto);
            botoes.append(btnEditar, btnExcluir);
            card.append(informacoes, audio, botoes);
            listaMusicas.append(card);
        });
    } catch (erro) {
        console.error("Erro ao carregar músicas:", erro);
        mensagem.textContent = "Não foi possível carregar as músicas.";
    }
}

formMusica.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    if (!ehAdmin) {
        mensagem.textContent = "Somente o administrador pode alterar músicas.";
        return;
    }

    const dados = {
        titulo: titulo.value.trim(),
        artista: artista.value.trim(),
        capaUrl: capaUrl.value.trim(),
        audioUrl: audioUrl.value.trim()
    };

    if (!dados.titulo || !dados.artista || !dados.audioUrl) {
        mensagem.textContent = "Preencha o título, o artista e a URL do áudio.";
        return;
    }

    try {
        btnSalvar.disabled = true;

        if (idEdicao) {
            await editarMusica(idEdicao, dados);
            mensagem.textContent = "Música editada com sucesso.";
        } else {
            await cadastrarMusica(dados);
            mensagem.textContent = "Música cadastrada com sucesso.";
        }

        limparFormulario();
        await carregarMusicas();
    } catch (erro) {
        console.error("Erro ao salvar música:", erro);
        mensagem.textContent = "Não foi possível salvar a música.";
    } finally {
        btnSalvar.disabled = false;
    }
});

function limparFormulario() {
    formMusica.reset();
    idEdicao = null;
    tituloFormulario.textContent = "Cadastrar música";
    btnSalvar.textContent = "Cadastrar música";
    btnCancelar.hidden = true;
}

btnCancelar.addEventListener("click", () => {
    limparFormulario();
    mensagem.textContent = "";
});

btnMusica.addEventListener("click", () => {
    window.location.replace("./main.html");
});

btnSair.addEventListener("click", async () => {
    btnSair.disabled = true;

    try {
        await fazerLogout();
        window.location.replace("./usuario.html");
    } catch (erro) {
        console.error(erro);
        mensagem.textContent = "Não foi possível sair da conta.";
        btnSair.disabled = false;
    }
});