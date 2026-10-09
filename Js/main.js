
import { observarUsuario, fazerLogout } from "./auth.js";
import { listarMusicas } from "./musicas.js";

import {
    criarPlaylist,
    listarPlaylists,
    editarPlaylist,
    adicionarMusicaPlaylist,
    removerMusicaPlaylist,
    excluirPlaylist
} from "./playlists.js";

const emailUsuario = document.getElementById("emailUsuario");
const btnSair = document.getElementById("btnSair");
const lista = document.getElementById("listaMusicas");
const mensagem = document.getElementById("mensagem");

const formPlaylist = document.getElementById("formPlaylist");
const nomePlaylist = document.getElementById("nomePlaylist");
const capaPlaylist = document.getElementById("capaPlaylist");
const mensagemPlaylist = document.getElementById("mensagemPlaylist");
const listaPlaylists = document.getElementById("listaPlaylists");
const detalhePlaylist = document.getElementById("detalhePlaylist");
const btnCriarPlaylist = document.getElementById("btnCriarPlaylist");

let usuarioAtual = null;
let musicasDisponiveis = [];
let playlistsAtuais = [];

function criarElemento(tag, texto = "") {
    const elemento = document.createElement(tag);
    elemento.textContent = texto || "";
    return elemento;
}

function criarCapa(url, titulo) {
    const imagem = document.createElement("img");

    imagem.className = "capa-musica";
    imagem.alt = `Capa de ${titulo || "música"}`;
    imagem.src = url || "./icons/icon-192.png";

    imagem.onerror = () => {
        imagem.onerror = null;
        imagem.src = "./icons/icon-192.png";
    };

    return imagem;
}

// ========================================
// CARREGAR MÚSICAS
// ========================================

async function carregarMusicas() {
    mensagem.textContent = "Carregando músicas...";
    lista.replaceChildren();

    try {
        musicasDisponiveis = await listarMusicas();

        if (musicasDisponiveis.length === 0) {
            mensagem.textContent = "Ainda não há músicas cadastradas.";
            return;
        }

        mensagem.textContent = "";

        musicasDisponiveis.forEach((musica) => {
            const card = document.createElement("article");
            card.className = "musica-card";

            const capa = criarCapa(
                musica.capaUrl,
                musica.titulo
            );

            const informacoes = document.createElement("div");
            informacoes.className = "musica-info";

            const titulo = criarElemento("h4", musica.titulo);
            const artista = criarElemento("p", musica.artista);

            const audio = document.createElement("audio");
            audio.controls = true;
            audio.preload = "none";
            audio.src = musica.audioUrl || "";

            audio.setAttribute(
                "aria-label",
                `Reproduzir ${musica.titulo} - ${musica.artista}`
            );

            audio.addEventListener("play", () => {
                document.querySelectorAll("audio").forEach((outro) => {
                    if (outro !== audio) {
                        outro.pause();
                    }
                });
            });

            informacoes.append(titulo, artista);
            card.append(capa, informacoes, audio);

            // Botão para adicionar a música a uma playlist.
            if (playlistsAtuais.length > 0) {
                const acoes = document.createElement("div");
                acoes.className = "botoes-musica";

                const seletor = document.createElement("select");
                seletor.setAttribute(
                    "aria-label",
                    `Playlist para ${musica.titulo}`
                );

                const opcaoInicial = document.createElement("option");
                opcaoInicial.value = "";
                opcaoInicial.textContent = "Escolha uma playlist";

                seletor.append(opcaoInicial);

                playlistsAtuais.forEach((playlist) => {
                    const opcao = document.createElement("option");
                    opcao.value = playlist.id;
                    opcao.textContent = playlist.nome;
                    seletor.append(opcao);
                });

                const botaoAdicionar = document.createElement("button");
                botaoAdicionar.type = "button";
                botaoAdicionar.textContent = "Adicionar à playlist";

                botaoAdicionar.addEventListener("click", async () => {
                    if (!seletor.value || !usuarioAtual) {
                        mensagemPlaylist.textContent =
                            "Escolha uma playlist primeiro.";
                        return;
                    }

                    try {
                        await adicionarMusicaPlaylist(
                            usuarioAtual.uid,
                            seletor.value,
                            musica.id
                        );

                        mensagemPlaylist.textContent =
                            "Música adicionada à playlist!";

                        await carregarPlaylists();
                    } catch (erro) {
                        console.error(erro);
                        mensagemPlaylist.textContent =
                            "Não foi possível adicionar a música.";
                    }
                });

                acoes.append(seletor, botaoAdicionar);
                card.append(acoes);
            }

            lista.append(card);
        });
    } catch (erro) {
        console.error("Erro ao carregar músicas:", erro);

        mensagem.textContent =
            "Não foi possível carregar as músicas. Tente novamente.";
    }
}

// ========================================
// CARREGAR PLAYLISTS PESSOAIS
// ========================================

async function carregarPlaylists() {
    if (!usuarioAtual) return;

    listaPlaylists.replaceChildren();

    try {
        playlistsAtuais = await listarPlaylists(usuarioAtual.uid);

        if (playlistsAtuais.length === 0) {
            listaPlaylists.append(
                criarElemento(
                    "p",
                    "Você ainda não criou nenhuma playlist."
                )
            );
        }

        playlistsAtuais.forEach((playlist) => {
            const card = document.createElement("article");
            card.className = "playlist-card";

            const capa = criarCapa(
                playlist.capaUrl,
                playlist.nome
            );

            const titulo = criarElemento("h4", playlist.nome);

            const quantidade = criarElemento(
                "p",
                `${(playlist.musicas || []).length} música(s)`
            );

            const botaoAbrir = document.createElement("button");
            botaoAbrir.type = "button";
            botaoAbrir.textContent = "Abrir playlist";

            botaoAbrir.addEventListener("click", () => {
                mostrarPlaylist(playlist);
            });

            const botaoEditar = document.createElement("button");
            botaoEditar.type = "button";
            botaoEditar.textContent = "Editar";

            botaoEditar.addEventListener("click", async () => {
                const novoNome = prompt(
                    "Nome da playlist:",
                    playlist.nome
                );

                if (novoNome === null || !novoNome.trim()) return;

                const novaCapa = prompt(
                    "URL da capa:",
                    playlist.capaUrl || ""
                );

                if (novaCapa === null) return;

                try {
                    await editarPlaylist(
                        usuarioAtual.uid,
                        playlist.id,
                        novoNome,
                        novaCapa
                    );

                    mensagemPlaylist.textContent =
                        "Playlist atualizada com sucesso.";

                    await carregarPlaylists();
                } catch (erro) {
                    console.error(erro);
                    mensagemPlaylist.textContent =
                        "Não foi possível editar a playlist.";
                }
            });

            const botaoExcluir = document.createElement("button");
            botaoExcluir.type = "button";
            botaoExcluir.textContent = "Excluir";

            botaoExcluir.addEventListener("click", async () => {
                if (!confirm(`Excluir "${playlist.nome}"?`)) return;

                try {
                    await excluirPlaylist(
                        usuarioAtual.uid,
                        playlist.id
                    );

                    document.getElementById("detalhePlaylist")
                        .replaceChildren();

                    mensagemPlaylist.textContent =
                        "Playlist excluída.";

                    await carregarPlaylists();
                    await carregarMusicas();
                } catch (erro) {
                    console.error(erro);
                    mensagemPlaylist.textContent =
                        "Não foi possível excluir a playlist.";
                }
            });

            card.append(
                capa,
                titulo,
                quantidade,
                botaoAbrir,
                botaoEditar,
                botaoExcluir
            );

            listaPlaylists.append(card);
        });

        // Atualiza os seletores de playlist na biblioteca.
        await carregarMusicas();
    } catch (erro) {
        console.error("Erro ao carregar playlists:", erro);

        mensagemPlaylist.textContent =
            "Não foi possível carregar suas playlists.";
    }
}

// ========================================
// ABRIR UMA PLAYLIST
// ========================================

function mostrarPlaylist(playlist) {
    detalhePlaylist.replaceChildren();

    const titulo = criarElemento("h3", playlist.nome);

    const botaoFechar = document.createElement("button");
    botaoFechar.type = "button";
    botaoFechar.textContent = "Fechar";

    botaoFechar.addEventListener("click", () => {
        detalhePlaylist.replaceChildren();
    });

    detalhePlaylist.append(titulo, botaoFechar);

    const musicasPlaylist = (playlist.musicas || [])
        .map((id) => musicasDisponiveis.find((musica) => musica.id === id))
        .filter(Boolean);

    if (musicasPlaylist.length === 0) {
        detalhePlaylist.append(
            criarElemento("p", "Adicione músicas a esta playlist.")
        );
        return;
    }

    musicasPlaylist.forEach((musica) => {
        const linha = document.createElement("article");
        linha.className = "musica-playlist";

        const capa = criarCapa(musica.capaUrl, musica.titulo);

        const informacoes = document.createElement("div");
        informacoes.append(
            criarElemento("h4", musica.titulo),
            criarElemento("p", musica.artista)
        );

        const audio = document.createElement("audio");
        audio.controls = true;
        audio.preload = "none";
        audio.src = musica.audioUrl || "";

        audio.addEventListener("play", () => {
            document.querySelectorAll("audio").forEach((outro) => {
                if (outro !== audio) outro.pause();
            });
        });

        const botaoRemover = document.createElement("button");
        botaoRemover.type = "button";
        botaoRemover.textContent = "Remover da playlist";

        botaoRemover.addEventListener("click", async () => {
            try {
                await removerMusicaPlaylist(
                    usuarioAtual.uid,
                    playlist.id,
                    musica.id
                );

                mensagemPlaylist.textContent =
                    "Música removida da playlist.";

                await carregarPlaylists();

                const atualizada = playlistsAtuais.find(
                    (item) => item.id === playlist.id
                );

                if (atualizada) mostrarPlaylist(atualizada);
            } catch (erro) {
                console.error(erro);

                mensagemPlaylist.textContent =
                    "Não foi possível remover a música.";
            }
        });

        linha.append(capa, informacoes, audio, botaoRemover);
        detalhePlaylist.append(linha);
    });
}

// ========================================
// CRIAR PLAYLIST
// ========================================

formPlaylist?.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    if (!usuarioAtual) return;

    btnCriarPlaylist.disabled = true;

    try {
        await criarPlaylist(
            usuarioAtual.uid,
            nomePlaylist.value,
            capaPlaylist.value
        );

        formPlaylist.reset();

        mensagemPlaylist.textContent =
            "Playlist criada com sucesso!";

        await carregarPlaylists();
    } catch (erro) {
        console.error("Erro ao criar playlist:", erro);

        mensagemPlaylist.textContent =
            erro.message || "Não foi possível criar a playlist.";
    } finally {
        btnCriarPlaylist.disabled = false;
    }
});

// ========================================
// AUTENTICAÇÃO
// ========================================

observarUsuario(async (usuario) => {
    if (!usuario) {
        window.location.replace("./usuario.html");
        return;
    }

    // Evita carregar novamente para o mesmo usuário.
    if (usuarioAtual?.uid === usuario.uid) return;

    usuarioAtual = usuario;
    emailUsuario.textContent = usuario.email || "";

    await carregarPlaylists();
});

// ========================================
// SAIR
// ========================================

btnSair.addEventListener("click", async () => {
    btnSair.disabled = true;

    try {
        await fazerLogout();
        window.location.replace("./usuario.html");
    } catch (erro) {
        console.error("Erro ao sair:", erro);

        mensagem.textContent =
            "Não foi possível sair da conta.";

        btnSair.disabled = false;
    }
});